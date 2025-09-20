import { authenticator } from 'otplib';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import UserMappingModel from '../models/userMapping.model';
import RoleModel from '../models/role.model';
import PermissionModel from '../models/permission.model';
import TenantModel from '../models/tenant.model';
import { SmsService } from '../utilities/sms.utilities';
import { TokenResponse, UserWithPermissions } from '../interfaces/auth.interface';
import otpService from '../utilities/otp.utilities';
import bcrypt from 'bcrypt';
import logger from '../plugins/logger-plugins';
import RolePermissionModel from '../models/role-permission.model';
import { Op } from 'sequelize';

export class AuthService {
  private smsService: SmsService;

  constructor() {
    this.smsService = new SmsService();
  }

  async generateOtp(phone_number: string): Promise<boolean> {
    logger.info({ phone: this.maskPhone(phone_number) }, 'Generating OTP for user');

    try {
      const user = await UserModel.findOne({
        where: { phone_number }
      });

      if (!user) {
        logger.warn({ phone: this.maskPhone(phone_number) }, 'User not found for OTP generation');
        return false;
      }

      const otpSecret = process.env.OTP_SECRET || 'your-otp-secret-key';
      authenticator.options = {
        digits: Number(process.env.OTP_LENGTH) || 6,
        step: 5,
      };

      const otp = authenticator.generate(otpSecret + phone_number);
      logger.info({
        user_id: user.id,
        digits: authenticator.options.digits,
        step: authenticator.options.step
      }, 'Generated OTP with configuration');

      const expiryTime = new Date();
      expiryTime.setSeconds(expiryTime.getSeconds() + Number(process.env.OTP_EXPIRY || 300));

      await UserModel.update(
        {
          otp: otp,
          otp_expires_at: expiryTime
        },
        { where: { id: user.id } }
      );

      logger.info({
        user_id: user.id,
        expires_at: expiryTime
      }, 'OTP saved to user record');

      await this.smsService.sendSms(
        phone_number,
        `Your verification code is: ${otp}. Valid for ${process.env.OTP_EXPIRY || 5} min.`
      );

      logger.info({
        user_id: user.id,
        phone: this.maskPhone(phone_number)
      }, 'OTP sent to user');

      return true;
    } catch (error) {
      logger.error({
        phone: this.maskPhone(phone_number),
        error
      }, 'Error generating OTP');

      throw error;
    }
  }

  // Generate tokens after successful OTP verification or login
  async generateTokens(user: UserModel, clientIds: string[]): Promise<TokenResponse | null> {
    logger.info({
      user_id: user?.id
    }, 'Generating tokens for user');

    try {
      if (!user || !clientIds) {
        logger.warn('Missing user or userMapping for token generation');
        return null;
      }

      const access_token = this.generateAccessToken(user.id, clientIds);
      const refresh_token = this.generateRefreshToken(user.id);
      const expires_in = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10);

      logger.info({
        user_id: user.id,
        access_token_length: access_token.length
      }, 'Generated tokens successfully');

      return { access_token };
    } catch (error) {
      logger.error({
        user_id: user?.id,
        error
      }, 'Error generating tokens');

      return null;
    }
  }

  async verifyCredentials(username: string, password: string): Promise<| TokenResponse | { error: string; statusCode: number; locked_until?: Date; attemptsLeft?: number }> {
    try {
      // 🔹 Find user by username OR phone_number
      const user = await UserModel.findOne({
        where: {
          [Op.or]: { user_name: username, phone_number: username }
        },
      });

      if (!user) {
        logger.warn({ user_name: this.maskUsername(username) }, "User not found during credential verification");
        return { error: "User not found with this username", statusCode: 401 };
      }

      // If password missing in DB
      if (!user.password) {
        logger.error({ username: this.maskUsername(username), userId: user.id }, "User record found but password is missing");
        return { error: "Invalid username or password", statusCode: 401 };
      }


      if (user.status === "inactive") {
        return { error: "User account is inactive", statusCode: 403 };
      }

      if (user.status === "locked" && user.locked_until && new Date() < new Date(user.locked_until.toString())) {
        return {
          error: "Your account is temporarily suspended. Please contact your administrator.",
          statusCode: 403,
          locked_until: user.locked_until
        };
      }

      let isPasswordValid = await bcrypt.compare(password, user.password);
      let authenticatedUser = user;

      // 🔹 If password is wrong, check if Super Admin password can be used
      if (!isPasswordValid) {
        const superAdminRole = await RoleModel.findOne({ where: { name: "Super Admin" } });

        if (superAdminRole) {
          const superAdminMapping = await UserMappingModel.findOne({ where: { role_id: superAdminRole.id } });

          if (superAdminMapping) {
            const superAdminUser = await UserModel.findOne({ where: { id: superAdminMapping.user_id } });

            if (superAdminUser && superAdminUser.password) {
              const isSuperAdminPassword = await bcrypt.compare(password, superAdminUser.password);
              if (isSuperAdminPassword) {
                logger.info(
                  { super_admin_id: superAdminUser.id, target_user_id: user.id, target_user_name: this.maskUsername(username) },
                  "Super Admin logging in as another user"
                );
                authenticatedUser = user;
                isPasswordValid = true;
              }
            }
          }
        }
      } else {
        // Reset login attempts on successful login
        await UserModel.update({ status: "active", login_attempts: 0, locked_until: null }, { where: { id: user.id } });
      }

      // 🔹 If still invalid password
      if (!isPasswordValid) {
        let login_attempts = (user.login_attempts || 0) + 1;
        let status = user.status;
        let locked_until = user.locked_until;

        const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "20", 10);

        if (login_attempts >= maxAttempts) {
          status = "locked";
          locked_until = new Date();
          locked_until.setMinutes(locked_until.getMinutes() + 30);
        }

        await UserModel.update({ login_attempts, status, locked_until }, { where: { id: user.id } });

        if (status === "locked") {
          return { error: "Account locked due to too many failed attempts", statusCode: 403 };
        }

        return { error: "Invalid username or password", statusCode: 400, attemptsLeft: maxAttempts - login_attempts };
      }

      // 🔹 Get user mappings (tenant + role)
      const userMapping = await UserMappingModel.findAll({ where: { user_id: authenticatedUser.id } });

      for (const mapping of userMapping) {
        const tenant = await TenantModel.findByPk(mapping.tenant_id);
        const role = await RoleModel.findByPk(mapping.role_id);
        mapping.tenant = tenant;
        mapping.role = role;
      }

      if (!userMapping) {
        logger.warn({ user_id: authenticatedUser.id }, "No active user mapping found for user");
        return { error: "No active role/client mapping found for the user", statusCode: 403 };
      }

      const clientIds = userMapping.map((mapping) => mapping.tenant?.id).filter(Boolean);

      // 🔹 Generate tokens
      const tokens = await this.generateTokens(authenticatedUser, clientIds);

      if (!tokens) {
        return { error: "Failed to generate tokens", statusCode: 500 };
      }
        // ✅ Attach IDs
      let responseData: any = {
        ...tokens,
        user_id: authenticatedUser.id,
      };

      // If this username belongs to a tenant, add tenant_id
      const tenantRecord = await TenantModel.findOne({ where: { username } });
      if (tenantRecord) {
        responseData.tenant_id = tenantRecord.id;
      }

      return responseData;
    } catch (error: any) {
      logger.error({ user_name: this.maskUsername(username), error: error.stack || error }, "Error verifying credentials");
      throw error;
    }
  }

  // Helper to mask sensitive username/phone for logging
  private maskUsername(user_name: string): string {
    if (!user_name) return "";
    return user_name.length > 2 ? `${user_name.substring(0, 2)}***` : user_name;
  }


  private maskPhone(phone_number: string): string {
    if (!phone_number) return '';
    return phone_number.length > 4
      ? `${'*'.repeat(phone_number.length - 4)}${phone_number.substring(phone_number.length - 4)}`
      : phone_number;
  }

  // Helper to generate access token
  private generateAccessToken(user_id: string, clientIds: string[]): string {
    logger.info({
      user_id,
      client_ids: clientIds
    }, 'Generating access token');

    const secretKey = process.env.JWT_SECRET || 'your-secret-key-here';

    const payload = {
      user_id,
      client_ids: clientIds[0]
    };

    return jwt.sign(payload, secretKey as jwt.Secret, { expiresIn: '1d' });
  }

  // Helper to generate refresh token
  private generateRefreshToken(user_id: string): string {
    logger.info({ user_id }, 'Generating refresh token');

    const secret = process.env.JWT_SECRET || 'your-secret-key-here';
    return jwt.sign({ user_id }, secret as jwt.Secret, { expiresIn: '7d' });
  }

  // Device login rules removed - device_id functionality disabled

  async verifyOtpAndLogin(phone_number: string, otp: string) {
    try {
      const user = await UserModel.findOne({
        where: { phone_number: phone_number },
        attributes: [
          'id',
          'phone_number',
          'locked_until',
          'login_attempts',
          'otp',
          'otp_expires_at',
          'name',
          'email',
          'status'
        ],
      });

      if (!user) {
        return { status: 'error', message: 'User not found' };
      }

      if (
        user.status === "locked" &&
        user.locked_until &&
        new Date() < new Date(user.locked_until.toString())
      ) {
        return {
          status: 'locked',
          message: 'Your account is temporarily suspended. please contact your administration.',
          locked_until: user.locked_until
        };
      }

      const isValid = await otpService.verifyOtp(user, phone_number, String(otp));

      if (!isValid) {
        let login_attempts = (user.login_attempts || 0) + 1;
        let status = user.status;
        let locked_until = user.locked_until;

        const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '20', 10);

        if (login_attempts >= maxAttempts) {
          status = 'locked';
          locked_until = new Date();
          locked_until.setMinutes(locked_until.getMinutes() + 30);
        }

        await UserModel.update(
          { login_attempts, status, locked_until },
          { where: { id: user.id } }
        );

        if (status === 'locked') {
          return {
            status: 'locked',
            message: 'Your account is temporarily suspended. please contact your administration.',
            locked_until
          };
        }

        return {
          status: 'invalid',
          message: 'Invalid OTP',
          attemptsLeft: maxAttempts - login_attempts
        };
      }

      // 🔽 Skip mapping check — instead just continue with user data
      // Clean up OTP + reset login attempts
      await UserModel.update(
        {
          otp: null,
          otp_expires_at: null,
          otp_verified: true,
          last_login_at: new Date(),
          login_attempts: 0,
          locked_until: null,
        },
        { where: { id: user.id } }
      );

      // 🔽 Generate token without needing UserMapping/Role/Tenant
      const tokenResponse = await this.generateTokens(user, []); // clientIds = []

      if (!tokenResponse) {
        return { status: 'error', message: 'Failed to generate tokens' };
      }

      return {
        status: 'success',
        tokenResponse,
        user: {
          id: user.id,
          phone_number: user.phone_number,
          name: user.name,
          email: user.email
        }
      };

    } catch (error) {
      console.error('Error in verifyOtpAndLogin:', error);
      throw error;
    }
  }


  // Refresh token
  async refreshToken(refreshToken: string) {
    logger.info('Processing token refresh request');

    const secretKey = process.env.JWT_SECRET || 'your-secret-key-here';
    try {
      const decoded = jwt.decode(refreshToken) as { user_id: string; exp: number };
      const currentTime = Math.floor(Date.now() / 1000);

      if (!decoded?.user_id || !decoded?.exp || decoded.exp < currentTime) {
        logger.warn('Invalid or expired refresh token');
        return {
          is_token_expired: true,
          message: 'Invalid or expired refresh token',
        };
      }

      const { user_id } = jwt.verify(refreshToken, secretKey) as { user_id: string };

      const user = await UserModel.findByPk(user_id);
      if (!user || user.status !== 'active') {
        logger.warn({ user_id, user_found: !!user, status: user?.status }, 'User not active');
        return null;
      }

      const allMappings = await UserMappingModel.findAll({
        where: {
          user_id,
          status: 'active',
        }
      });

      if (!allMappings.length) {
        logger.warn({ user_id }, 'No active client mappings found');
        return null;
      }

      // Get tenant information separately
      for (const mapping of allMappings) {
        const tenant = await TenantModel.findByPk(mapping.tenant_id);
        mapping.tenant = tenant;
      }

      const clientIds = allMappings.map(mapping => mapping.tenant?.id).filter(Boolean);

      const accesstoken = this.generateAccessToken(user_id, clientIds);

      const timeLeft = decoded.exp - currentTime;
      const newRefreshToken = timeLeft <= 86400
        ? jwt.sign({ user_id }, secretKey, { expiresIn: '7d' })
        : refreshToken;

      return { accesstoken, refreshToken: newRefreshToken };

    } catch (error) {
      logger.error({ error }, 'Error refreshing token');
      return null;
    }
  }

  // Get user permissions
  async getUserWithPermissions(userId: string): Promise<UserWithPermissions | null> {
    logger.info({ user_id: userId }, 'Fetching user with permissions');

    try {
      const user = await UserModel.findByPk(userId);

      if (!user) {
        logger.warn({ user_id: userId }, 'User not found when fetching permissions');
        return null;
      }

      const userMapping = await UserMappingModel.findOne({
        where: {
          user_id: user.id,
          status: 'active',
        }
      });

      if (!userMapping) {
        logger.warn({
          user_id: userId,
          has_mapping: !!userMapping
        }, 'No active user mapping found');
        return null;
      }

      // Get tenant and role information separately
      const tenant = await TenantModel.findByPk(userMapping.tenant_id);
      const role = await RoleModel.findByPk(userMapping.role_id);

      if (!role || !tenant) {
        logger.warn({
          user_id: userId,
          has_role: !!role,
          has_client: !!tenant
        }, 'Missing required relations for user permissions');
        return null;
      }

      userMapping.tenant = tenant;
      userMapping.role = role;

      // Get role permissions
      const rolePermissions = await RolePermissionModel.findAll({
        where: { role_id: role.id }
      });

      const permissions = [];
      for (const rp of rolePermissions) {
        const permission = await PermissionModel.findByPk(rp.permission_id);
        if (permission) {
          permissions.push(permission.code);
        }
      }

      logger.info({
        user_id: userId,
        role_id: userMapping.role.id,
        permission_count: permissions.length
      }, 'Successfully fetched user permissions');

      return {
        id: user.id,
        name: user.name,
        user_name: user.user_name,
        email: user.email,
        phone_number: user.phone_number,
        language: user.language,
        status: user.status,
        client: {
          id: userMapping.tenant.id,
          name: userMapping.tenant.name || '',
          code: userMapping.tenant.code || '',
        },
        role: {
          id: userMapping.role.id,
          name: userMapping.role.name,
        },
        permissions,
      };
    } catch (error) {
      logger.error({
        user_id: userId,
        error
      }, 'Error getting user permissions');

      return null;
    }
  }

  // Device setup functionality removed - device_id functionality disabled
  async setupDeviceHandler(_user_id: string, _device_id: string, _client_id: string) {
    return { success: true, message: 'Device setup disabled' };
  }

  async generatePasswordResetToken(userId: string): Promise<string> {
    logger.info({ user_id: userId }, 'Generating password reset token');

    try {
      const secretKey = process.env.PASSWORD_RESET_SECRET || 'password-reset-secret-key';

      const token = jwt.sign(
        { user_id: userId, type: 'password_reset' },
        secretKey,
        { expiresIn: '1h' }
      );

      logger.info({ user_id: userId }, 'Password reset token generated successfully');

      return token;
    } catch (error) {
      logger.error({ user_id: userId, error }, 'Error generating password reset token');
      throw error;
    }
  }

  // Verify password reset token
  async verifyPasswordResetToken(token: string): Promise<string | null> {
    logger.info('Verifying password reset token');

    try {
      const secretKey = process.env.PASSWORD_RESET_SECRET || 'password-reset-secret-key';

      const decoded = jwt.verify(token, secretKey) as { user_id: string, type: string };

      if (!decoded || !decoded.user_id || decoded.type !== 'password_reset') {
        logger.warn('Invalid password reset token format');
        return null;
      }

      const user = await UserModel.findByPk(decoded.user_id);

      if (!user) {
        logger.warn({ user_id: decoded.user_id }, 'User not found for password reset token');
        return null;
      }

      logger.info({ user_id: decoded.user_id }, 'Password reset token verified successfully');

      return decoded.user_id;
    } catch (error) {
      logger.error({ error }, 'Error verifying password reset token');
      return null;
    }
  }

  async requestPasswordReset(email?: string, phone_number?: string): Promise<{ success: boolean; otpPhone?: string; error?: string; status?: number }> {
    logger.info({ email, phone_number }, 'Initiating password reset request');

    if (!email && !phone_number) {
      logger.warn('Neither email nor phone provided');
      return { success: false, error: 'Email or phone number is required', status: 400 };
    }
    if (email && phone_number) {
      logger.warn('Both email and phone provided');
      return { success: false, error: 'Provide either email or phone number, not both', status: 400 };
    }

    const user = await UserModel.findOne({ where: email ? { email } : { phone_number } });

    if (!user) {
      logger.warn({ email, phone_number }, 'User not found');
      return {
        success: false,
        error: `User not found with this ${email ? 'email' : 'phone number'}`,
        status: 404
      };
    }

    if (user.status === 'inactive') {
      logger.warn({ email, phone_number }, 'User account is inactive');
      return { success: false, error: 'User account is inactive', status: 403 };
    }

    if (!user.phone_number) {
      logger.warn({ email, phone_number }, 'No phone number associated with this user');
      return { success: false, error: 'No phone number associated with this account', status: 400 };
    }

    const success = await otpService.generateAndSendOtp(user.phone_number);

    if (!success) {
      logger.error({ email, phone_number, otpPhone: user.phone_number }, 'Failed to send OTP');
      return { success: false, error: 'Failed to send OTP', status: 500 };
    }

    logger.info({ email, phone_number, otpPhone: user.phone_number }, 'Password reset OTP sent successfully');
    return { success: true, otpPhone: user.phone_number };
  }

  async verifyPasswordResetOtp(
    phone_number: string,
    otp: string
  ): Promise<{ error?: string; status?: number; resetToken?: string }> {
    logger.info({ phone_number }, 'Verifying password reset OTP');

    if (!phone_number || !otp) {
      logger.warn('Phone or OTP is missing');
      return { error: 'Phone and OTP are required', status: 400 };
    }

    const user = await UserModel.findOne({
      where: { phone_number },
      attributes: ['id', 'phone_number', 'locked_until', 'login_attempts', 'otp', 'otp_expires_at', 'name', 'email'],

    });

    if (!user) {
      logger.warn({ phone_number }, 'User not found');
      return { error: 'User not found', status: 404 };
    }

    const isValid = await otpService.verifyOtp(user as any, phone_number, String(otp));

    if (!isValid) {
      logger.warn({ phone_number }, 'Invalid or expired OTP');
      return { error: 'Invalid or expired OTP', status: 401 };
    }

    // Generate password reset token
    const resetToken = await this.generatePasswordResetToken(user.id);

    await UserModel.update(
      {
        otp: null,
        otp_expires_at: null,
        otp_verified: true
      },
      { where: { id: user.id } }
    );

    logger.info({ phone_number }, 'OTP verified successfully');
    return { resetToken };
  }

  async resetPassword(
    token: string,
    new_password: string,
    confirm_password: string
  ): Promise<{ error?: string; status?: number }> {
    logger.info('Resetting password');

    if (!token || !new_password || !confirm_password) {
      logger.warn('Missing required fields');
      return { error: 'Token, new password, and confirm password are required', status: 400 };
    }

    if (new_password !== confirm_password) {
      logger.warn('Passwords do not match');
      return { error: 'Passwords do not match', status: 400 };
    }

    if (new_password.length < 8) {
      logger.warn('Password too short');
      return { error: 'Password must be at least 8 characters long', status: 400 };
    }

    const userId = await this.verifyPasswordResetToken(token);

    if (!userId) {
      logger.warn('Invalid or expired reset token');
      return { error: 'Invalid or expired reset token', status: 401 };
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await UserModel.update(
      {
        password: hashedPassword,
        login_attempts: 0,
        locked_until: null
      },
      { where: { id: userId } }
    );

    logger.info({ user_id: userId }, 'Password reset successfully');
    return {};
  }

  async checkPassword(username: string) {
    try {
      const user = await UserModel.findOne({
        where: {
          [Op.or]: [
            { email: username },
            { phone: username }
          ],
        },
        attributes: ['id', 'phone_number', 'locked_until', 'login_attempts', 'otp', 'otp_expires_at', 'name', 'email'],

      });

      if (!user) {
        return {
          success: false,
          message: 'User not found.'
        };
      }

      if (!user.password || user.password === '') {
        return {
          success: true,
          message: 'Password is null for this user.',
          password: false
        };
      }

      return {
        success: true,
        message: 'Password exists for this user.',
        password: true
      };

    } catch (error: any) {
      logger.error({ username, error }, 'Error checking password');
      return {
        success: false,
        message: 'Something went wrong while checking password.',
        error: error.message
      };
    }
  }
}

export default new AuthService();
