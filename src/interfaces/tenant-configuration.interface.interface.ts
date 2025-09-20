
export interface TenantConfiguration {
  id: string;
  type: string;
  sub_type?: string;
  value: string;

  tenant_id: string;
  created_by: string;
  updated_by: string;

  location_id?: string;
  department_id?: string;

  created_at: Date;
  updated_at: Date;
}


export interface CreateTenantConfigurationPayload
  extends Omit<TenantConfiguration, "created_at" | "updated_at"> {}


export interface UpdateTenantConfigurationPayload {
  type: string;
  sub_type?: string;
  value: string;
  location?: string;
  department?: string;
}

export interface TenantConfigurationResponse extends TenantConfiguration {}
