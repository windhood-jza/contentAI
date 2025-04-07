/**
 * 运维控制器
 * @description 处理应用的运维相关功能
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { logger } = require('../utils/logger');

/**
 * 获取系统状态信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getSystemStatus = (req, res) => {
  try {
    const systemInfo = {
      platform: os.platform(),
      architecture: os.arch(),
      hostname: os.hostname(),
      totalMemory: Math.round(os.totalmem() / (1024 * 1024 * 1024) * 100) / 100 + ' GB',
      freeMemory: Math.round(os.freemem() / (1024 * 1024 * 1024) * 100) / 100 + ' GB',
      cpus: os.cpus().length,
      uptime: Math.floor(os.uptime() / 3600) + ' 小时',
      nodeVersion: process.version,
      pid: process.pid
    };

    res.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    console.error('获取系统状态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统状态失败'
    });
  }
};

/**
 * 获取应用指标
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getAppMetrics = (req, res) => {
  try {
    // 模拟应用指标数据
    const appMetrics = {
      uptime: process.uptime() + ' 秒',
      memoryUsage: {
        rss: Math.round(process.memoryUsage().rss / (1024 * 1024) * 100) / 100 + ' MB',
        heapTotal: Math.round(process.memoryUsage().heapTotal / (1024 * 1024) * 100) / 100 + ' MB',
        heapUsed: Math.round(process.memoryUsage().heapUsed / (1024 * 1024) * 100) / 100 + ' MB',
        external: Math.round(process.memoryUsage().external / (1024 * 1024) * 100) / 100 + ' MB'
      },
      requests: {
        total: 1250,
        success: 1200,
        failed: 50,
        avgResponseTime: '120ms'
      },
      activeUsers: 15,
      cacheStatus: {
        size: '25MB',
        hitRate: '85%',
        entries: 520
      }
    };

    res.json({
      success: true,
      data: appMetrics
    });
  } catch (error) {
    console.error('获取应用指标失败:', error);
    res.status(500).json({
      success: false,
      message: '获取应用指标失败'
    });
  }
};

/**
 * 清理缓存
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.clearCache = (req, res) => {
  try {
    // 模拟清理缓存操作
    setTimeout(() => {
      res.json({
        success: true,
        message: '缓存已成功清理',
        data: {
          clearedEntries: 520,
          freedMemory: '25MB',
          timestamp: new Date().toISOString()
        }
      });
    }, 500);
  } catch (error) {
    console.error('清理缓存失败:', error);
    res.status(500).json({
      success: false,
      message: '清理缓存失败'
    });
  }
};

/**
 * 获取日志文件列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getLogFiles = (req, res) => {
  try {
    // 模拟日志文件列表
    const logFiles = [
      { name: 'app-2023-04-01.log', size: '2.5MB', modified: '2023-04-01T23:59:59Z' },
      { name: 'app-2023-04-02.log', size: '3.1MB', modified: '2023-04-02T23:59:59Z' },
      { name: 'app-2023-04-03.log', size: '2.8MB', modified: '2023-04-03T23:59:59Z' },
      { name: 'error-2023-04-01.log', size: '0.5MB', modified: '2023-04-01T23:59:59Z' },
      { name: 'error-2023-04-02.log', size: '0.3MB', modified: '2023-04-02T23:59:59Z' },
      { name: 'error-2023-04-03.log', size: '0.7MB', modified: '2023-04-03T23:59:59Z' }
    ];

    res.json({
      success: true,
      data: logFiles
    });
  } catch (error) {
    console.error('获取日志文件列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取日志文件列表失败'
    });
  }
};

/**
 * 读取日志文件内容
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getLogContent = (req, res) => {
  try {
    const { filename } = req.params;
    const { lines = 100, offset = 0 } = req.query;

    // 安全检查：确保文件名不包含路径操作符
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: '无效的文件名'
      });
    }

    // 模拟日志内容
    const logContent = [];
    for (let i = 0; i < parseInt(lines); i++) {
      const lineNum = parseInt(offset) + i + 1;
      logContent.push(`[2023-04-03T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}.${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}Z] INFO 示例日志内容行 #${lineNum}`);
    }

    res.json({
      success: true,
      data: {
        filename,
        totalLines: 5000, // 模拟总行数
        offset: parseInt(offset),
        lines: logContent
      }
    });
  } catch (error) {
    console.error('读取日志内容失败:', error);
    res.status(500).json({
      success: false,
      message: '读取日志内容失败'
    });
  }
};

/**
 * 重启应用
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.restartApp = (req, res) => {
  try {
    // 模拟重启应用
    res.json({
      success: true,
      message: '应用重启命令已发送，应用将在5秒后重启'
    });
    
    // 注意：在实际生产环境中，这里可能需要使用PM2或其他进程管理器来实现真正的重启
    // 目前只是模拟
    console.log('收到重启应用的请求，但这只是模拟操作，应用不会真正重启');
  } catch (error) {
    console.error('重启应用失败:', error);
    res.status(500).json({
      success: false,
      message: '重启应用失败'
    });
  }
};

/**
 * 运维助手配置控制器
 * @module controllers/opsController
 */

const fsPromises = require('fs').promises;
// 配置文件路径
const OPS_CONFIG_PATH = path.join(process.cwd(), 'config', 'ops-config.json');
const WORKFLOW_CONFIG_PATH = path.join(process.cwd(), 'config', 'workflow-config.json');

// 确保配置目录存在
const ensureConfigDir = async () => {
  const configDir = path.join(process.cwd(), 'config');
  try {
    await fsPromises.mkdir(configDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
};

/**
 * 获取运维助手配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getOpsConfig = async (req, res) => {
  try {
    await ensureConfigDir();
    
    // 默认配置模板
    const defaultConfig = {
      id: 'default',
      name: '默认配置',
      accessToken: '',
      apiBaseUrl: 'https://api.coze.cn/v1/workflow/run',
      apiTimeout: 30000,
      recordRetention: 7,
      defaultSystem: 'ocean',
      promptText: '请输入您的运维问题...',
      enableMarkdown: true,
      isDefault: true
    };
    
    let configs = [];
    
    try {
      const data = await fsPromises.readFile(OPS_CONFIG_PATH, 'utf8');
      const savedData = JSON.parse(data);
      
      if (Array.isArray(savedData)) {
        // 新格式 - 多配置数组
        configs = savedData;
        
        // 确保至少有一个默认配置
        if (configs.length > 0 && !configs.some(c => c.isDefault)) {
          configs[0].isDefault = true;
        }
      } else {
        // 旧格式 - 单一配置对象，转换为数组格式
        configs = [{
          id: 'default',
          name: '默认配置',
          isDefault: true,
          ...savedData
        }];
        
        // 保存为新格式
        await fsPromises.writeFile(OPS_CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf8');
        logger.info('配置已从单一格式转换为多配置格式');
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.error('读取运维助手配置文件失败:', error);
      } else {
        // 配置文件不存在，创建默认配置
        configs = [defaultConfig];
        await fsPromises.writeFile(OPS_CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf8');
        logger.info('创建了默认的运维助手配置文件');
      }
    }
    
    res.json({
      success: true,
      data: configs
    });
  } catch (error) {
    logger.error('获取运维助手配置失败:', error);
    res.status(500).json({
      success: false,
      message: `获取运维助手配置失败: ${error.message}`
    });
  }
};

/**
 * 保存运维助手配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const saveOpsConfig = async (req, res) => {
  try {
    await ensureConfigDir();
    
    const configs = req.body;
    
    // 验证配置格式
    if (!Array.isArray(configs)) {
      return res.status(400).json({
        success: false,
        message: '无效的配置格式：预期配置数组'
      });
    }
    
    // 验证每个配置
    for (const config of configs) {
      if (!config.id || !config.name) {
        return res.status(400).json({
          success: false,
          message: '配置无效: 每个配置必须包含id和name字段'
        });
      }
      
      if (!config.accessToken || !config.apiBaseUrl) {
        return res.status(400).json({
          success: false,
          message: `配置 "${config.name}" 缺少必填字段: accessToken 和 apiBaseUrl 为必填项`
        });
      }
    }
    
    // 确保至少有一个默认配置
    if (configs.length > 0 && !configs.some(c => c.isDefault)) {
      configs[0].isDefault = true;
    }
    
    // 保存配置到文件
    await fsPromises.writeFile(OPS_CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf8');
    
    res.json({
      success: true,
      message: '运维助手配置已保存'
    });
  } catch (error) {
    logger.error('保存运维助手配置失败:', error);
    res.status(500).json({
      success: false,
      message: `保存运维助手配置失败: ${error.message}`
    });
  }
};

/**
 * 测试API连接
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const testConnection = async (req, res) => {
  try {
    const { accessToken, apiBaseUrl } = req.body;
    
    if (!accessToken || !apiBaseUrl) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段: accessToken 和 apiBaseUrl 为必填项'
      });
    }
    
    // 构造一个简单的测试请求
    const testPayload = {
      workflow_id: 'test',
      inputs: {
        message: '这是一个测试消息'
      }
    };
    
    try {
      // 发送测试请求
      const response = await axios({
        method: 'post',
        url: apiBaseUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        data: testPayload,
        timeout: 10000, // 10秒超时
        validateStatus: () => true // 不抛出HTTP错误
      });
      
      // 检查响应状态
      if (response.status === 401 || response.status === 403) {
        return res.json({
          success: false,
          message: '授权失败: 请检查Access Token是否正确'
        });
      }
      
      if (response.status >= 400) {
        return res.json({
          success: false,
          message: `API请求失败: ${response.status} - ${response.statusText || '未知错误'}`
        });
      }
      
      // 测试成功
      res.json({
        success: true,
        message: '连接成功: API响应正常'
      });
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        return res.json({
          success: false,
          message: '连接被拒绝: 无法连接到API服务器'
        });
      }
      
      if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
        return res.json({
          success: false,
          message: '连接超时: API服务器响应超时'
        });
      }
      
      res.json({
        success: false,
        message: `连接测试失败: ${error.message}`
      });
    }
  } catch (error) {
    logger.error('测试API连接失败:', error);
    res.status(500).json({
      success: false,
      message: `测试API连接失败: ${error.message}`
    });
  }
};

/**
 * 获取所有工作流配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getAllWorkflows = async (req, res) => {
  try {
    await ensureConfigDir();
    
    let workflows = [];
    
    try {
      const data = await fsPromises.readFile(WORKFLOW_CONFIG_PATH, 'utf8');
      workflows = JSON.parse(data);
      if (!Array.isArray(workflows)) {
        workflows = [];
        logger.warn('工作流配置文件格式不正确，已重置为空数组');
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.error('读取工作流配置文件失败:', error);
      } else {
        // 配置文件不存在，创建默认空数组
        await fsPromises.writeFile(WORKFLOW_CONFIG_PATH, JSON.stringify(workflows, null, 2), 'utf8');
        logger.info('创建了默认的工作流配置文件');
      }
    }
    
    res.json({
      success: true,
      data: workflows
    });
  } catch (error) {
    logger.error('获取工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `获取工作流配置失败: ${error.message}`
    });
  }
};

/**
 * 保存所有工作流配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const saveAllWorkflows = async (req, res) => {
  try {
    await ensureConfigDir();
    
    const workflows = req.body;
    
    // 验证配置格式
    if (!Array.isArray(workflows)) {
      return res.status(400).json({
        success: false,
        message: '无效的配置格式：预期工作流数组'
      });
    }
    
    // 验证每个工作流
    for (const workflow of workflows) {
      if (!workflow.id || !workflow.name || !workflow.system) {
        return res.status(400).json({
          success: false,
          message: `工作流 "${workflow.name || '未命名'}" 配置无效: 必须包含id, name和system字段`
        });
      }
    }
    
    // 保存配置到文件
    await fsPromises.writeFile(WORKFLOW_CONFIG_PATH, JSON.stringify(workflows, null, 2), 'utf8');
    
    res.json({
      success: true,
      message: '工作流配置已保存'
    });
  } catch (error) {
    logger.error('保存工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `保存工作流配置失败: ${error.message}`
    });
  }
};

/**
 * 测试工作流
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const testWorkflow = async (req, res) => {
  try {
    const { workflowId, message, configId } = req.body;
    
    if (!workflowId || !message) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段: workflowId 和 message 为必填项'
      });
    }
    
    // 读取运维助手配置
    let configs = [];
    try {
      const data = await fsPromises.readFile(OPS_CONFIG_PATH, 'utf8');
      const parsed = JSON.parse(data);
      configs = Array.isArray(parsed) ? parsed : [parsed]; // 兼容处理
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: '读取运维助手配置失败'
      });
    }
    
    if (configs.length === 0) {
      return res.status(400).json({
        success: false,
        message: '未找到有效的运维助手配置'
      });
    }
    
    // 如果提供了配置ID，则使用指定配置；否则使用默认配置
    let config;
    if (configId) {
      config = configs.find(c => c.id === configId);
      if (!config) {
        return res.status(400).json({
          success: false,
          message: `未找到指定的配置 ID: ${configId}`
        });
      }
    } else {
      // 使用默认配置
      config = configs.find(c => c.isDefault) || configs[0];
    }
    
    if (!config.accessToken || !config.apiBaseUrl) {
      return res.status(400).json({
        success: false,
        message: `配置 "${config.name}" 缺少必要参数: accessToken 或 apiBaseUrl`
      });
    }
    
    // 构造请求负载
    const payload = {
      workflow_id: workflowId,
      inputs: {
        message: message
      }
    };
    
    try {
      // 发送请求
      const response = await axios({
        method: 'post',
        url: config.apiBaseUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.accessToken}`
        },
        data: payload,
        timeout: config.apiTimeout || 30000
      });
      
      // 返回API响应
      res.json({
        success: true,
        data: response.data,
        config: {
          id: config.id,
          name: config.name
        }
      });
    } catch (error) {
      if (error.response) {
        return res.json({
          success: false,
          message: `API请求失败: ${error.response.status} - ${error.response.statusText || '未知错误'}`,
          data: error.response.data,
          config: {
            id: config.id,
            name: config.name
          }
        });
      }
      
      res.json({
        success: false,
        message: `工作流测试失败: ${error.message}`,
        config: {
          id: config.id,
          name: config.name
        }
      });
    }
  } catch (error) {
    logger.error('测试工作流失败:', error);
    res.status(500).json({
      success: false,
      message: `测试工作流失败: ${error.message}`
    });
  }
};

module.exports = {
  getOpsConfig,
  saveOpsConfig,
  testConnection,
  getAllWorkflows,
  saveAllWorkflows,
  testWorkflow
}; 