export default interface CommentInterface {
    id: string;     
    tenant_id: string;
    topic_id: string;
    opinion_id: string;
    description: string;
    user_id: string;
    created_on?: number;
    updated_on?: number;
    created_by?: string;
    updated_by?: string;
}
