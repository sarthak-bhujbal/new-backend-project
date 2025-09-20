import { Transaction } from "sequelize";
import { getSequelize } from "../plugins/sequelize-plugin";
import logger from "../plugins/logger-plugins";

export interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
  statusCode?: number;
}

export class BaseService {
  /**
   * Execute a function within a transaction
   * @param callback Function to execute within transaction
   * @returns Result of the callback function
   */
  protected async withTransaction<T>(
    callback: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    const transaction = await getSequelize().transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      logger.error({ error }, "Transaction failed");
      throw error;
    }
  }

  /**
   * Create standard success response
   */
  protected success<T>(data?: T, message?: string, statusCode: number = 200): ServiceResponse<T> {
    return {
      success: true,
      message: message || 'Operation successful',
      data,
      statusCode,
    };
  }

  /**
   * Create standard error response
   */
  protected error(message: string, error?: any, statusCode: number = 400): ServiceResponse {
    logger.error({ error }, message);
    return {
      success: false,
      message,
      error,
      statusCode,
    };
  }
}