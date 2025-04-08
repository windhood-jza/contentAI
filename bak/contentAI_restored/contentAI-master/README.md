# ContentAI

ContentAI 是一个简单的关键词搜索应用，允许用户输入关键词，调用 @news 服务进行搜索，并以 JSON 格式展示搜索结果。该应用提供一个简洁的用户界面，方便用户快速获取与关键词相关的新闻信息。

## 功能特点

- 简洁的用户界面
- 关键词搜索功能
- 以 JSON 格式展示搜索结果
- 支持分页浏览多条内容
- 缓存机制减少重复请求
- 管理员配置页面

## 技术栈

- **前端**: HTML5, CSS3, JavaScript, jQuery, Bootstrap 5
- **后端**: Node.js, Express.js
- **模板引擎**: EJS
- **HTTP客户端**: Axios
- **其他工具**: Dotenv, Express-session, Morgan

## 安装和运行

1. 克隆仓库
   ```
   git clone https://github.com/yourusername/content-ai.git
   cd content-ai
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 配置环境变量
   ```
   cp .env.example .env
   # 编辑 .env 文件，设置必要的环境变量
   ```

4. 启动应用
   ```
   npm start
   ```

5. 开发模式（热重载）
   ```
   npm run dev
   ```

## 项目结构

```
contentAI/
├── public/                 # 静态资源
│   ├── css/                # 样式文件
│   ├── js/                 # JavaScript文件
│   └── images/             # 图片文件
├── src/                    # 源代码
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── middleware/         # 中间件
│   ├── routes/             # 路由
│   └── views/              # 视图模板
├── .env                    # 环境变量
├── app.js                  # 应用入口
├── package.json            # 项目依赖
└── README.md               # 项目说明
```

## 使用说明

1. 访问应用首页
2. 在搜索框中输入关键词
3. 查看搜索结果
4. 浏览分页内容
5. 管理员可以通过 `/admin` 路径访问配置面板

## 管理员配置

管理员可以通过配置页面修改应用的各种设置：

1. API 相关配置：基础URL、超时时间、重试次数等
2. 搜索相关配置：默认每页结果数、最大关键词长度等
3. 界面相关配置：主题、字体大小、内容显示方式等
4. 缓存相关配置：缓存开关、过期时间、最大缓存条数等
5. 性能相关配置：最大并发请求数、请求重试次数等

管理员默认凭据：
- 用户名：admin
- 密码：admin123

**注意**：在生产环境中请务必修改默认管理员凭据。

## 许可证

[MIT](LICENSE)

## 联系方式

如有任何问题，请联系项目维护者。

---

### 开发备注

此项目满足以下需求：
- 简洁的用户界面
- 关键词搜索功能
- JSON 格式展示
- 分页浏览
- 管理员配置界面
- 缓存机制 