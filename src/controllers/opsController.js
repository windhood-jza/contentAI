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
      // 直接读取UTF-8文件
      const data = await fsPromises.readFile(WORKFLOW_CONFIG_PATH, 'utf8');
      
      try {
        workflows = JSON.parse(data);
        if (!Array.isArray(workflows)) {
          logger.warn('工作流配置文件格式不正确，已重置为空数组');
          workflows = [];
        } else {
          logger.info(`成功读取了 ${workflows.length} 个工作流配置`);
          
          // 检查编码是否正确
          const nameString = workflows.map(w => w.name).join(',');
          if (/[\u0080-\uFFFF]/.test(nameString)) {
            logger.info(`读取到包含Unicode字符的工作流名称: ${nameString}`);
          }
        }
      } catch (parseError) {
        logger.error(`工作流配置文件JSON解析失败: ${parseError.message}`);
        // 尝试处理UTF-8 BOM问题
        if (data.charCodeAt(0) === 0xFEFF) {
          logger.info('检测到UTF-8 BOM标记，尝试去除后解析');
          try {
            workflows = JSON.parse(data.slice(1));
            if (!Array.isArray(workflows)) {
              workflows = [];
            }
          } catch (e) {
            logger.error(`去除BOM后解析仍然失败: ${e.message}`);
            workflows = [];
          }
        } else {
          workflows = [];
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.error(`读取工作流配置文件失败: ${error.message}`);
      } else {
        // 配置文件不存在，创建默认空数组
        await fsPromises.writeFile(WORKFLOW_CONFIG_PATH, JSON.stringify(workflows, null, 2), 'utf8');
        logger.info('创建了默认的工作流配置文件');
      }
    }
    
    // 检查编码问题
    workflows.forEach((workflow, index) => {
      // 将可能存在编码问题的名称打印出来，以便诊断
      logger.info(`工作流[${index}] ID:${workflow.id}, 名称:${workflow.name}`);
    });
    
    res.json({
      success: true,
      data: workflows
    });
  } catch (error) {
    logger.error(`获取工作流配置失败: ${error.message}`);
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
      
      // 验证parameters结构
      if (workflow.parameters) {
        if (typeof workflow.parameters !== 'object' || Array.isArray(workflow.parameters)) {
          return res.status(400).json({
            success: false,
            message: `工作流 "${workflow.name}" 的parameters必须是对象格式`
          });
        }
      }
    }
    
    // 直接使用字符串方式，避免编码问题
    const jsonContent = JSON.stringify(workflows, null, 2);
    
    try {
      // 直接写入UTF-8文件，不使用Buffer转换
      await fsPromises.writeFile(WORKFLOW_CONFIG_PATH, jsonContent, 'utf8');
      
      // 添加日志记录
      logger.info(`工作流配置已保存到: ${WORKFLOW_CONFIG_PATH}，总共 ${workflows.length} 个工作流`);
      
      // 确认文件是否成功写入并且编码正确
      const savedData = await fsPromises.readFile(WORKFLOW_CONFIG_PATH, 'utf8');
      const savedWorkflows = JSON.parse(savedData);
      logger.info(`配置文件校验成功，读取到 ${savedWorkflows.length} 个工作流配置`);
      
      // 对比原始数据和读取后的数据，确保没有丢失信息
      const nameBeforeSave = workflows.map(w => w.name).join(',');
      const nameAfterSave = savedWorkflows.map(w => w.name).join(',');
      
      if (nameBeforeSave !== nameAfterSave) {
        logger.warn(`保存前后工作流名称不一致！保存前: ${nameBeforeSave}, 保存后: ${nameAfterSave}`);
      } else {
        logger.info('工作流名称保存前后一致，编码未发生问题');
      }
    } catch (writeError) {
      logger.error(`保存工作流配置文件失败: ${writeError.message}`);
      throw writeError;
    }
    
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

/**
 * 执行工作流
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const runWorkflow = async (req, res) => {
  try {
    const { message, workflowId, system = 'ocean' } = req.body;
    
    logger.info(`[运维助手] 接收到工作流执行请求，系统: ${system}, 消息: ${message}`);
    
    if (!message) {
      logger.warn('[运维助手] 缺少必填字段: message');
      return res.status(400).json({
        success: false,
        message: '缺少必填字段: message 为必填项'
      });
    }
    
    // 读取运维助手配置
    let configs = [];
    try {
      const data = await fsPromises.readFile(OPS_CONFIG_PATH, 'utf8');
      const parsed = JSON.parse(data);
      configs = Array.isArray(parsed) ? parsed : [parsed]; // 兼容处理
      logger.info(`[运维助手] 成功加载 ${configs.length} 个配置`);
    } catch (error) {
      logger.error(`[运维助手] 读取运维助手配置失败: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: '读取运维助手配置失败'
      });
    }
    
    if (configs.length === 0) {
      logger.warn('[运维助手] 未找到有效的运维助手配置');
      return res.status(400).json({
        success: false,
        message: '未找到有效的运维助手配置'
      });
    }
    
    // 根据system参数选择配置，默认使用默认配置
    let config;
    if (system === 'ocean' || system === 'sobey') {
      // 查找指定系统的配置
      config = configs.find(c => c.defaultSystem === system);
      logger.info(`[运维助手] 查找${system}系统配置: ${config ? '找到' : '未找到'}`);
    }
    
    // 如果没有找到对应系统的配置，则使用默认配置
    if (!config) {
      config = configs.find(c => c.isDefault) || configs[0];
      logger.info(`[运维助手] 使用默认配置: ${config.name}`);
    }
    
    if (!config.accessToken || !config.apiBaseUrl) {
      logger.error(`[运维助手] 配置 "${config.name}" 缺少必要参数: accessToken 或 apiBaseUrl`);
      return res.status(400).json({
        success: false,
        message: `配置 "${config.name}" 缺少必要参数: accessToken 或 apiBaseUrl`
      });
    }
    
    // 获取工作流ID - 如果提供则使用提供的，否则使用配置中的默认工作流
    const targetWorkflowId = workflowId || config.defaultWorkflowId;
    
    if (!targetWorkflowId) {
      logger.error('[运维助手] 未指定工作流ID，且配置中未设置默认工作流');
      return res.status(400).json({
        success: false,
        message: '未指定工作流ID，且配置中未设置默认工作流'
      });
    }
    
    logger.info(`[运维助手] 使用工作流ID: ${targetWorkflowId}`);
    
    // 调用工作流API
    try {
      logger.info(`[运维助手] 开始调用工作流API: ${config.apiBaseUrl}`);
      const result = await callCozeWorkflow(config, targetWorkflowId, message);
      logger.info(`[运维助手] 工作流API调用成功`);
      
      // 安全处理API响应数据
      let processedResult = {
        original: result,
        content: '',
        parsed: false
      };
      
      try {
        // 检查是否成功获取响应
        if (!result) {
          throw new Error('API返回空响应');
        }
        
        logger.info(`[运维助手] 解析API响应数据，类型: ${typeof result.data}`);
        
        // 解析嵌套的JSON
        if (result.data) {
          let dataObj;
          
          // 如果data是字符串，尝试解析JSON
          if (typeof result.data === 'string') {
            dataObj = JSON.parse(result.data);
            logger.info(`[运维助手] 成功解析data字符串为JSON对象`);
          } else {
            dataObj = result.data;
            logger.info(`[运维助手] data已经是对象类型`);
          }
          
          // 提取输出内容
          if (dataObj && dataObj.output) {
            // 处理特殊字符和排版
            let cleanedOutput = dataObj.output
              .replace(/\\n/g, '\n')  // 转换转义换行符为实际换行符
              .replace(/\\\\/g, '\\') // 处理双重转义
              .trim();                // 移除首尾空白
            
            processedResult.content = cleanedOutput;
            processedResult.parsed = true;
            logger.info(`[运维助手] 成功提取并清理输出内容，长度: ${processedResult.content.length}`);
            
            // 记录内容摘要，帮助调试
            const contentPreview = cleanedOutput.substring(0, 200).replace(/\n/g, '\\n');
            logger.info(`[运维助手] 内容前200字符: ${contentPreview}...`);
          } else {
            logger.warn(`[运维助手] 未从数据中找到output字段: ${JSON.stringify(dataObj)}`);
            processedResult.content = '系统未返回有效内容';
          }
        } else {
          logger.warn(`[运维助手] 响应中不包含data字段: ${JSON.stringify(result)}`);
          processedResult.content = '系统返回数据格式异常';
        }
      } catch (parseError) {
        logger.error(`[运维助手] 解析API响应失败: ${parseError.message}`);
        processedResult.content = `解析响应失败: ${parseError.message}`;
        processedResult.error = parseError.message;
      }
      
      // 返回处理后的结果
      logger.info(`[运维助手] 响应处理完成，内容长度: ${processedResult.content.length}`);
      return res.json({
        success: true,
        data: processedResult
      });
    } catch (error) {
      logger.error(`[运维助手] 工作流API调用失败: ${error.message}`);
      throw error; // 让外层捕获处理
    }
  } catch (error) {
    logger.error(`[运维助手] 执行工作流出错: ${error.message}`, error);
    return res.status(500).json({
      success: false,
      message: `执行工作流出错: ${error.message}`
    });
  }
};

/**
 * 调用Coze工作流API
 * @param {Object} config - 运维助手配置
 * @param {string} workflowId - 工作流ID
 * @param {string} message - 用户消息
 * @returns {Promise<Object>} - API响应结果
 */
async function callCozeWorkflow(config, workflowId, message) {
  try {
    // 确保工作流ID格式正确，去除可能的空格
    const cleanWorkflowId = workflowId ? workflowId.trim() : '';
    
    if (!cleanWorkflowId) {
      throw new Error('工作流ID不能为空');
    }
    
    // 从工作流配置文件中获取该工作流的参数设置
    let workflow = null;
    try {
      const workflowsData = await fsPromises.readFile(WORKFLOW_CONFIG_PATH, 'utf8');
      const workflows = JSON.parse(workflowsData);
      workflow = workflows.find(w => w.id.trim() === cleanWorkflowId);
    } catch (error) {
      logger.warn(`[运维助手] 读取工作流配置失败: ${error.message}，将使用默认参数名`);
    }
    
    // 构造请求负载
    const payload = {
      workflow_id: cleanWorkflowId,
      parameters: {}
    };
    
    // 确定参数如何映射
    if (workflow && workflow.parameters) {
      logger.info(`[运维助手] 找到工作流配置的参数结构:`, workflow.parameters);
      
      // 检查参数格式并映射用户消息
      if (typeof workflow.parameters === 'object') {
        if (Object.keys(workflow.parameters).length === 0) {
          // 空参数对象，使用默认input
          payload.parameters.input = message;
          logger.info(`[运维助手] 工作流参数为空对象，使用默认参数名: input`);
        } else {
          // 直接复制整个parameters结构
          payload.parameters = JSON.parse(JSON.stringify(workflow.parameters));
          
          // 将用户输入填入第一个参数
          const firstKey = Object.keys(workflow.parameters)[0];
          if (typeof workflow.parameters[firstKey] === 'string' || workflow.parameters[firstKey] === null || workflow.parameters[firstKey] === "") {
            // 如果第一个参数是字符串或空值，直接替换
            payload.parameters[firstKey] = message;
            logger.info(`[运维助手] 继承工作流参数结构，将用户输入填入参数: ${firstKey}`);
          } else if (typeof workflow.parameters[firstKey] === 'object' && !Array.isArray(workflow.parameters[firstKey])) {
            // 如果第一个参数是对象，保留结构，但修改其中可能的字符串值
            const nestedFirstKey = Object.keys(workflow.parameters[firstKey])[0];
            if (nestedFirstKey && (typeof workflow.parameters[firstKey][nestedFirstKey] === 'string' || workflow.parameters[firstKey][nestedFirstKey] === null || workflow.parameters[firstKey][nestedFirstKey] === "")) {
              payload.parameters[firstKey][nestedFirstKey] = message;
              logger.info(`[运维助手] 继承工作流嵌套参数结构，将用户输入填入嵌套参数: ${firstKey}.${nestedFirstKey}`);
            } else {
              // 如果嵌套结构复杂，仍使用第一个参数
              payload.parameters[firstKey] = message;
              logger.info(`[运维助手] 嵌套参数结构复杂，覆盖第一个参数: ${firstKey}`);
            }
          } else {
            // 其他情况，替换第一个参数
            payload.parameters[firstKey] = message;
            logger.info(`[运维助手] 参数格式不是字符串或对象，覆盖第一个参数: ${firstKey}`);
          }
        }
      } else {
        // 非对象参数，使用默认
        payload.parameters.input = message;
        logger.info(`[运维助手] 工作流参数格式不是对象，使用默认参数名: input`);
      }
    } else {
      // 默认使用 input 作为参数名
      payload.parameters.input = message;
      logger.info(`[运维助手] 未找到工作流参数配置，使用默认参数名: input`);
    }
    
    // 构造请求配置
    const requestConfig = {
      method: 'post',
      url: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.accessToken}`
      },
      data: payload,
      timeout: config.apiTimeout || 30000
    };
    
    // 记录完整请求信息（隐藏部分敏感信息）
    const safeHeaders = { ...requestConfig.headers };
    if (safeHeaders.Authorization) {
      safeHeaders.Authorization = safeHeaders.Authorization.substring(0, 15) + '...[隐藏]';
    }
    
    logger.info('==================== API请求开始 ====================');
    logger.info(`[运维助手] 请求方法: ${requestConfig.method.toUpperCase()}`);
    logger.info(`[运维助手] 请求URL: ${requestConfig.url}`);
    logger.info(`[运维助手] 请求头:`, JSON.stringify(safeHeaders, null, 2));
    logger.info(`[运维助手] 请求体:`, JSON.stringify(payload, null, 2));
    logger.info(`[运维助手] 请求超时: ${requestConfig.timeout}ms`);
    
    // 发送请求
    const response = await axios(requestConfig);
    
    // 记录完整响应信息
    logger.info('==================== API响应开始 ====================');
    logger.info(`[运维助手] 响应状态: ${response.status} ${response.statusText}`);
    logger.info(`[运维助手] 响应头:`, JSON.stringify(response.headers, null, 2));
    logger.info(`[运维助手] 响应体:`, JSON.stringify(response.data, null, 2));
    logger.info('==================== API响应结束 ====================');
    
    return response.data;
  } catch (error) {
    logger.info('==================== API错误开始 ====================');
    
    if (error.response) {
      // 记录API错误响应
      logger.error(`[运维助手] API错误响应码: ${error.response.status} ${error.response.statusText}`);
      logger.error(`[运维助手] API错误响应头:`, JSON.stringify(error.response.headers, null, 2));
      logger.error(`[运维助手] API错误响应数据:`, JSON.stringify(error.response.data, null, 2));
      
      // 对常见错误进行更详细的解释
      if (error.response.status === 404) {
        logger.error(`[运维助手] 工作流ID不存在或无效: ${cleanWorkflowId}`);
      } else if (error.response.status === 401) {
        logger.error(`[运维助手] 授权失败，请检查Access Token是否有效`);
      } else if (error.response.status === 400) {
        logger.error(`[运维助手] 请求参数错误，请检查工作流ID和消息格式`);
      }
      
      throw new Error(`API请求失败: ${error.response.status} - ${error.response.statusText || '未知错误'} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // 请求已发送但未收到响应
      logger.error(`[运维助手] 未收到API响应:`, error.message);
      logger.error(`[运维助手] 请求配置:`, error.config && JSON.stringify(error.config, null, 2));
      throw new Error(`未收到API响应: ${error.message}`);
    } else {
      // 请求设置时出错
      logger.error(`[运维助手] 请求设置错误:`, error.message);
      logger.error(`[运维助手] 请求配置:`, error.config && JSON.stringify(error.config, null, 2));
      throw new Error(`请求设置错误: ${error.message}`);
    }
    
    logger.info('==================== API错误结束 ====================');
  }
}

module.exports = {
  getOpsConfig,
  saveOpsConfig,
  testConnection,
  getAllWorkflows,
  saveAllWorkflows,
  testWorkflow,
  runWorkflow
}; 