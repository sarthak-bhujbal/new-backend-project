export interface DocumentAttributes {
  id?: string;
  agent_id?: string | null;
  customer_id?: string | null;
  file_name: string;
  file_path: string;
  file_type: 'pdf' | 'image';
  created_at?: Date;  // match DB column
  updated_at?: Date;
}
