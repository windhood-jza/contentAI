/**
 * 日志工具模块
 * @module utils/logger
 * @description 提供应用程序日志记录功能
 */

const fs = require('fs');
const path = require('path');

// 确保日志目录存在
const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// 获取当前日期作为文件名
const getLogFileName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return path.join(logDirectory, `app-${year}-${month}-${day}.log`);
};

// 写入日志文件
const writeToLogFile = (level, message, data) => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${level}] ${timestamp}: ${message} ${data ? JSON.stringify(data) : ''}\n`;
    fs.appendFileSync(getLogFileName(), logEntry);
  } catch (error) {
    console.error(`写入日志文件失败: ${error.message}`);
  }
};

// 日志记录器
const logger = {
  /**
   * 记录信息日志
   * @param {string} message - 日志消息
   * @param {*} [data] - 附加数据（可选）
   */
  info: (message, data) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data ? data : '');
    writeToLogFile('INFO', message, data);
  },
  
  /**
   * 记录警告日志
   * @param {string} message - 日志消息
   * @param {*} [data] - 附加数据（可选）
   */
  warn: (message, data) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data ? data : '');
    writeToLogFile('WARN', message, data);
  },
  
  /**
   * 记录错误日志
   * @param {string} message - 日志消息
   * @param {*} [error] - 错误对象（可选）
   */
  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error ? error : '');
    writeToLogFile('ERROR', message, error);
  },
  
  /**
   * 记录调试日志
   * @param {string} message - 日志消息
   * @param {*} [data] - 附加数据（可选）
   */
  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data ? data : '');
      writeToLogFile('DEBUG', message, data);
    }
  }
};

module.exports = { logger }; 