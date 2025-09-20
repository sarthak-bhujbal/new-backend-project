import UserPreferences from '../models/user-preferences.model';
import { UserPreferences as IUserPreferences } from '../interfaces/user-preferences.interface';

class UserPreferenceService {
  private response: {
    status_code: number;
    message: string | null;
    error: string | null;
    data: IUserPreferences | null;
  };

  constructor() {
    this.response = {
      status_code: 200,
      message: null,
      error: null,
      data: null,
    };
  }

  public createPreference = async (data: IUserPreferences) => {
    try {
      const created = await UserPreferences.create({ ...data });
      this.response = {
        status_code: 201,
        message: 'User preference created successfully',
        error: null,
        data: created.get({ plain: true }) as IUserPreferences,
      };
    } catch (error: any) {
      console.error('Service - Create Error:', error);
      this.response = {
        status_code: 400,
        message: 'Failed to create user preference',
        error: error.message || 'Error creating user preference',
        data: null,
      };
    }
    return this.response;
  };

}

export default new UserPreferenceService();
