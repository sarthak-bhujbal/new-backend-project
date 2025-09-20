import { FastifyRequest, FastifyReply } from 'fastify';
import authService from '../services/auth.service';
import otpService from '../utilities/otp.utilities';
import { RequestOtpRequest, VerifyOtpRequest, LoginRequest, RefreshTokenRequest, UserType, VerifyOtpForAnyPhoneRequest, SendOtpToAnyPhoneRequest, VerifyPasswordResetOtpRequest, ResetPasswordRequest, CheckPasswordRequest } from '../interfaces/auth.interface';
import { access } from 'fs';

export class AuthController {
  private authService: any;
  private otpService: any;

  constructor() {
    this.authService = authService;
    this.otpService = otpService;
  }

  requestOtp = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { phone_number } = request.body as RequestOtpRequest;

      if (!phone_number) {
        return {
          success: false,
          message: 'Phone number is required'
        };
      }

      const result = await this.otpService.generateAndSendOtp(phone_number);

      if (!result.success) {
        const response: any = { message: result.message };
        if (result.locked_until) {
          response.locked_until = result.locked_until;
        }
        return reply.code(result.statusCode || 500).send(response);
      }

      return reply.code(200).send({ message: result.message });

    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  verifyOtp = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { phone_number, otp } = request.body as VerifyOtpRequest;

      if (!phone_number || !otp) {
        return reply.code(400).send({ message: 'Phone and OTP are required' });
      }

      const result = await this.authService.verifyOtpAndLogin(phone_number, otp);

      if (result.status === 'locked') {
        return reply.code(403).send({
          message: result.message,
          locked_until: result.locked_until,
        });
      }

      if (result.status === 'invalid') {
        return reply.code(401).send({
          message: result.message,
          attemptsLeft: result.attemptsLeft,
        });
      }

      if (result.status === 'error') {
        return reply.code(400).send({ message: result.message });
      }

      return reply.code(200).send(result.tokenResponse);

    } catch (error: any) {
      request.log.error(error);
      if (error instanceof Error && error.message.includes('Login restricted to multi devices')) {
        return reply.status(401).send({
          success: false,
          message: "Login restricted to multi devices"
        });
      }
      return reply.code(500).send({ message: 'Internal server error', error: error.message });
    }
  }

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { user_name, password } = request.body as { user_name: string; password: string };

      if (!user_name || !password) {
        return reply.code(400).send({ message: 'Username (email/phone) and password are required' });
      }

      const result = await this.authService.verifyCredentials(user_name, password);

      if ('error' in result) {
        return reply.code(result.statusCode).send(result);
      }

      return reply.code(200).send({
        status_code: 200, 
        ...result,
        access_token: result.access_token,
        message: 'Login successfully'
      });
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message.includes('Login restricted to multi devices')) {
        return reply.status(401).send({
          success: false,
          message: error.message
        });
      }
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { refresh_token } = request.body as RefreshTokenRequest;

      if (!refresh_token) {
        return reply.code(400).send({ message: 'Refresh token is required' });
      }

      const tokenResponse = await this.authService.refreshToken(refresh_token);

      if (!tokenResponse) {
        return reply.code(401).send({
          is_token_expired: true,
          message: 'Invalid or expired refresh token',
        });
      }

      return reply.code(200).send({
        assess_token: tokenResponse.accesstoken,
        refresh_token: tokenResponse.refreshToken
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  getCurrentUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;

      const userWithPermissions = await this.authService.getUserWithPermissions(userId);

      if (!userWithPermissions) {
        return reply.code(404).send({ message: 'User not found' });
      }

      return reply.code(200).send(userWithPermissions);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      return reply.code(200).send({ message: 'Logged out successfully' });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  sendOtpToAnyPhone = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { phone_number } = request.body as SendOtpToAnyPhoneRequest;

      if (!phone_number) {
        return reply.code(400).send({ message: 'Phone number is required' });
      }

      const success = await this.otpService.generateAndSendOtpToAnyPhone(phone_number);

      if (!success) {
        return reply.code(500).send({ message: 'Failed to send OTP' });
      }

      return reply.code(200).send({
        success: true,
        message: 'OTP sent successfully',
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  verifyOtpForAnyPhone = async (request: FastifyRequest, reply: FastifyReply)=> {
    try {
      const { phone_number, otp } = request.body as VerifyOtpForAnyPhoneRequest;

      if (!phone_number || !otp) {
        return reply.code(400).send({ message: 'Phone number and OTP are required' });
      }

      const isValid = await this.otpService.verifyOtpForAnyPhone(phone_number, otp);

      if (!isValid) {
        return reply.code(401).send({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      return reply.code(200).send({
        success: true,
        message: 'OTP verified successfully',
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  setupDeviceHandler = async (request: FastifyRequest, reply: FastifyReply)=> {
    try {
      const user_id = (request.user as { user_id: string }).user_id;
      const { device_id } = request.params as { device_id: string };
      const { client_id } = request.body as { client_id: string };

      const result = await this.authService.setupDeviceHandler(user_id, device_id, client_id);

      if (!result.success) {
        return reply.status(401).send({ message: result.message });
      }

      return reply.code(200).send({ message: 'Device validated successfully.' });
    } catch (error: any) {
      request.log.error(error, 'Error during device validation');
      return reply.status(500).send({ message: 'Internal server error' });
    }
  }

  requestPasswordReset = async (request: FastifyRequest, reply: FastifyReply)=> {
    try {
      const { email, phone_number } = request.body as { email?: string; phone_number?: string };

      if (!email && !phone_number) {
        return reply.status(400).send({ error: 'Email or phone number is required' });
      }
      if (email && phone_number) {
        return reply.status(400).send({ error: 'Provide either email or phone number, not both' });
      }

      const result = await this.authService.requestPasswordReset(email, phone_number);

      if (!result.success) {
        return reply.status(result.status || 404).send({ error: result.error || 'User not found' });
      }

      return reply.code(200).send({
        success: true,
        message: 'Password reset OTP sent successfully',
        email: email || undefined,
        phone: phone_number || undefined,
        otpPhone: result.otpPhone
      });
    } catch (error) {
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  verifyPasswordResetOtp = async (request: FastifyRequest, reply: FastifyReply)=> {
    try {
      const { phone_number, otp } = request.body as VerifyPasswordResetOtpRequest;

      const result = await this.authService.verifyPasswordResetOtp(phone_number, otp);

      if (result.error) {
        return reply.status(result.status || 400).send({ error: result.error });
      }

      return reply.code(200).send({
        success: true,
        message: 'OTP verified successfully',
        reset_token: result.resetToken
      });
    } catch (error) {
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  resetPassword = async (request: FastifyRequest, reply: FastifyReply)=> {
    try {
      const { token, new_password, confirm_password } = request.body as ResetPasswordRequest;

      const result = await this.authService.resetPassword(token, new_password, confirm_password);

      if (result.error) {
        return reply.status(result.status || 400).send({ error: result.error });
      }

      return reply.code(200).send({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  checkPassword = async (request: FastifyRequest, reply: FastifyReply)=> {
    try {
      const { username } = request.body as CheckPasswordRequest;

      const result = await this.authService.checkPassword(username);

      if (!result.success) {
        return reply.status(404).send({
          success: false,
          message: result.message
        });
      }

      return reply.code(200).send({
        success: true,
        message: result.message,
        passwordExists: result.password
      });

    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new AuthController();
