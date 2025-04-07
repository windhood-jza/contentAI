/**
 * 日志工具模块
 * @module utils/logger
 * @description 提供应用程序日志记录功能
 */

// 简单的日志记录器
const logger = {
  /**
   * 记录信息日志
   * @param {string} message - 日志消息
   * @param {*} [data] - 附加数据（可选）
   */
  info: (message, data) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data ? data : '');
  },
  
  /**
   * 记录警告日志
   * @param {string} message - 日志消息
   * @param {*} [data] - 附加数据（可选）
   */
  warn: (message, data) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data ? data : '');
  },
  
  /**
   * 记录错误日志
   * @param {string} message - 日志消息
   * @param {*} [error] - 错误对象（可选）
   */
  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error ? error : '');
  },
  
  /**
   * 记录调试日志
   * @param {string} message - 日志消息
   * @param {*} [data] - 附加数据（可选）
   */
  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data ? data : '');
    }
  }
};

module.exports = { logger }; 