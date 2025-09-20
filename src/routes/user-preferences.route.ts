import userPreferencesController from '../controllers/user-preferences.controller';

const userPreferencesRoutes = [
    {
        method: 'POST',
        url: '/user-preferences/create',
        // preHandler: decodeToken,
        handler: userPreferencesController.createPreference,
    },
]

export default userPreferencesRoutes;