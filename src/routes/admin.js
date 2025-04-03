/**
 * 管理员路由
 * @description 处理应用的管理员相关路由
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const path = require('path');
const configController = require('../controllers/configController');
const workflowController = require('../controllers/workflowController');
const opsController = require('../controllers/opsController');

/**
 * 管理员验证中间件
 */
const requireAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    if (req.xhr) {
      return res.status(401).json({
        success: false,
        message: '需要管理员权限'
      });
    }
    return res.redirect('/admin/login');
  }
  next();
};

/**
 * 管理员登录页面
 * @route GET /admin/login
 */
router.get('/login', (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    title: 'ContentAI - 管理员登录',
    error: null
  });
});

/**
 * 管理员登录处理
 * @route POST /admin/login
 */
router.post('/login', adminController.login);

/**
 * 管理员登出
 * @route GET /admin/logout
 */
router.get('/logout', adminController.logout);

/**
 * 管理员面板首页
 * @route GET /admin
 */
router.get('/', requireAdmin, (req, res) => {
  res.render('admin/index', {
    title: 'ContentAI - 管理面板',
    user: req.session.username,
    loginTime: req.session.loginTime
  });
});

/**
 * API配置页面
 * @route GET /admin/api/config
 */
router.get('/api/config', requireAdmin, (req, res) => {
  try {
    const apiConfigPath = path.join(__dirname, '../views/admin/api-config.ejs');
    res.sendFile(apiConfigPath);
  } catch (error) {
    console.error('加载API配置页面失败:', error);
    res.status(500).send('加载API配置页面失败');
  }
});

/**
 * 搜索配置页面
 * @route GET /admin/search/config
 */
router.get('/search/config', requireAdmin, (req, res) => {
  try {
    const searchConfigPath = path.join(__dirname, '../views/admin/search-config.ejs');
    res.sendFile(searchConfigPath);
  } catch (error) {
    console.error('加载搜索配置页面失败:', error);
    res.status(500).send('加载搜索配置页面失败');
  }
});

/**
 * 界面配置页面
 * @route GET /admin/ui/config
 */
router.get('/ui/config', requireAdmin, (req, res) => {
  try {
    const uiConfigPath = path.join(__dirname, '../views/admin/ui-config.ejs');
    res.sendFile(uiConfigPath);
  } catch (error) {
    console.error('加载界面配置页面失败:', error);
    res.status(500).send('加载界面配置页面失败');
  }
});

/**
 * 缓存配置页面
 * @route GET /admin/cache/config
 */
router.get('/cache/config', requireAdmin, (req, res) => {
  try {
    const cacheConfigPath = path.join(__dirname, '../views/admin/cache-config.ejs');
    res.sendFile(cacheConfigPath);
  } catch (error) {
    console.error('加载缓存配置页面失败:', error);
    res.status(500).send('加载缓存配置页面失败');
  }
});

/**
 * 性能配置页面
 * @route GET /admin/performance/config
 */
router.get('/performance/config', requireAdmin, (req, res) => {
  try {
    const performanceConfigPath = path.join(__dirname, '../views/admin/performance-config.ejs');
    res.sendFile(performanceConfigPath);
  } catch (error) {
    console.error('加载性能配置页面失败:', error);
    res.status(500).send('加载性能配置页面失败');
  }
});

/**
 * 用户反馈配置页面
 * @route GET /admin/feedback/config
 */
router.get('/feedback/config', requireAdmin, (req, res) => {
  try {
    const feedbackConfigPath = path.join(__dirname, '../views/admin/feedback-config.ejs');
    res.sendFile(feedbackConfigPath);
  } catch (error) {
    console.error('加载用户反馈配置页面失败:', error);
    res.status(500).send('加载用户反馈配置页面失败');
  }
});

/**
 * 配置历史页面
 * @route GET /admin/config/history
 */
router.get('/config/history', requireAdmin, (req, res) => {
  try {
    const configHistoryPath = path.join(__dirname, '../views/admin/config-history.ejs');
    res.sendFile(configHistoryPath);
  } catch (error) {
    console.error('加载配置历史页面失败:', error);
    res.status(500).send('加载配置历史页面失败');
  }
});

/**
 * 导入导出页面
 * @route GET /admin/import/export
 */
router.get('/import/export', requireAdmin, (req, res) => {
  try {
    const importExportPath = path.join(__dirname, '../views/admin/import-export.ejs');
    res.sendFile(importExportPath);
  } catch (error) {
    console.error('加载导入导出页面失败:', error);
    res.status(500).send('加载导入导出页面失败');
  }
});

/**
 * 获取配置历史记录
 * @route GET /admin/config/history/data
 */
router.get('/config/history/data', requireAdmin, configController.getConfigHistory);

/**
 * 回滚到指定的配置历史版本
 * @route POST /admin/config/rollback/:id
 */
router.post('/config/rollback/:id', requireAdmin, configController.rollbackConfig);

/**
 * 导出配置
 * @route GET /admin/config/export
 */
router.get('/config/export', requireAdmin, configController.exportConfig);

/**
 * 导入配置
 * @route POST /admin/config/import
 */
router.post('/config/import', requireAdmin, configController.importConfig);

/**
 * 获取所有配置
 * @route GET /admin/config
 */
router.get('/config', requireAdmin, configController.getConfig);

/**
 * 获取特定类型的配置
 * @route GET /admin/config/:type
 */
router.get('/config/:type', requireAdmin, configController.getConfigByType);

/**
 * 保存特定类型的配置
 * @route POST /admin/config/:type
 */
router.post('/config/:type', requireAdmin, configController.saveConfigByType);

/**
 * 重置特定类型的配置为默认值
 * @route POST /admin/config/:type/reset
 */
router.post('/config/:type/reset', requireAdmin, configController.resetConfigByType);

// 运维助手配置路由
router.get('/ops-config', requireAdmin, async (req, res) => {
  try {
    await opsController.getOpsConfig(req, res);
  } catch (error) {
    console.error('加载运维助手配置页面失败:', error);
    res.status(500).json({
      success: false,
      message: `加载运维助手配置页面失败: ${error.message}`
    });
  }
});

router.post('/ops-config', requireAdmin, async (req, res) => {
  try {
    await opsController.updateOpsConfig(req, res);
  } catch (error) {
    console.error('更新运维助手配置失败:', error);
    res.status(500).json({
      success: false,
      message: `更新运维助手配置失败: ${error.message}`
    });
  }
});

router.post('/ops-config/test-connection', requireAdmin, async (req, res) => {
  try {
    await opsController.testOpsApiConnection(req, res);
  } catch (error) {
    console.error('测试运维助手API连接失败:', error);
    res.status(500).json({
      success: false,
      message: `测试运维助手API连接失败: ${error.message}`
    });
  }
});

// 工作流配置路由
router.get('/workflows', requireAdmin, async (req, res) => {
  try {
    await workflowController.getAllWorkflows(req, res);
  } catch (error) {
    console.error('获取所有工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `获取所有工作流配置失败: ${error.message}`
    });
  }
});

router.get('/workflows/:id', requireAdmin, async (req, res) => {
  try {
    await workflowController.getWorkflow(req, res);
  } catch (error) {
    console.error('获取工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `获取工作流配置失败: ${error.message}`
    });
  }
});

router.post('/workflows', requireAdmin, async (req, res) => {
  try {
    await workflowController.createWorkflow(req, res);
  } catch (error) {
    console.error('创建工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `创建工作流配置失败: ${error.message}`
    });
  }
});

router.put('/workflows/:id', requireAdmin, async (req, res) => {
  try {
    await workflowController.updateWorkflow(req, res);
  } catch (error) {
    console.error('更新工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `更新工作流配置失败: ${error.message}`
    });
  }
});

router.delete('/workflows/:id', requireAdmin, async (req, res) => {
  try {
    await workflowController.deleteWorkflow(req, res);
  } catch (error) {
    console.error('删除工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `删除工作流配置失败: ${error.message}`
    });
  }
});

router.get('/workflows/default', requireAdmin, async (req, res) => {
  try {
    await workflowController.getDefaultWorkflow(req, res);
  } catch (error) {
    console.error('获取默认工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `获取默认工作流配置失败: ${error.message}`
    });
  }
});

router.put('/workflows/default', requireAdmin, async (req, res) => {
  try {
    await workflowController.updateDefaultWorkflow(req, res);
  } catch (error) {
    console.error('更新默认工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `更新默认工作流配置失败: ${error.message}`
    });
  }
});

router.get('/workflows/system/:system', requireAdmin, async (req, res) => {
  try {
    await workflowController.getWorkflowsBySystem(req, res);
  } catch (error) {
    console.error('获取系统工作流配置失败:', error);
    res.status(500).json({
      success: false,
      message: `获取系统工作流配置失败: ${error.message}`
    });
  }
});

// 配置API - 处理API请求
router.get('/api/config/:type', requireAdmin, async (req, res) => {
  console.log(`获取配置类型: ${req.params.type}`);
  try {
    const type = req.params.type;
    // 从配置控制器获取配置
    if (typeof configController.getConfigByType === 'function') {
      // 覆盖请求参数，以便控制器可以正确处理
      req.params.type = type;
      await configController.getConfigByType(req, res);
    } else {
      // 如果控制器方法不存在，返回默认响应
      res.json({
        success: true,
        data: {
          [type]: {}
        },
        message: `获取${type}配置成功(默认值)`
      });
    }
  } catch (error) {
    console.error(`获取配置失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `获取配置失败: ${error.message}`
    });
  }
});

router.post('/api/config/:type', requireAdmin, async (req, res) => {
  console.log(`保存配置类型: ${req.params.type}`, req.body);
  try {
    const type = req.params.type;
    // 调用配置控制器来保存配置
    if (typeof configController.saveConfigByType === 'function') {
      // 覆盖请求参数，以便控制器可以正确处理
      req.params.type = type;
      await configController.saveConfigByType(req, res);
    } else {
      // 如果控制器方法不存在，返回默认响应
      res.json({
        success: true,
        message: `保存${type}配置成功(默认响应)`
      });
    }
  } catch (error) {
    console.error(`保存配置失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `保存配置失败: ${error.message}`
    });
  }
});

// 添加对/admin/config POST请求的处理
router.post('/config', requireAdmin, (req, res) => {
  console.log('接收到/admin/config的POST请求，重定向到正确API');
  
  // 获取请求的配置类型参数
  const configType = req.query.type || 'api'; // 默认为api
  
  // 重定向到正确的API路径
  return res.redirect(307, `/admin/api/config/${configType}`);
});

// 添加重定向路由 - 处理错误格式的URL
router.get('*', (req, res, next) => {
  const path = req.path;
  console.log(`处理可能的错误路径: ${path}`);
  
  // 检查是否需要重定向
  if (path.includes('_')) {
    const correctedPath = path.replace(/_/g, '/');
    console.log(`重定向下划线路径: ${path} => ${correctedPath}`);
    return res.redirect(`/admin${correctedPath}`);
  }
  
  // 特殊处理 - 如果直接访问 /admin/config，重定向到 /admin/config/api
  if (path === '/config') {
    console.log('重定向/config到/config/api');
    return res.redirect('/admin/config/api');
  }
  
  next();
});

module.exports = router; 