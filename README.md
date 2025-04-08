# 新闻检索服务

一个基于Spring Boot的轻量级新闻内容检索服务，支持关键词搜索、分页和排序功能。

## 功能特性

- 支持多关键词搜索（以逗号分隔）
- 支持分页和排序
- 数据库连接配置界面
- 无数据库模式（可在未配置数据库的情况下启动）
- 健康检查API

## 技术栈

- Java 11
- Spring Boot 2.7.12
- Thymeleaf 模板引擎
- Bootstrap 5.2.3
- jQuery 3.6.0
- MySQL/PostgreSQL 数据库支持
- Swagger API文档

## 快速开始

### 环境要求

- JDK 11+
- Maven 3.6+
- MySQL 5.7+/PostgreSQL 10+（可选）

### 编译与运行

1. 克隆代码库

```bash
git clone https://github.com/yourusername/news-service.git
cd news-service
```

2. 编译项目

```bash
mvn clean package
```

3. 运行应用

```bash
java -jar target/news-service-0.0.1-SNAPSHOT.war
```

应用将在 http://localhost:8080 启动

### 数据库配置

应用默认以无数据库模式启动。如需启用数据库搜索功能，可以通过以下方式配置：

1. 通过Web界面配置

   - 访问 http://localhost:8080/config-page
   - 填写数据库连接信息并保存
   - 重启应用

2. 通过配置文件配置

   - 在`${catalina.base}/config/`目录下创建`application.properties`文件
   - 添加以下内容（根据实际情况修改）：

   ```properties
   spring.datasource.enabled=true
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.datasource.url=jdbc:mysql://localhost:3306/newsdb?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
   spring.datasource.username=root
   spring.datasource.password=password
   ```

   - 重启应用

## API文档

应用集成了Swagger文档，可通过以下地址访问：

http://localhost:8080/swagger-ui/index.html

主要API端点：

- `POST /search` - 搜索新闻内容
- `GET /health` - 健康检查
- `POST /config/database` - 更新数据库配置
- `POST /config/database/test` - 测试数据库连接
- `GET /config/database` - 获取当前数据库配置

## 数据库表结构

应用期望数据库中有以下表结构：

```sql
CREATE TABLE com_basicinfo (
    ID VARCHAR(32) PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,
    CREATED DATETIME
);

CREATE TABLE cob_program (
    OBJECTID VARCHAR(32) NOT NULL,
    FIELD1079 TEXT,
    PRIMARY KEY (OBJECTID),
    FOREIGN KEY (OBJECTID) REFERENCES com_basicinfo(ID)
);
```

## 许可证

[MIT](LICENSE) 