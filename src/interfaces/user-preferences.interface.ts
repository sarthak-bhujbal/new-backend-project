
export interface UserPreferences {
  id?: string;
  user_id: string;
  client_id?: string;
  type: string;
  sub_type?: string | null;
  value: any;
  created_at?: Date;
  updated_at?: Date;
}

export type CreateUserPreferenceRequest = Pick<
  UserPreferences,
  'user_id' | 'client_id' | 'type' | 'sub_type' | 'value'
>;

export type UpdateUserPreferenceRequest = Partial<
  Pick<UserPreferences, 'type' | 'sub_type' | 'value'>
>;
