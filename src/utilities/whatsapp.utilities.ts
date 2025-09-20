import axios from 'axios';
import { config } from '../config/env.config';
import { WhatsappMessage, MessagePayload } from '../interfaces/whatsapp.interface';
import logger from '../plugins/logger-plugins';

export class WhatsappService {
  private instance: { url: string; token: string };

  constructor() {
    this.instance = {
      url: config.group1.instanceUrl,
      token: config.group1.instanceToken
    };

    logger.debug({
      instanceUrl: this.instance.url
    }, 'WhatsApp service initialized');
  }

  private maskPhone(phone: string): string {
    return phone.replace(/(\d{2})\d{5}(\d{2})/, '$1*****$2');
  }

  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    logger.info({
      phone: this.maskPhone(phoneNumber)
    }, 'Sending SMS via WhatsApp');

    try {
      const formData = new URLSearchParams();
      formData.append('token', this.instance.token);
      formData.append('to', phoneNumber);
      formData.append('body', message);
      formData.append('sendDelay', '1');
      formData.append('priority', '10');

      const response = await axios.post(
        `https://api.ultramsg.com/${this.instance.url}/messages/chat?priority=10`,
        formData,
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      );

      logger.info({
        phone: this.maskPhone(phoneNumber),
        status: response.status
      }, 'SMS sent successfully via WhatsApp');

      return true;
    } catch (error) {
      logger.error({
        phone: this.maskPhone(phoneNumber),
        error
      }, 'Error sending SMS via WhatsApp');
      return false;
    }
  }

  async sendMessage(
    toNumber: string,
    messageType: string,
    otp?: string,
    body?: string,
    image?: string,
    video?: string,
    contact?: string,
    address?: string,
    lat?: string,
    lng?: string,
    filename?: string,
    document?: string,
    caption?: string
  ): Promise<string> {
    logger.info({
      phone: this.maskPhone(toNumber),
      messageType
    }, 'Sending WhatsApp message');

    const formData = new URLSearchParams();
    formData.append('token', this.instance.token);
    formData.append('to', toNumber);
    formData.append('sendDelay', '5');

    let url = '';

    switch (messageType) {
      case 'message':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/chat?priority=8`;
        formData.append('body', body || '');
        break;
      case 'otp':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/chat?priority=10`;
        const otpMessage = otp
          ? `Your verification code is: ${otp}. This OTP is valid for the next ${process.env.OTP_EXPIRY || 5} min.`
          : body || '';
        formData.append('body', otpMessage);
        formData.append('sendDelay', '1');
        break;
      case 'image':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/image?priority=8`;
        formData.append('image', image || '');
        if (caption) formData.append('caption', caption);
        break;
      case 'video':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/video?priority=8`;
        formData.append('video', video || '');
        if (caption) formData.append('caption', caption);
        break;
      case 'contact':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/contact?priority=8`;
        formData.append('contact', contact || '');
        break;
      case 'location':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/location?priority=8`;
        formData.append('address', address || '');
        formData.append('lat', lat || '');
        formData.append('lng', lng || '');
        break;
      case 'document':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/document?priority=8`;
        formData.append('filename', filename || '');
        formData.append('document', document || '');
        if (caption) formData.append('caption', caption);
        break;
      default:
        url = `https://api.ultramsg.com/${this.instance.url}/messages/chat?priority=8`;
        formData.append('body', "Message type not specified");
        break;
    }

    try {
      const response = await axios.post(url, formData, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      });

      logger.info({
        phone: this.maskPhone(toNumber),
        messageType,
        status: response.status
      }, 'WhatsApp message sent successfully');

      return JSON.stringify(response.data);
    } catch (error) {
      logger.error({
        phone: this.maskPhone(toNumber),
        messageType,
        error
      }, 'WhatsApp API error');
      throw error;
    }
  }

  async sendNotification(
    phoneNumber: string,
    message: string
  ): Promise<string> {
    logger.info({
      phone: this.maskPhone(phoneNumber),
      messageLength: message.length
    }, 'Sending WhatsApp notification');

    const formData = new URLSearchParams();
    formData.append('token', this.instance.token);
    formData.append('to', phoneNumber);
    formData.append('body', message);
    formData.append('sendDelay', '5');

    try {
      const response = await axios.post(
        `https://api.ultramsg.com/${this.instance.url}/messages/chat?priority=8`,
        formData,
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      );

      logger.info({
        phone: this.maskPhone(phoneNumber),
        status: response.status
      }, 'WhatsApp notification sent successfully');

      return JSON.stringify(response.data);
    } catch (error) {
      logger.error({
        phone: this.maskPhone(phoneNumber),
        error
      }, 'WhatsApp API error sending notification');
      throw error;
    }
  }

  async sendMultipleMessages(
    messages: WhatsappMessage[],
    priority: number = 10,
    sendDelay: number = 10
  ): Promise<void> {
    logger.info({
      messageCount: messages.length,
      priority,
      sendDelay
    }, 'Sending multiple WhatsApp messages');

    try {
      for (const message of messages) {
        await this.sendSingleMessage(message.type, message.payload, priority, sendDelay);
      }

      logger.info({
        messageCount: messages.length
      }, 'Successfully sent all messages in batch');
    } catch (error) {
      logger.error({
        messageCount: messages.length,
        error
      }, 'Error sending multiple WhatsApp messages');
      throw error;
    }
  }

  private async sendSingleMessage(
    type: string,
    payload: MessagePayload,
    priority: number,
    sendDelay: number
  ): Promise<string> {
    logger.debug({
      type,
      recipient: this.maskPhone(payload.to),
      priority,
      sendDelay
    }, 'Sending single message');

    const formData = new URLSearchParams();
    formData.append('token', this.instance.token);
    formData.append('to', payload.to);
    formData.append('sendDelay', sendDelay.toString());

    let url = '';

    switch (type) {
      case 'message':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/chat?priority=${priority}`;
        formData.append('body', payload.body || '');
        break;
      case 'image':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/image?priority=${priority}`;
        formData.append('image', payload.image || '');
        if (payload.caption) formData.append('caption', payload.caption);
        break;
      case 'document':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/document?priority=${priority}`;
        formData.append('document', payload.document || '');
        if (payload.caption) formData.append('caption', payload.caption);
        break;
      case 'location':
        url = `https://api.ultramsg.com/${this.instance.url}/messages/location?priority=${priority}`;
        formData.append('address', payload.address || '');
        formData.append('lat', payload.lat || '');
        formData.append('lng', payload.lng || '');
        break;
      default:
        url = `https://api.ultramsg.com/${this.instance.url}/messages/chat?priority=${priority}`;
        formData.append('body', "Unknown message type");
        break;
    }

    const response = await axios.post(url, formData, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    });

    return JSON.stringify(response.data);
  }
}

export const whatsappService = new WhatsappService();