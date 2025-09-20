import axios from 'axios';
import logger from '../plugins/logger-plugins'; 
import { config } from '../config/env.config';

export class SmsService {
  constructor() {}

  async sendSms(phone_number: string, message: string): Promise<boolean> {
    try {
      const baseUrl = process.env.WHATSAPP_API_URL || 'https://api.ultramsg.com';
      const instance = (config.group1.instanceUrl || process.env.WHATSAPP_INSTANCE || '').replace(/^\/+|\/+$/g, '');
      const token = config.group1.instanceToken || process.env.WHATSAPP_TOKEN || '';

      if (!instance || !token) {
        logger.error(`Missing UltraMsg credentials (instance/token).`);
        return false;
      }

      const url = `${baseUrl}/${instance}/messages/chat?priority=10`;

      const formData = new URLSearchParams();
      formData.append('token', token);
      formData.append('to', phone_number);
      formData.append('body', message);
      formData.append('sendDelay', '1');
      formData.append('priority', '10');    

      logger.info(`Sending WhatsApp message to ${phone_number}`);

      const response = await axios({
        method: 'POST',
        url,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: formData
      });

      logger.info(`Message sent successfully to ${phone_number}. Response: ${response.status} ${response.statusText}`);
      return true;
    } catch (error: any) {
      logger.error(`Error sending WhatsApp message to ${phone_number}: ${error.message}`,);
      return false;
    }
  }
}

export default new SmsService();
