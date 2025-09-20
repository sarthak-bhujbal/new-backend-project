export const safeParseJSON = <T>(jsonString: any, defaultValue: T, logger: any): T => {
    if (!jsonString) {
        logger.warn({ jsonString }, 'JSON input is empty or null, returning default value');
        return defaultValue;
    }
    if (typeof jsonString !== 'string') {
        logger.warn({ jsonString, type: typeof jsonString }, 'JSON input is not a string, returning as-is');
        return jsonString as T;
    }
    try {
        logger.debug({ jsonString }, 'Attempting to parse JSON');
        return JSON.parse(jsonString) as T;
    } catch (e) {
        logger.error({ error: e, jsonString }, 'Failed to parse JSON');
        return defaultValue;
    }
};

export const parseJsonBoolean = (value: any, logger: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    logger.warn({ value }, 'Unexpected JSON value type, defaulting to false');
    return false;
};
