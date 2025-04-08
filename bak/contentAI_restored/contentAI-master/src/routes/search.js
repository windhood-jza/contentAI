/**
 * 搜索路由
 * @description 处理应用的搜索相关路由
 */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const axios = require('axios');
const config = require('../config');

/**
 * 搜索页面路由
 * @route GET /search
 */
router.get('/', async (req, res) => {
  console.log('[搜索路由] 接收到搜索请求:', req.url);
  console.log('[搜索路由] 查询参数:', req.query);
  
  // 获取查询参数
  const keywords = req.query.keywords || '';
  const size = parseInt(req.query.size) || 10;
  const sort = req.query.sort || 'time_desc';
  const page = parseInt(req.query.page) || 1;
  
  console.log(`[搜索路由] 处理参数: 关键词="${keywords}", 页码=${page}, 每页数量=${size}, 排序=${sort}`);
  
  // 基本渲染参数
  const renderParams = {
    title: 'ContentAI - 搜索结果',
    keywords,
    size,
    sort,
    page,
    totalPages: 1,
    totalElements: 0,
    content: [],
    loading: false,
    error: null,
    responseData: {},
    formatDate: function(dateString) {
      try {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    },
    truncateContent: function(text, maxLength) {
      if (text && text.length > maxLength) {
        return text.substring(0, maxLength);
      }
      return text;
    }
  };
  
  // 如果没有关键词，只渲染页面不执行搜索
  if (!keywords) {
    console.log('[搜索路由] 无关键词，只渲染搜索页面');
    return res.render('search', renderParams);
  }
  
  // 有关键词，执行实际搜索
  try {
    console.log(`[搜索路由] 开始执行搜索: 关键词="${keywords}", 页码=${page}, 每页数量=${size}, 排序=${sort}`);
    
    // API页码从0开始，而不是从1开始
    const apiPage = page - 1;
    console.log('[搜索路由] 转换页码: 前端页码=', page, ', API页码=', apiPage);
    
    // 发送API请求
    const apiUrl = `${config.get('api.baseUrl')}/search`;
    console.log('[搜索路由] API配置信息:');
    console.log('  - API基础URL:', config.get('api.baseUrl'));
    console.log('  - API超时设置:', config.get('api.timeout'), 'ms');
    console.log('  - 请求完整URL:', apiUrl);
    
    // 转换排序参数 
    let sortParam = 'created,desc';
    if (sort === 'time_desc') sortParam = 'created,desc';
    else if (sort === 'time_asc') sortParam = 'created,asc';
    else if (sort === 'relevance') sortParam = 'relevance,desc';
    console.log('[搜索路由] 排序参数转换: 前端排序=', sort, ', API排序=', sortParam);
    
    // 设置请求选项
    const axiosConfig = {
      timeout: config.get('api.timeout'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    console.log('[搜索路由] 准备发送搜索请求到API:', {
      url: apiUrl,
      method: 'POST',
      body: { keywords, page: apiPage, size, sort: sortParam },
      config: axiosConfig
    });
    
    const response = await axios.post(apiUrl, { 
      keywords, 
      page: apiPage, 
      size,
      sort: sortParam
    }, axiosConfig);
    
    console.log('[搜索路由] API响应状态码:', response.status);
    console.log('[搜索路由] API响应头部:', JSON.stringify(response.headers).substring(0, 200));
    console.log('[搜索路由] API响应数据摘要:', JSON.stringify(response.data).substring(0, 200) + '...');
    
    if (response.data && response.data.success) {
      console.log('[搜索路由] 搜索成功:', {
        totalElements: response.data.data?.totalElements || 0,
        totalPages: response.data.data?.totalPages || 1,
        contentItems: response.data.data?.content?.length || 0
      });
      
      // 更新渲染参数
      renderParams.content = response.data.data.content || [];
      renderParams.totalElements = response.data.data.totalElements || 0;
      renderParams.totalPages = response.data.data.totalPages || 1;
      renderParams.responseData = response.data;
      
      // 调整页码，保持与前端一致（从1开始）
      if (response.data.data && typeof response.data.data.page === 'number') {
        renderParams.page = response.data.data.page + 1;
        console.log('[搜索路由] 调整响应页码为:', renderParams.page);
      }
    } else {
      console.error('[搜索路由] API返回失败结果:', response.data);
      renderParams.error = response.data?.message || '搜索请求返回失败';
    }
  } catch (error) {
    console.error('[搜索路由] 搜索过程发生错误:', error.message);
    
    renderParams.error = '搜索服务暂时不可用，请稍后再试';
    
    // 详细记录错误信息
    if (error.response) {
      // 服务器返回了错误响应
      console.error('[搜索路由] 服务器错误响应:');
      console.error('  - 状态码:', error.response.status);
      console.error('  - 响应头:', JSON.stringify(error.response.headers));
      console.error('  - 响应数据:', JSON.stringify(error.response.data));
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('[搜索路由] 请求已发送但没有收到响应，API可能不可达');
      console.error('  - 请求详情:', error.request._currentUrl);
      console.error('  - 请求方法:', error.config?.method);
    } else {
      // 设置请求时发生错误
      console.error('[搜索路由] 请求配置错误:', error.message);
    }
    
    if (error.config) {
      console.error('[搜索路由] 请求配置信息:');
      console.error('  - URL:', error.config.url);
      console.error('  - 方法:', error.config.method);
      console.error('  - 超时设置:', error.config.timeout);
      console.error('  - 头部信息:', JSON.stringify(error.config.headers));
    }
    
    // 尝试检查API服务器网络可达性
    try {
      console.log('[搜索路由] 尝试 ping API 服务器基础地址...');
      const apiHost = new URL(config.get('api.baseUrl')).host;
      console.log('[搜索路由] API 服务器主机:', apiHost);
    } catch (e) {
      console.error('[搜索路由] 无法解析 API URL:', e.message);
    }
  }
  
  console.log('[搜索路由] 渲染搜索页面，包含', renderParams.content?.length || 0, '条结果');
  
  // 渲染页面
  res.render('search', renderParams);
});

/**
 * 搜索API路由
 * @route POST /search/api
 */
router.post('/api', (req, res) => {
  console.log('[搜索API] 接收到API搜索请求:', req.body);
  searchController.search(req, res);
});

/**
 * 计数API路由
 * @route GET /search/count
 */
router.get('/count', (req, res) => {
  console.log('[搜索计数] 接收到计数请求:', req.query);
  searchController.count(req, res);
});

module.exports = router; 