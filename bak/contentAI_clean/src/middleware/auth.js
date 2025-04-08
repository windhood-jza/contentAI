/**
 * 认证中间件
 * @description 提供用户和管理员认证功能
 */

/**
 * 检查用户是否已登录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.requireAuth = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    if (req.xhr) {
      return res.status(401).json({
        success: false,
        message: '需要登录'
      });
    }
    return res.redirect('/login');
  }
  next();
};

/**
 * 检查用户是否有管理员权限
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    if (req.xhr) {
      return res.status(403).json({
        success: false,
        message: '需要管理员权限'
      });
    }
    return res.redirect('/admin/login');
  }
  next();
};

/**
 * 应用会话超时检查
 * @param {Number} timeout - 超时时间（毫秒）
 * @returns {Function} 中间件函数
 */
exports.sessionTimeout = (timeout = 30 * 60 * 1000) => {
  return (req, res, next) => {
    if (req.session.isAuthenticated) {
      const now = Date.now();
      if (!req.session.lastActivity || (now - req.session.lastActivity) > timeout) {
        // 会话过期，清除会话
        req.session.destroy(() => {
          if (req.xhr) {
            return res.status(440).json({
              success: false,
              message: '会话已过期，请重新登录'
            });
          }
          return res.redirect('/login?expired=true');
        });
        return;
      }
      
      // 更新最后活动时间
      req.session.lastActivity = now;
    }
    next();
  };
}; 