export interface Role {
  id?: string;
  tenant_id: string;
  name: string;
  short_code: string;
  description?: string;
  client_id: string;
  is_system?: boolean;
  is_default?: boolean;
  enabled?: boolean;
  permissions?: string[];
  created_by?: string;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type CreateRoleRequest = Pick<
  Role,
  'name' | 'short_code' | 'description' | 'is_default' | 'permissions' | 'client_id'
>;

export type CreateRoleInput = Pick<
  Role,
  'tenant_id' | 'name' | 'short_code' | 'description' | 'client_id' | 'is_system' | 'is_default' | 'permissions' | 'created_by' | 'updated_by'
>;
