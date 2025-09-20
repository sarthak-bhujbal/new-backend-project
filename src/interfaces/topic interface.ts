export interface ITopic {
  reference: any;
  questions: any;
  subjects: any;
  topick_id: string;
  teanant_id: string;
  category_id: string;
  name: string;
  topic_type: string;
  subject: any;        
  news: any;           
  question: string;
  referance?: string;
  user_id: string;
  created_on: number;  
  updated_on: number;
  created_by: string;
  updated_by: string;
}

export interface GetTopicsQueryParams {
  category_id?: string;
  page?: number;
  limit?: number;
  user_id?: string;
}

export interface CreateTopicRequest {
  teanant_id: string;
  category_id: string;
  name: string;
  subject?: any;
  news?: any;
  question: string;
  referance?: string;
  user_id: string;
  created_by: string;
  updated_by: string;
}

export interface UpdateTopicRequest {
  category_id?: string;
  name?: string;
  subject?: any;
  news?: any;
  question?: string;
  referance?: string;
  user_id?: string;
  updated_by?: string;
}

export type TopicPayload = Omit<ITopic, 'topick_id' | 'created_on' | 'updated_on'>;

export interface TopicListResponse {
  topics: ITopic[];
  total: number;
  page: number;
  limit: number;
}