/**
 * ContentAI 主应用入口文件
 * @description 初始化Express应用，配置中间件和路由
 */

// 导入依赖库
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 导入路由
const indexRoutes = require('./src/routes/index');
const searchRoutes = require('./src/routes/search');
const adminRoutes = require('./src/routes/admin');

// 创建Express应用
const app = express();

// 配置视图引擎
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// 配置中间件
app.use(morgan('dev')); // 日志中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 配置会话
app.use(session({
  secret: process.env.SESSION_SECRET || 'content-ai-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// 设置全局变量中间件
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

// 配置路由
app.use('/', indexRoutes);
app.use('/search', searchRoutes);
app.use('/admin', adminRoutes);

// 错误处理中间件
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ContentAI 服务器运行在端口 ${PORT}`);
});

module.exports = app; 