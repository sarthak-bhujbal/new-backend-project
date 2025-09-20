
export interface Instance {
    url: string;
    token: string;
  }
  
  export interface CredentialGroup {
    instances: Instance[];
  }
  
  export interface MessagePayload {
    to: string;
    body?: string;
    image?: string;
    caption?: string;
    document?: string;
    filename?: string;
    audio?: string;
    video?: string;
    contact?: string;
    address?: string;
    lat?: string;
    lng?: string;
  }
  
  export interface WhatsappMessage {
    type: 'chat' | 'image' | 'document' | 'audio' | 'video' | 'contact' | 'location';
    payload: MessagePayload;
  }
  
  export interface SendMessageRequest {
    to: string;
    body?: string;
    image?: string;
    imageCaption?: string;
    document?: string;
    documentCaption?: string;
    audio?: string;
    video?: string;
    videoCaption?: string;
    priority?: number;
    sendDelay?: number;
  }
  
  export interface SendNotificationRequest {
    phoneNumbers: string;
    message: string;
    //client_id: string;
  }
  
  export interface MessageTypeRequest {
    otp?: string;
    message?: string;
    image?: string;
    caption?: string;
    video?: string;
    contact?: string;
    address?: string;
    lat?: string;
    lng?: string;
    filename?: string;
    document?: string;
    //client_id?: string;
  }