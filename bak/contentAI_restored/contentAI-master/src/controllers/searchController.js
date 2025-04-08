/**
 * 搜索控制器
 * @description 处理用户搜索请求并调用@news服务
 */

const axios = require('axios');
const config = require('../config');

// 缓存对象
const cache = {};

/**
 * 清理缓存
 * @private
 */
function cleanCache() {
  const now = Date.now();
  const maxItems = config.get('cache.maxItems');
  const entries = Object.entries(cache);
  
  // 删除过期项
  entries.forEach(([key, item]) => {
    if (now > item.expiry) {
      delete cache[key];
    }
  });
  
  // 如果缓存项仍超过限制，按最后访问时间排序并删除旧项
  if (Object.keys(cache).length > maxItems) {
    const sortedEntries = entries.sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);
    for (let i = maxItems; i < sortedEntries.length; i++) {
      delete cache[sortedEntries[i][0]];
    }
  }
}

/**
 * 搜索新闻
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.search = async (req, res) => {
  try {
    console.log('[搜索控制器] 接收搜索请求');
    console.log('[搜索控制器] 请求体:', req.body);
    
    const keywords = req.body.keywords;
    const page = parseInt(req.body.page) || 1;
    const size = parseInt(req.body.size) || config.get('search.defaultPageSize');
    const sort = req.body.sort || config.get('search.defaultSort');
    
    console.log(`[搜索控制器] 处理参数: 关键词="${keywords}", 页码=${page}, 每页数量=${size}, 排序=${sort}`);
    console.log(`[搜索控制器] 默认配置: 每页结果数=${config.get('search.defaultPageSize')}, 排序=${config.get('search.defaultSort')}`);
    
    // 验证关键词
    if (!keywords || typeof keywords !== 'string') {
      console.log('[搜索控制器] 错误: 无效的关键词:', keywords);
      return res.status(400).json({
        success: false,
        message: '请提供有效的搜索关键词'
      });
    }
    
    // 检查关键词长度
    if (keywords.length > config.get('search.maxKeywordLength')) {
      console.log('[搜索控制器] 错误: 关键词超长:', keywords.length);
      return res.status(400).json({
        success: false,
        message: `搜索关键词不能超过 ${config.get('search.maxKeywordLength')} 个字符`
      });
    }
    
    // 缓存键
    const cacheKey = `search:${keywords}:${page}:${size}:${sort}`;
    
    // 尝试从缓存获取
    if (config.get('cache.enabled') && cache[cacheKey]) {
      console.log('[搜索控制器] 命中缓存:', cacheKey);
      // 更新最后访问时间
      cache[cacheKey].lastAccessed = Date.now();
      return res.json(cache[cacheKey].data);
    }
    
    console.log('[搜索控制器] 缓存未命中，准备调用API');
    console.log('[搜索控制器] 缓存状态:', {
      enabled: config.get('cache.enabled'),
      cacheSize: Object.keys(cache).length,
      cacheExpiry: config.get('cache.expiry')
    });
    
    // API页码从0开始，而不是从1开始
    const apiPage = page - 1;
    console.log('[搜索控制器] 转换页码: 前端页码=', page, ', API页码=', apiPage);
    
    // 发送API请求
    const apiUrl = `${config.get('api.baseUrl')}/search`;
    console.log('[搜索控制器] API配置:');
    console.log('  - API基础URL:', config.get('api.baseUrl'));
    console.log('  - API完整URL:', apiUrl);
    console.log('  - API超时设置:', config.get('api.timeout'), 'ms');
    console.log('  - 最大重试次数:', config.get('api.maxRetries'));
    
    console.log('[搜索控制器] 请求体:', JSON.stringify({ 
      keywords, 
      page: apiPage, 
      size,
      sort
    }));
    
    // 设置请求选项
    const axiosConfig = {
      timeout: config.get('api.timeout'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    console.log('[搜索控制器] 发送请求到API:', {
      url: apiUrl,
      method: 'POST',
      timeout: axiosConfig.timeout
    });
    
    const startTime = Date.now();
    const response = await axios.post(apiUrl, { 
      keywords, 
      page: apiPage, 
      size,
      sort 
    }, axiosConfig);
    const endTime = Date.now();
    
    console.log(`[搜索控制器] API响应耗时: ${endTime - startTime}ms`);
    console.log('[搜索控制器] API响应状态码:', response.status);
    console.log('[搜索控制器] API响应头部:', JSON.stringify(response.headers).substring(0, 200));
    console.log('[搜索控制器] API响应数据摘要:', 
      JSON.stringify(response.data).substring(0, 200) + '...');
    
    if (response.data && response.data.success) {
      console.log('[搜索控制器] 响应成功:', { 
        结果数量: response.data.data?.content?.length || 0,
        总结果: response.data.data?.totalElements || 0,
        总页数: response.data.data?.totalPages || 0 
      });
      
      // 如果返回的content为空但totalElements不为0，可能是格式问题
      if (response.data.data?.content?.length === 0 && response.data.data?.totalElements > 0) {
        console.warn('[搜索控制器] 警告: API返回了空内容但显示有结果');
      }
      
      // 修正返回的page值，保持与前端一致（从1开始）
      if (response.data.data && typeof response.data.data.page === 'number') {
        response.data.data.page = response.data.data.page + 1;
        console.log('[搜索控制器] 调整响应页码为:', response.data.data.page);
      }
    } else {
      console.error('[搜索控制器] API返回失败响应:', response.data);
    }
    
    // 存入缓存
    if (config.get('cache.enabled') && response.data.success) {
      const expiry = Date.now() + config.get('cache.expiry') * 1000;
      cache[cacheKey] = {
        data: response.data,
        expiry,
        lastAccessed: Date.now()
      };
      
      console.log('[搜索控制器] 结果已缓存, 过期时间:', new Date(expiry).toISOString());
      
      // 清理缓存
      cleanCache();
    }
    
    console.log('[搜索控制器] 响应已发送');
    res.json(response.data);
  } catch (error) {
    console.error('[搜索控制器] 错误: 请求失败:', error.message);
    
    // 详细记录错误信息
    if (error.response) {
      // 服务器返回了响应
      console.error('[搜索控制器] 服务器错误响应:');
      console.error('  - 状态码:', error.response.status);
      console.error('  - 响应头:', JSON.stringify(error.response.headers));
      console.error('  - 响应数据:', JSON.stringify(error.response.data));
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('[搜索控制器] 请求已发送但未收到响应, API可能不可达');
      console.error('  - 请求细节:', error.request);
      console.error('  - 请求配置:', JSON.stringify(error.config));
      
      // 尝试检查网络连接
      try {
        console.log('[搜索控制器] 测试API可达性...');
        console.log('  - API URL:', config.get('api.baseUrl'));
        const apiURL = new URL(config.get('api.baseUrl'));
        console.log('  - API 主机:', apiURL.hostname);
        console.log('  - API 端口:', apiURL.port || '(默认)');
      } catch (e) {
        console.error('[搜索控制器] 解析API URL失败:', e.message);
      }
    } else {
      // 其他错误
      console.error('[搜索控制器] 未知错误:', error);
    }
    
    // 返回友好的错误信息
    res.status(500).json({
      success: false,
      message: '搜索请求失败',
      error: error.response?.data?.message || error.message || '未知错误'
    });
  }
};

/**
 * 获取新闻计数
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.count = async (req, res) => {
  try {
    console.log('[计数控制器] 接收计数请求');
    const keywords = req.query.keywords;
    
    console.log(`[计数控制器] 关键词: "${keywords}"`);
    
    // 验证关键词
    if (!keywords || typeof keywords !== 'string') {
      console.log('[计数控制器] 错误: 无效的关键词:', keywords);
      return res.status(400).json({
        success: false,
        message: '请提供有效的搜索关键词'
      });
    }
    
    // 缓存键
    const cacheKey = `count:${keywords}`;
    
    // 尝试从缓存获取
    if (config.get('cache.enabled') && cache[cacheKey]) {
      console.log('[计数控制器] 命中缓存:', cacheKey);
      // 更新最后访问时间
      cache[cacheKey].lastAccessed = Date.now();
      return res.json(cache[cacheKey].data);
    }
    
    console.log('[计数控制器] 缓存未命中，调用API');
    
    // 发送API请求
    const apiUrl = `${config.get('api.baseUrl')}/count`;
    console.log('[计数控制器] 请求API:', apiUrl);
    console.log('[计数控制器] 请求参数:', { keywords });
    
    const startTime = Date.now();
    const response = await axios.get(apiUrl, {
      params: { keywords },
      timeout: config.get('api.timeout'),
      headers: {
        'Accept': 'application/json'
      }
    });
    const endTime = Date.now();
    
    console.log(`[计数控制器] API响应耗时: ${endTime - startTime}ms`);
    console.log('[计数控制器] API响应状态:', response.status);
    console.log('[计数控制器] API响应数据:', JSON.stringify(response.data));
    
    // 存入缓存
    if (config.get('cache.enabled') && response.data.success) {
      const expiry = Date.now() + config.get('cache.expiry') * 1000;
      cache[cacheKey] = {
        data: response.data,
        expiry,
        lastAccessed: Date.now()
      };
      
      console.log('[计数控制器] 结果已缓存, 过期时间:', new Date(expiry).toISOString());
      
      // 清理缓存
      cleanCache();
    }
    
    console.log('[计数控制器] 响应已发送');
    res.json(response.data);
  } catch (error) {
    console.error('[计数控制器] 错误: 请求失败:', error.message);
    
    // 详细记录错误信息
    if (error.response) {
      console.error('[计数控制器] 服务器错误响应:');
      console.error('  - 状态码:', error.response.status);
      console.error('  - 响应数据:', JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error('[计数控制器] 请求已发送但未收到响应, API可能不可达');
      console.error('  - 请求细节:', error.request);
    }
    
    // 返回友好的错误信息
    res.status(500).json({
      success: false,
      message: '计数请求失败',
      error: error.response?.data?.message || error.message || '未知错误'
    });
  }
}; 