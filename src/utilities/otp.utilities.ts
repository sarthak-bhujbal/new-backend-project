import { authenticator } from 'otplib';
import UserModel from '../models/user.model';
import { SmsService } from './sms.utilities';
import { whatsappService } from './whatsapp.utilities';
import { UserType } from '../interfaces/auth.interface';
import logger from '../plugins/logger-plugins';

export class OtpService {
  private smsService: SmsService;
  private nonRegisteredOtps: Map<string, { otp: string, expiresAt: Date }> = new Map();

  constructor() {
    this.smsService = new SmsService();

    // Configure OTP settings
    authenticator.options = {
      digits: Number(process.env.OTP_LENGTH) || 6,
      step: Number(process.env.OTP_EXPIRY) || 5, 
    };
    
    logger.debug({
      otp_length: authenticator.options.digits,
      otp_expiry: authenticator.options.step
    }, 'OTP service initialized with configuration');
  }

  // Generate a new OTP for a user
 // Generate a new OTP for a user
async generateOtp(user: UserModel): Promise<string> {
  logger.info({
    user_id: user.id,
    phone: this.maskPhone(user.phone_number)
  }, 'Generating OTP for user');

  try {

      const secret = (process.env.OTP_SECRET || 'your-otp-secret-key') + user.phone_number;
      const otp = authenticator.generate(secret);


    const expiryTime = new Date();
      expiryTime.setSeconds(expiryTime.getSeconds() + Number(process.env.OTP_EXPIRY || 300));

    logger.debug({
      user_id: user.id,
      otp_length: otp.length,
      expiry_time: expiryTime.toISOString()
    }, 'Generated OTP and set expiry time');

      // Update user record with new OTP - use snake_case for DB columns
    await UserModel.update(
      {
        otp: String(otp),
        otp_expires_at: expiryTime
      },
      { where: { id: user.id } }
    );
    
    logger.info({ 
      user_id: user.id, 
      otp_type: typeof otp,
      otp_length: otp.length,
      expiry_time: expiryTime.toISOString() 
    }, 'OTP saved to user record');

    return otp;
  } catch (error) {
    logger.error({ 
      user_id: user.id, 
      error 
    }, 'Error generating OTP');
    
    throw error;
  }
}

  // Send OTP via WhatsApp
  async sendOtpViaSms(user: UserModel, otp: string): Promise<boolean> {
    logger.info({ 
      user_id: user.id, 
      phone: this.maskPhone(user.phone_number) 
    }, 'Sending OTP to user');
    
    try {
      const message = `Your verification code is: ${otp}. Valid for ${process.env.OTP_EXPIRY || 5} min.`;

     
      try {
        logger.debug({ 
          user_id: user.id, 
          phone: this.maskPhone(user.phone_number) 
        }, 'Attempting to send OTP via WhatsApp');
        
        await whatsappService.sendMessage(
          user.phone_number,
          'otp',
          otp
        );
        
        logger.info({ 
          user_id: user.id 
        }, 'OTP sent via WhatsApp successfully');
        
        return true;
      } catch (whatsappError) {
        logger.warn({ 
          user_id: user.id, 
          error: whatsappError 
        }, 'Error sending OTP via WhatsApp, falling back to SMS');     
        const smsSent = await this.smsService.sendSms(user.phone_number, message);
        if (smsSent) {
          logger.info({ 
            user_id: user.id 
          }, 'OTP sent via SMS successfully (WhatsApp fallback)');
        } else {
          logger.error({ 
            user_id: user.id 
          }, 'Failed to send OTP via SMS (WhatsApp fallback)');
        }
        
        return smsSent;
      }
    } catch (error) {
      logger.error({ 
        user_id: user.id, 
        error 
      }, 'Error sending OTP');
      return false;
    }
  }

  // Verify OTP - Returns just a boolean indicating if OTP is valid
  async verifyOtp(user: UserType, phone_number: string, otp: string): Promise<boolean> {
    logger.info({ 
      user_id: user?.id, 
      phone_number: this.maskPhone(phone_number),
      received_otp_length: otp?.length
    }, 'Verifying OTP');
    
    try {
      if (!user) {
        logger.warn({ phone_number: this.maskPhone(phone_number) }, 'User not found for OTP verification');
        return false;
      }
  
      if (!user.otp) {
        logger.warn({ user_id: user.id }, 'No OTP found for user');
        return false;
      }
  
      if (user.otp_expires_at) {
        const expiryDate = new Date(user.otp_expires_at.toString());
        const now = new Date();
  
        if (isNaN(expiryDate.getTime())) {
          logger.warn({ 
            user_id: user.id, 
            expiry_date: user.otp_expires_at.toString() 
          }, 'Invalid expiry date format for OTP');
          
          return false;
        }
  
        if (now > expiryDate) {
          logger.warn({ 
            user_id: user.id, 
            expiry_date: expiryDate.toISOString(),
            current_time: now.toISOString()
          }, 'OTP has expired');
          
          return false;
        }
      } else {
        logger.warn({ user_id: user.id }, 'OTP expiry date not set');
        return false;
      }
  

      const isMatch = String(user.otp).trim() === String(otp).trim();
      
      if (isMatch) {
        logger.info({ user_id: user.id }, 'OTP verified successfully');
      } else {
        logger.warn({ user_id: user.id }, 'OTP verification failed - incorrect code');
      }
  
      return isMatch;
    } catch (error) {
      logger.error({ 
        user_id: user?.id, 
        phone: this.maskPhone(phone_number), 
        error 
      }, 'Error verifying OTP');
      
      if (error instanceof Error) {
        logger.error(error.stack);
      } else {
        logger.error('Unknown error:', error as any);
      }
      return false;
    }
  }

  // Generate and send OTP in one step
  async generateAndSendOtp(phone_number: string){
    logger.info({ phone: this.maskPhone(phone_number) }, 'Generating and sending OTP');

    try {
      const user = await UserModel.findOne({ where: { phone_number } });
      if (!user) {
        logger.warn({ phone: this.maskPhone(phone_number) }, 'User not found for OTP generation');
        return {
          success: false,
          statusCode: 404,
          message: 'User not found with this phone number'
        };
      }

      if (user.status === 'inactive') {
        logger.warn({ user_id: user.id }, 'Attempt to send OTP to inactive user');
        return {
          success: false,
          statusCode: 403,
          message: 'User account is inactive'
        };
      }

      if (user.status === 'locked' && user.locked_until && new Date() < user.locked_until) {
        logger.warn({ user_id: user.id }, 'Attempt to send OTP to locked user');
        return {
          success: false,
          statusCode: 403,
          message: 'Account is locked. Please try again later',
          locked_until: user.locked_until
        };
      }

      if (user.status === 'locked') {
        await UserModel.update(
          { status: 'active', login_attempts: 0, locked_until: null },
          { where: { id: user.id } }
        );
        logger.info({ user_id: user.id }, 'User account unlocked after lock period expired');
      }

      const otp = await this.generateOtp(user);
      logger.debug({ user_id: user.id }, 'OTP generated, attempting to send');
      const sent = await this.sendOtpViaSms(user, otp);

      if (sent) {
        logger.info({ user_id: user.id }, 'OTP generated and sent successfully');
        return {
          success: true,
          statusCode: 200,
          message: 'OTP sent successfully'
        };
      } else {
        logger.error({ user_id: user.id }, 'Failed to send generated OTP');
        return {
          success: false,
          statusCode: 500,
          message: 'Failed to send OTP'
        };
      }

    } catch (error) {
      logger.error({
        phone: this.maskPhone(phone_number),
        error
      }, 'Error generating and sending OTP');
      return {
        success: false,
        statusCode: 500,
        message: 'Internal server error'
      };
    }
  }

  // Clear OTP after successful verification
  async clearOtp(userId: string): Promise<void> {
    logger.info({ user_id: userId }, 'Clearing OTP after successful verification');

    try {
      await UserModel.update(
        {
          otp: null,
          otp_expires_at: null,
          otp_verified: true,
        },
        { where: { id: userId } }
      );

      logger.info({ user_id: userId }, 'OTP cleared successfully');
    } catch (error) {
      logger.error({ user_id: userId, error }, 'Error clearing OTP');
      throw error;
    }
  }
  
  // Helper to mask phone number for logging
  private maskPhone(phone_number: string): string {
    if (!phone_number) return '';
    return phone_number.length > 4 
      ? `${'*'.repeat(phone_number.length - 4)}${phone_number.substring(phone_number.length - 4)}`
      : phone_number;
  }

  // Generate OTP for any phone number (without user record)
  async generateOtpForAnyPhone(phone_number: string): Promise<string> {
    logger.info({ 
      phone: this.maskPhone(phone_number) 
    }, 'Generating OTP for any phone number');
    
    try {
      const secret = (process.env.OTP_SECRET || 'your-otp-secret-key') + phone_number;
      const otp = authenticator.generate(secret);

      // Store OTP with expiry in memory
      const expiryTime = new Date();
      expiryTime.setSeconds(expiryTime.getSeconds() + Number(process.env.OTP_EXPIRY || 300));
      
      // Store in the map for non-registered numbers
      this.nonRegisteredOtps.set(phone_number, {
        otp,
        expiresAt: expiryTime
      });
      
      logger.debug({ 
        phone: this.maskPhone(phone_number), 
        expiry_time: expiryTime.toISOString() 
      }, 'Generated OTP for non-registered phone number');

      return otp;
    } catch (error) {
      logger.error({ 
        phone: this.maskPhone(phone_number), 
        error 
      }, 'Error generating OTP for non-registered phone');
      
      throw error;
    }
  }

  // Send OTP via SMS to any phone number
  async sendOtpToAnyPhone(phone_number: string, otp: string): Promise<boolean> {
    logger.info({ 
      phone: this.maskPhone(phone_number) 
    }, 'Sending OTP to any phone number');
    
    try {
      const message = `Your verification code is: ${otp}. Valid for ${process.env.OTP_EXPIRY || 5} min.`;

      try {
        logger.debug({ 
          phone: this.maskPhone(phone_number) 
        }, 'Attempting to send OTP via WhatsApp');
        
        await whatsappService.sendMessage(
          phone_number,
          'otp',
          otp
        );
        
        logger.info({ 
          phone: this.maskPhone(phone_number)
        }, 'OTP sent via WhatsApp successfully');
        
        return true;
      } catch (whatsappError) {
        logger.warn({ 
          phone: this.maskPhone(phone_number), 
          error: whatsappError 
        }, 'Error sending OTP via WhatsApp, falling back to SMS');
        
        // Fallback to SMS
        const smsSent = await this.smsService.sendSms(phone_number, message);
        
        if (smsSent) {
          logger.info({ 
            phone: this.maskPhone(phone_number)
          }, 'OTP sent via SMS successfully (WhatsApp fallback)');
        } else {
          logger.error({ 
            phone: this.maskPhone(phone_number)
          }, 'Failed to send OTP via SMS (WhatsApp fallback)');
        }
        
        return smsSent;
      }
    } catch (error) {
      logger.error({ 
        phone: this.maskPhone(phone_number), 
        error 
      }, 'Error sending OTP to non-registered phone');
      
      return false;
    }
  }

  // Generate and send OTP to any phone in one step
  async generateAndSendOtpToAnyPhone(phone_number: string): Promise<boolean> {
    logger.info({ phone: this.maskPhone(phone_number) }, 'Generating and sending OTP to any phone');
    
    try {
      const otp = await this.generateOtpForAnyPhone(phone_number);
      logger.debug({ phone: this.maskPhone(phone_number) }, 'OTP generated for non-registered phone, attempting to send');

      const sent = await this.sendOtpToAnyPhone(phone_number, otp);
      
      if (sent) {
        logger.info({ phone: this.maskPhone(phone_number) }, 'OTP generated and sent successfully to non-registered phone');
      } else {
        logger.error({ phone: this.maskPhone(phone_number) }, 'Failed to send generated OTP to non-registered phone');
      }
      
      return sent;
    } catch (error) {
      logger.error({ 
        phone: this.maskPhone(phone_number), 
        error 
      }, 'Error generating and sending OTP to non-registered phone');
      
      return false;
    }
  }

  async verifyOtpForAnyPhone(phone_number: string, otp: string): Promise<boolean> {
    logger.info({ 
      phone: this.maskPhone(phone_number) 
    }, 'Verifying OTP for any phone number');
    
    try {
      const otpData = this.nonRegisteredOtps.get(phone_number);

      if (!otpData) {
        logger.warn({ phone: this.maskPhone(phone_number) }, 'No OTP found for this phone number');
        return false;
      }

      const now = new Date();
      if (now > otpData.expiresAt) {
        logger.warn({ 
          phone: this.maskPhone(phone_number), 
          expiry_date: otpData.expiresAt.toISOString(),
          current_time: now.toISOString()
        }, 'OTP has expired');

        this.nonRegisteredOtps.delete(phone_number);
        return false;
      }

      // Verify OTP
      const isMatch = otpData.otp === otp;
      
      if (isMatch) {
        logger.info({ phone: this.maskPhone(phone_number) }, 'OTP verified successfully');
        // Remove used OTP
        this.nonRegisteredOtps.delete(phone_number);
      } else {
        logger.warn({ phone: this.maskPhone(phone_number) }, 'OTP verification failed - incorrect code');
      }

      return isMatch;
    } catch (error) {
      logger.error({ 
        phone: this.maskPhone(phone_number), 
        error 
      }, 'Error verifying OTP for non-registered phone');
      
      return false;
    }
  }
}

export default new OtpService();