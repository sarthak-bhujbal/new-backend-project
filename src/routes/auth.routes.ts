import authController from "../controllers/auth.controller";
import { decodeToken } from "../middleware/verify-token";

const authRoutes = [
    {
        method: 'POST',
        url: '/request-otp',
        handler: authController.requestOtp,
    },
    {
        method: 'POST',
        url: '/verify-otp',
        handler: authController.verifyOtp,
    },
    {
        method: 'POST',
        url: '/login',
        handler: authController.login,
    },
    {
        method: 'POST',
        url: '/refresh-token',
        handler: authController.refreshToken,
    },
    {
        method: 'GET',
        url: '/profile',
        preHandler: decodeToken,
        handler: authController.getCurrentUser,
    },
    {
        method: 'POST',
        url: '/logout',
        preHandler: decodeToken,
        handler: authController.logout,
    },
    {
        method: 'POST',
        url: '/request-otp-phoneNumber',
        handler: authController.sendOtpToAnyPhone,
    },
    // {
    //     method: 'POST',
    //     url: '/verifyOtp',
    //     handler: authController.verifyOtpForAnyPhone,
    // },
    {
        method: 'PUT',
        url: '/device/:device_id/setup',
        handler: authController.setupDeviceHandler,
    },

    // New routes for forgot password
    {
        method: 'POST',
        url: '/request-password-reset',
        handler: authController.requestPasswordReset,
    },
    {
        method: 'POST',
        url: '/verify-password-reset-otp',
        handler: authController.verifyPasswordResetOtp,
    },
    {
        method: 'POST',
        url: '/reset-password',
        handler: authController.resetPassword,
    },
    {
        method: 'POST',
        url: '/check-password',
        handler: authController.checkPassword,
    }
]

export default authRoutes;