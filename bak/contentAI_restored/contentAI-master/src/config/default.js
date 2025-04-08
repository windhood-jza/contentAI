/**
 * 应用默认配置文件
 * @description 定义应用的默认配置，可在管理员界面修改
 */

module.exports = {
  // API相关配置
  api: {
    baseUrl: process.env.API_BASE_URL || '/api',
    timeout: parseInt(process.env.API_TIMEOUT) || 5000,
    maxRetries: parseInt(process.env.API_MAX_RETRIES) || 3,
    requestRateLimit: 100
  },

  // 搜索相关配置
  search: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
    maxKeywordLength: parseInt(process.env.MAX_KEYWORD_LENGTH) || 100,
    defaultSort: process.env.DEFAULT_SORT || 'created,desc',
    highlightResults: true,
    truncateContentLength: 500
  },

  // 界面相关配置
  ui: {
    theme: 'light',
    fontSize: 'medium',
    contentDisplayMode: 'card', // card, list, table
    animationsEnabled: true,
    showTimestamps: true
  },

  // 缓存相关配置
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    expiry: parseInt(process.env.CACHE_EXPIRY) || 3600,
    maxItems: parseInt(process.env.MAX_CACHE_ITEMS) || 100
  },

  // 性能相关配置
  performance: {
    maxConcurrentRequests: 5,
    requestTimeout: 10000,
    logPerformanceMetrics: false
  },

  // 用户反馈配置
  feedback: {
    enabled: false,
    collectAnonymousData: false,
    feedbackFormUrl: ''
  }
}; 