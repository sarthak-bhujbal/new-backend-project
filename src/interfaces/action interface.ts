export interface Action {
  _id: string;
  module_id: string;
  permission_id: string;
  label: string;
  short_code: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GetActionsQueryParams {
  permission_id: any;
  page?: number;
  limit?: number;
  module_id?: string;
}

export interface CreateActionRequest {
  module_id: string;
  permission_id: string;
  label: string;
  short_code: string;
  is_active?: boolean;
}

export interface UpdateActionRequest {
  module_id?: string;
  permission_id?: string;
  label?: string;
  short_code?: string;
  is_active?: boolean;
}

export type ActionPayload = Omit<Action, '_id' | 'created_at' | 'updated_at'>;

export interface ActionListResponse {
  actions: Action[];
  total: number;
  page: number;
  limit: number;
}
