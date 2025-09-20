export default interface OpinionInterface {
  id?: string;
  tenant_id: string;
  topic_id: string;
  debate: string;
  subject?: Record<string, any> | null;
  news?: Record<string, any> | null;
  question?: Record<string, any> | null;
  reference?: Record<string, any> | null;
  debate_members?: boolean;
  debate_open_for_all?: boolean;
  likes?: number;
  user_id: string;
  created_on?: number; 
  updated_on?: number;
  created_by?: string | null;
  updated_by?: string | null;
}
