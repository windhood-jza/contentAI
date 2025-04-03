/**
 * 配置控制器
 * @module controllers/configController
 * @description 处理配置相关的请求，包括获取、保存和重置配置
 */

const fs = require('fs').promises;
const path = require('path');

// 配置文件路径
const CONFIG_FILE = path.join(process.cwd(), 'config.json');
const CONFIG_HISTORY_DIR = path.join(process.cwd(), 'config_history');

/**
 * 获取完整配置
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
exports.getConfig = async (req, res) => {
  try {
    const config = await loadConfig();
    
    res.json({
      success: true,
      message: '获取配置成功',
      data: config
    });
  } catch (error) {
    console.error('获取配置失败:', error);
    res.status(500).json({
      success: false,
      message: `获取配置失败: ${error.message}`
    });
  }
};

/**
 * 获取特定类型的配置
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
exports.getConfigByType = async (req, res) => {
  try {
    const { type } = req.params;
    const config = await loadConfig();
    
    // 检查配置类型是否存在
    if (!config[type]) {
      return res.status(404).json({
        success: false,
        message: `找不到配置类型: ${type}`
      });
    }
    
    res.json({
      success: true,
      message: `获取${type}配置成功`,
      data: config[type]
    });
  } catch (error) {
    console.error(`获取${req.params.type}配置失败:`, error);
    res.status(500).json({
      success: false,
      message: `获取配置失败: ${error.message}`
    });
  }
};

/**
 * 保存特定类型的配置
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
exports.saveConfigByType = async (req, res) => {
  try {
    const { type } = req.params;
    const newConfigData = req.body;
    
    // 加载当前配置
    const config = await loadConfig();
    
    // 检查配置类型是否存在
    if (!config[type]) {
      return res.status(404).json({
        success: false,
        message: `找不到配置类型: ${type}`
      });
    }
    
    // 备份当前配置
    await backupConfig(config, 'update', type);
    
    // 更新配置
    config[type] = {
      ...config[type],
      ...newConfigData
    };
    
    // 保存配置
    await saveConfig(config);
    
    res.json({
      success: true,
      message: `保存${type}配置成功`,
      data: config[type]
    });
  } catch (error) {
    console.error(`保存${req.params.type}配置失败:`, error);
    res.status(500).json({
      success: false,
      message: `保存配置失败: ${error.message}`
    });
  }
};

/**
 * 重置特定类型的配置为默认值
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
exports.resetConfigByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // 加载当前配置
    const config = await loadConfig();
    
    // 检查配置类型是否存在
    if (!config[type]) {
      return res.status(404).json({
        success: false,
        message: `找不到配置类型: ${type}`
      });
    }
    
    // 备份当前配置
    await backupConfig(config, 'reset', type);
    
    // 加载默认配置
    const defaultConfig = await loadDefaultConfig();
    
    // 检查默认配置类型是否存在
    if (!defaultConfig[type]) {
      return res.status(404).json({
        success: false,
        message: `找不到默认配置类型: ${type}`
      });
    }
    
    // 更新配置
    config[type] = defaultConfig[type];
    
    // 保存配置
    await saveConfig(config);
    
    res.json({
      success: true,
      message: `重置${type}配置成功`,
      data: config[type]
    });
  } catch (error) {
    console.error(`重置${req.params.type}配置失败:`, error);
    res.status(500).json({
      success: false,
      message: `重置配置失败: ${error.message}`
    });
  }
};

/**
 * 获取配置历史记录
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
exports.getConfigHistory = async (req, res) => {
  try {
    // 读取历史记录目录中的所有文件
    const files = await fs.readdir(CONFIG_HISTORY_DIR);
    
    // 过滤并排序历史记录文件
    const historyFiles = files
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        // 按时间戳降序排序
        const timeA = a.split('_')[0];
        const timeB = b.split('_')[0];
        return parseInt(timeB) - parseInt(timeA);
      });
    
    // 读取每个历史记录文件的元数据
    const historyRecords = await Promise.all(
      historyFiles.map(async (file) => {
        try {
          const filePath = path.join(CONFIG_HISTORY_DIR, file);
          const content = await fs.readFile(filePath, 'utf8');
          const data = JSON.parse(content);
          
          // 从文件名中提取信息
          const parts = file.replace('.json', '').split('_');
          const timestamp = parseInt(parts[0]);
          const action = parts[1] || 'update';
          const configType = parts[2] || 'all';
          
          return {
            id: file.replace('.json', ''),
            timestamp,
            date: new Date(timestamp).toISOString(),
            action,
            configType,
            user: data.user || '系统',
            details: data.details || `${action} ${configType} 配置`
          };
        } catch (error) {
          console.error(`读取历史记录文件 ${file} 失败:`, error);
          return null;
        }
      })
    );
    
    // 过滤掉读取失败的记录
    const validRecords = historyRecords.filter(record => record !== null);
    
    res.json({
      success: true,
      message: '获取配置历史记录成功',
      data: validRecords
    });
  } catch (error) {
    console.error('获取配置历史记录失败:', error);
    res.status(500).json({
      success: false,
      message: `获取配置历史记录失败: ${error.message}`
    });
  }
};

/**
 * 回滚到指定的配置历史版本
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
exports.rollbackConfig = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 构建历史记录文件路径
    const historyFilePath = path.join(CONFIG_HISTORY_DIR, `${id}.json`);
    
    // 检查历史记录文件是否存在
    try {
      await fs.access(historyFilePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: `找不到配置历史记录: ${id}`
      });
    }
    
    // 读取历史记录文件
    const historyContent = await fs.readFile(historyFilePath, 'utf8');
    const historyData = JSON.parse(historyContent);
    
    // 确保历史记录中包含配置数据
    if (!historyData.config) {
      return res.status(400).json({
        success: false,
        message: '历史记录不包含有效的配置数据'
      });
    }
    
    // 加载当前配置
    const currentConfig = await loadConfig();
    
    // 备份当前配置
    await backupConfig(currentConfig, 'rollback', 'all');
    
    // 保存历史配置为当前配置
    await saveConfig(historyData.config);
    
    res.json({
      success: true,
      message: '配置回滚成功',
      data: {
        timestamp: historyData.timestamp,
        action: 'rollback',
        details: `回滚到 ${new Date(parseInt(id.split('_')[0])).toLocaleString('zh-CN')} 的配置`
      }
    });
  } catch (error) {
    console.error('配置回滚失败:', error);
    res.status(500).json({
      success: false,
      message: `配置回滚失败: ${error.message}`
    });
  }
};

/**
 * 导出配置
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
exports.exportConfig = async (req, res) => {
  try {
    const config = await loadConfig();
    
    // 设置响应头，让浏览器下载文件
    res.setHeader('Content-Disposition', 'attachment; filename=config.json');
    res.setHeader('Content-Type', 'application/json');
    
    res.json(config);
  } catch (error) {
    console.error('导出配置失败:', error);
    res.status(500).json({
      success: false,
      message: `导出配置失败: ${error.message}`
    });
  }
};

/**
 * 导入配置
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
exports.importConfig = async (req, res) => {
  try {
    const newConfig = req.body;
    
    // 验证导入的配置是否有效
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({
        success: false,
        message: '无效的配置数据'
      });
    }
    
    // 加载当前配置
    const currentConfig = await loadConfig();
    
    // 备份当前配置
    await backupConfig(currentConfig, 'import', 'all');
    
    // 保存导入的配置
    await saveConfig(newConfig);
    
    res.json({
      success: true,
      message: '配置导入成功',
      data: {
        timestamp: Date.now(),
        action: 'import',
        details: '导入了配置文件'
      }
    });
  } catch (error) {
    console.error('导入配置失败:', error);
    res.status(500).json({
      success: false,
      message: `导入配置失败: ${error.message}`
    });
  }
};

// 辅助函数

/**
 * 加载配置
 * 
 * @returns {Promise<Object>} 配置对象
 */
async function loadConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('加载配置失败:', error);
    
    // 如果配置文件不存在，创建一个默认配置
    if (error.code === 'ENOENT') {
      const defaultConfig = await loadDefaultConfig();
      await saveConfig(defaultConfig);
      return defaultConfig;
    }
    
    throw error;
  }
}

/**
 * 加载默认配置
 * 
 * @returns {Promise<Object>} 默认配置对象
 */
async function loadDefaultConfig() {
  // 默认配置
  const defaultConfig = {
    api: {
      baseUrl: '/news/api',
      timeout: 5000,
      retries: 3,
      compression: true
    },
    search: {
      defaultSize: 10,
      maxKeywordsLength: 100,
      defaultSort: 'time_desc',
      contentTruncateLength: 200
    },
    ui: {
      theme: 'light',
      fontSize: 'medium',
      cardView: true,
      animations: true,
      responsiveText: true,
      scrollTopButton: true
    },
    cache: {
      enabled: true,
      maxAge: 3600,
      maxSize: 100,
      strategy: 'lru'
    },
    performance: {
      maxConcurrentRequests: 5,
      timeout: 10000,
      connectionPoolSize: 10,
      httpCompression: true
    },
    feedback: {
      enabled: true,
      anonymousData: true,
      searchData: false,
      browserInfo: true
    }
  };
  
  return defaultConfig;
}

/**
 * 保存配置
 * 
 * @param {Object} config - 配置对象
 * @returns {Promise<void>}
 */
async function saveConfig(config) {
  try {
    const data = JSON.stringify(config, null, 2);
    await fs.writeFile(CONFIG_FILE, data, 'utf8');
  } catch (error) {
    console.error('保存配置失败:', error);
    throw error;
  }
}

/**
 * 备份配置
 * 
 * @param {Object} config - 配置对象
 * @param {string} action - 操作类型
 * @param {string} configType - 配置类型
 * @returns {Promise<void>}
 */
async function backupConfig(config, action = 'update', configType = 'all') {
  try {
    // 确保备份目录存在
    try {
      await fs.access(CONFIG_HISTORY_DIR);
    } catch (error) {
      await fs.mkdir(CONFIG_HISTORY_DIR, { recursive: true });
    }
    
    // 创建备份文件名，格式：时间戳_操作_类型.json
    const timestamp = Date.now();
    const fileName = `${timestamp}_${action}_${configType}.json`;
    const backupFilePath = path.join(CONFIG_HISTORY_DIR, fileName);
    
    // 创建备份内容，包含元数据
    const backupData = {
      timestamp,
      action,
      configType,
      user: '系统', // 实际应用中，这里应该获取当前登录用户的信息
      details: `${action} ${configType} 配置`,
      config
    };
    
    // 保存备份文件
    await fs.writeFile(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');
    
    // 同时创建一个简单的备份
    await fs.writeFile(`${CONFIG_FILE}.backup`, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('备份配置失败:', error);
    // 备份失败不应阻止主要操作，所以这里只记录错误但不抛出
  }
} 