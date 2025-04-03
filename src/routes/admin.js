/**
 * 管理员路由
 * @description 处理应用的管理员相关路由
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const path = require('path');
const configController = require('../controllers/configController');

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

module.exports = router; 