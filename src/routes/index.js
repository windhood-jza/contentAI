/**
 * 首页路由模块
 * @module routes/index
 * @description 处理应用首页和基本导航路由
 */

const express = require('express');
const router = express.Router();

// 导入配置控制器
const configController = require('../controllers/configController');

/**
 * GET / - 渲染应用首页
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'ContentAI - 关键词搜索应用',
    isAuthenticated: req.session.isAuthenticated || false
  });
});

/**
 * GET /api/modules - 获取所有可用模块
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {void}
 */
router.get('/api/modules', (req, res) => {
  // 模块定义，实际应用中可能从数据库获取
  const modules = [
    {
      id: 'search',
      name: '搜索测试',
      icon: 'bi-search',
      template: '#search-module-template',
      default: true
    },
    {
      id: 'admin',
      name: '管理面板',
      icon: 'bi-gear',
      template: '#admin-module-template',
      requiresAuth: true
    }
    // 可在此添加更多模块
  ];
  
  res.json({
    success: true,
    message: '获取模块成功',
    data: modules
  });
});

/**
 * 根据用户权限过滤模块
 * 
 * @param {Array} modules - 模块列表
 * @param {boolean} isAuthenticated - 用户是否已认证
 * @param {boolean} isAdmin - 用户是否为管理员
 * @returns {Array} 过滤后的模块列表
 */
function filterModulesByPermission(modules, isAuthenticated, isAdmin) {
  return modules.filter(module => {
    // 需要认证且用户未登录
    if (module.requiresAuth && !isAuthenticated) {
      return false;
    }
    
    // 需要管理员权限且用户不是管理员
    if (module.requiresAdmin && !isAdmin) {
      return false;
    }
    
    return true;
  });
}

module.exports = router; 