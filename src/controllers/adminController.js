/**
 * 管理员控制器
 * @description 处理管理员验证和配置管理
 */

const config = require('../config');
const fs = require('fs');
const path = require('path');

// 配置历史记录目录
const CONFIG_HISTORY_DIR = path.join(__dirname, '../../config_history');

// 确保历史记录目录存在
if (!fs.existsSync(CONFIG_HISTORY_DIR)) {
  fs.mkdirSync(CONFIG_HISTORY_DIR, { recursive: true });
}

/**
 * 管理员登录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.login = (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户名和密码
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // 设置会话
    req.session.isAuthenticated = true;
    req.session.isAdmin = true;
    req.session.username = username;
    
    // 记录登录时间
    req.session.loginTime = new Date();
    
    return res.json({
      success: true,
      message: '登录成功'
    });
  }
  
  // 登录失败
  res.status(401).json({
    success: false,
    message: '用户名或密码不正确'
  });
};

/**
 * 管理员登出
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: '登出失败',
        error: err.message
      });
    }
    
    res.json({
      success: true,
      message: '登出成功'
    });
  });
};

/**
 * 获取当前配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getConfig = (req, res) => {
  const currentConfig = config.getConfig();
  
  // 脱敏敏感配置项
  const safeConfig = { ...currentConfig };
  if (safeConfig.api && safeConfig.api.apiKey) {
    safeConfig.api.apiKey = '************';
  }
  
  res.json({
    success: true,
    data: safeConfig
  });
};

/**
 * 更新配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.updateConfig = (req, res) => {
  const { key, value } = req.body;
  
  if (!key) {
    return res.status(400).json({
      success: false,
      message: '缺少配置键'
    });
  }
  
  try {
    // 处理配置值的类型转换
    let parsedValue = value;
    
    // 检查key路径的类型，并相应地转换值
    if (key.includes('.')) {
      const parts = key.split('.');
      if (parts.length >= 2) {
        const section = parts[0];
        const field = parts[1];
        
        // API配置
        if (section === 'api') {
          if (['timeout', 'maxRetries', 'requestRateLimit'].includes(field)) {
            // 确保是有效的数字
            const numValue = parseInt(value, 10);
            if (isNaN(numValue)) {
              throw new Error(`${field}必须是有效的数字`);
            }
            parsedValue = numValue;
          }
        }
        
        // 搜索配置
        else if (section === 'search') {
          if (['defaultPageSize', 'maxKeywordLength', 'truncateContentLength'].includes(field)) {
            // 确保是有效的数字
            const numValue = parseInt(value, 10);
            if (isNaN(numValue)) {
              throw new Error(`${field}必须是有效的数字`);
            }
            parsedValue = numValue;
          } else if (field === 'highlightResults') {
            // 确保是布尔值
            parsedValue = value === 'true' || value === true;
          }
        }
        
        // UI配置
        else if (section === 'ui') {
          if (['animationsEnabled', 'showTimestamps'].includes(field)) {
            // 确保是布尔值
            parsedValue = value === 'true' || value === true;
          }
        }
        
        // 缓存配置
        else if (section === 'cache') {
          if (['expiry', 'maxItems'].includes(field)) {
            // 确保是有效的数字
            const numValue = parseInt(value, 10);
            if (isNaN(numValue)) {
              throw new Error(`${field}必须是有效的数字`);
            }
            parsedValue = numValue;
          } else if (field === 'enabled') {
            // 确保是布尔值
            parsedValue = value === 'true' || value === true;
          }
        }
        
        // 性能配置
        else if (section === 'performance') {
          if (['maxConcurrentRequests', 'requestTimeout'].includes(field)) {
            // 确保是有效的数字
            const numValue = parseInt(value, 10);
            if (isNaN(numValue)) {
              throw new Error(`${field}必须是有效的数字`);
            }
            parsedValue = numValue;
          } else if (field === 'logPerformanceMetrics') {
            // 确保是布尔值
            parsedValue = value === 'true' || value === true;
          }
        }
        
        // 反馈配置
        else if (section === 'feedback') {
          if (['enabled', 'collectAnonymousData'].includes(field)) {
            // 确保是布尔值
            parsedValue = value === 'true' || value === true;
          }
        }
      }
    }
    
    console.log(`更新配置: ${key} = ${parsedValue}`);
    
    // 保存之前的配置到历史记录
    const timestamp = Date.now();
    const historyFilePath = path.join(CONFIG_HISTORY_DIR, `config_${timestamp}.json`);
    
    // 记录操作
    const operation = {
      user: req.session.username,
      timestamp,
      action: 'update',
      key,
      oldValue: config.get(key),
      newValue: parsedValue
    };
    
    // 保存当前配置到历史记录
    fs.writeFileSync(
      historyFilePath,
      JSON.stringify({
        config: config.getConfig(),
        operation
      }, null, 2),
      'utf8'
    );
    
    // 更新配置
    const success = config.set(key, parsedValue);
    
    if (success) {
      return res.json({
        success: true,
        message: '配置已更新',
        data: {
          key,
          value: config.get(key),
          timestamp: new Date(operation.timestamp).toISOString(),
          action: operation.action,
          details: operation.key ? `${operation.key}: ${JSON.stringify(operation.oldValue)} -> ${JSON.stringify(operation.newValue)}` : '整体配置更改'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: '更新配置失败'
    });
  } catch (error) {
    console.error('更新配置失败:', error);
    res.status(400).json({
      success: false,
      message: `更新配置失败: ${error.message}`,
      error: error.message
    });
  }
};

/**
 * 重置配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.resetConfig = (req, res) => {
  try {
    // 保存之前的配置到历史记录
    const timestamp = Date.now();
    const historyFilePath = path.join(CONFIG_HISTORY_DIR, `config_${timestamp}.json`);
    
    // 记录操作
    const operation = {
      user: req.session.username,
      timestamp,
      action: 'reset',
      oldConfig: config.getConfig()
    };
    
    // 保存当前配置到历史记录
    fs.writeFileSync(
      historyFilePath,
      JSON.stringify({
        config: config.getConfig(),
        operation
      }, null, 2),
      'utf8'
    );
    
    // 重置配置
    const success = config.reset();
    
    if (success) {
      return res.json({
        success: true,
        message: '配置已重置为默认值',
        data: config.getConfig()
      });
    }
    
    res.status(500).json({
      success: false,
      message: '重置配置失败'
    });
  } catch (error) {
    console.error('重置配置失败:', error);
    res.status(500).json({
      success: false,
      message: '重置配置失败',
      error: error.message
    });
  }
};

/**
 * 导出配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.exportConfig = (req, res) => {
  try {
    const currentConfig = config.getConfig();
    
    // 设置响应头
    res.setHeader('Content-Disposition', 'attachment; filename=config.json');
    res.setHeader('Content-Type', 'application/json');
    
    // 发送配置
    res.json(currentConfig);
  } catch (error) {
    console.error('导出配置失败:', error);
    res.status(500).json({
      success: false,
      message: '导出配置失败',
      error: error.message
    });
  }
};

/**
 * 导入配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.importConfig = (req, res) => {
  try {
    const importedConfig = req.body;
    
    // 验证导入的配置
    if (!importedConfig || typeof importedConfig !== 'object') {
      return res.status(400).json({
        success: false,
        message: '无效的配置格式'
      });
    }
    
    // 保存之前的配置到历史记录
    const timestamp = Date.now();
    const historyFilePath = path.join(CONFIG_HISTORY_DIR, `config_${timestamp}.json`);
    
    // 记录操作
    const operation = {
      user: req.session.username,
      timestamp,
      action: 'import',
      oldConfig: config.getConfig(),
      newConfig: importedConfig
    };
    
    // 保存当前配置到历史记录
    fs.writeFileSync(
      historyFilePath,
      JSON.stringify({
        config: config.getConfig(),
        operation
      }, null, 2),
      'utf8'
    );
    
    // 导入配置
    const success = config.import(importedConfig);
    
    if (success) {
      return res.json({
        success: true,
        message: '配置已导入',
        data: config.getConfig()
      });
    }
    
    res.status(500).json({
      success: false,
      message: '导入配置失败'
    });
  } catch (error) {
    console.error('导入配置失败:', error);
    res.status(500).json({
      success: false,
      message: '导入配置失败',
      error: error.message
    });
  }
};

/**
 * 获取配置历史记录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getConfigHistory = (req, res) => {
  try {
    // 读取历史记录目录
    const files = fs.readdirSync(CONFIG_HISTORY_DIR);
    
    // 按时间排序（最新的在前）
    const sortedFiles = files
      .filter(file => file.startsWith('config_') && file.endsWith('.json'))
      .sort((a, b) => {
        const timeA = parseInt(a.replace('config_', '').replace('.json', ''));
        const timeB = parseInt(b.replace('config_', '').replace('.json', ''));
        return timeB - timeA;
      });
    
    // 提取历史记录信息
    const historyList = sortedFiles.map(file => {
      const filePath = path.join(CONFIG_HISTORY_DIR, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const { operation } = content;
      
      return {
        id: operation.timestamp,
        user: operation.user,
        timestamp: new Date(operation.timestamp).toISOString(),
        action: operation.action,
        details: operation.key ? `${operation.key}: ${JSON.stringify(operation.oldValue)} -> ${JSON.stringify(operation.newValue)}` : '整体配置更改'
      };
    });
    
    res.json({
      success: true,
      data: historyList
    });
  } catch (error) {
    console.error('获取历史记录失败:', error);
    res.status(500).json({
      success: false,
      message: '获取历史记录失败',
      error: error.message
    });
  }
};

/**
 * 回滚到指定的配置历史
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.rollbackConfig = (req, res) => {
  try {
    const { id } = req.params;
    const historyFilePath = path.join(CONFIG_HISTORY_DIR, `config_${id}.json`);
    
    // 检查历史文件是否存在
    if (!fs.existsSync(historyFilePath)) {
      return res.status(404).json({
        success: false,
        message: '找不到指定的历史记录'
      });
    }
    
    // 读取历史配置
    const content = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
    const { config: historicConfig } = content;
    
    // 保存当前配置到历史记录
    const timestamp = Date.now();
    const newHistoryFilePath = path.join(CONFIG_HISTORY_DIR, `config_${timestamp}.json`);
    
    // 记录操作
    const operation = {
      user: req.session.username,
      timestamp,
      action: 'rollback',
      target: id,
      oldConfig: config.getConfig()
    };
    
    // 保存当前配置到历史记录
    fs.writeFileSync(
      newHistoryFilePath,
      JSON.stringify({
        config: config.getConfig(),
        operation
      }, null, 2),
      'utf8'
    );
    
    // 导入历史配置
    const success = config.import(historicConfig);
    
    if (success) {
      return res.json({
        success: true,
        message: '已回滚到指定配置',
        data: config.getConfig()
      });
    }
    
    res.status(500).json({
      success: false,
      message: '回滚配置失败'
    });
  } catch (error) {
    console.error('回滚配置失败:', error);
    res.status(500).json({
      success: false,
      message: '回滚配置失败',
      error: error.message
    });
  }
}; 