import { CreateActionRequest } from "../interfaces/action interface";
import ActionRepository from "../repositories/action.repo";

class ActionService {
    private repo: any;

    constructor() {
        this.repo = new ActionRepository();
    }

    async createAction(actionData: CreateActionRequest) {
        console.info({ actionData }, 'Creating new action');

        try {
            const existingAction = await this.repo.findActionByShortCode(
                actionData.short_code,
                actionData.module_id,
                actionData.permission_id,
            );

            if (existingAction) {
                console.warn({ short_code: actionData.short_code }, 'Action with this short code already exists');
                return { success: false, message: 'Action with this short code already exists for this module' };
            }

            const newAction = await this.repo.createAction(actionData);

            console.info({ action_id: newAction._id }, 'Action created successfully');
            return { success: true, action: newAction };
        } catch (error) {
            console.error({ error }, 'Error creating action');
            return { success: false, message: 'Error creating action', error };
        }
    }
}

export default ActionService;
