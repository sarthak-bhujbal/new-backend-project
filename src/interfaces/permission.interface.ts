export interface CreatedPermission {
    name: string;
    code: string;
    module_id: string;
    description?: string;
    category?: string;
    created_by?: string;
}

export interface UpdatePermissionInterface {
    name?: string;
    code?: string;
    description?: string;
    category?: string;
    is_system?: boolean;
}