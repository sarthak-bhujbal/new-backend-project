
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    apiUrl: process.env.API_URL || '',
    apiToken: process.env.API_TOKEN || '',
    apiSecret: process.env.API_SECRET || '',
    apiKey: process.env.API_KEY || '',

    group1: {
        client_id: (process.env.GROUP1_GROUP_ID || '0'),
        instanceUrl: process.env.GROUP1_INSTANCE_URL || '',
        instanceToken: process.env.GROUP1_INSTANCE_TOKEN || ''
    },
    app_debug: process.env.APP_DEBUG === 'true',
    app_port: process.env.APP_PORT || '3001',
    app_host: process.env.APP_HOST || '0.0.0.0',
    db: {
        name: process.env.DATABASE_NAME as string,
        user: process.env.DATABASE_USERNAME as string,
        password: process.env.DATABASE_PASSWORD as string,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        dialect: process.env.DATABASE_DIALECT || 'postgres',
    }

};