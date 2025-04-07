/**
 * 工作流控制器
 * @description 处理应用的工作流程相关功能
 */

/**
 * 获取所有工作流列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Boolean} returnDataOnly - 如果为true，仅返回数据而不响应请求
 * @returns {Array|void} 当returnDataOnly为true时返回数据数组，否则通过res响应
 */
exports.getAllWorkflows = (req, res, returnDataOnly) => {
  try {
    // 模拟返回工作流列表
    const workflowsData = [
      { id: 1, name: '基础搜索流程', description: '基本的搜索和展示流程', isActive: true },
      { id: 2, name: '高级过滤流程', description: '包含高级过滤功能的搜索流程', isActive: false },
      { id: 3, name: '内容聚合流程', description: '聚合多个来源的搜索结果', isActive: false }
    ];
    
    if (returnDataOnly) {
      return workflowsData;
    }
    
    res.json({
      success: true,
      data: workflowsData
    });
  } catch (error) {
    console.error('获取工作流列表失败:', error);
    if (returnDataOnly) {
      return [];
    }
    res.status(500).json({
      success: false,
      message: '获取工作流列表失败'
    });
  }
};

/**
 * 获取单个工作流详情
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getWorkflowById = (req, res) => {
  try {
    const workflowId = parseInt(req.params.id);
    // 模拟查询工作流详情
    res.json({
      success: true,
      data: {
        id: workflowId,
        name: '基础搜索流程',
        description: '基本的搜索和展示流程',
        steps: [
          { id: 1, name: '输入关键词', type: 'input', isRequired: true },
          { id: 2, name: '搜索处理', type: 'process', isRequired: true },
          { id: 3, name: '结果展示', type: 'output', isRequired: true }
        ],
        isActive: true,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('获取工作流详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取工作流详情失败'
    });
  }
};

/**
 * 创建新工作流
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.createWorkflow = (req, res) => {
  try {
    const { name, description, steps } = req.body;
    
    // 参数验证
    if (!name || !description || !steps) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }
    
    // 模拟创建工作流
    res.status(201).json({
      success: true,
      message: '工作流创建成功',
      data: {
        id: 4,
        name,
        description,
        steps,
        isActive: false,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('创建工作流失败:', error);
    res.status(500).json({
      success: false,
      message: '创建工作流失败'
    });
  }
};

/**
 * 更新工作流
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.updateWorkflow = (req, res) => {
  try {
    const workflowId = parseInt(req.params.id);
    const { name, description, steps, isActive } = req.body;
    
    // 参数验证
    if (!name && !description && !steps && isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: '至少需要提供一个要更新的字段'
      });
    }
    
    // 模拟更新工作流
    res.json({
      success: true,
      message: '工作流更新成功',
      data: {
        id: workflowId,
        name: name || '基础搜索流程',
        description: description || '基本的搜索和展示流程',
        steps: steps || [
          { id: 1, name: '输入关键词', type: 'input', isRequired: true },
          { id: 2, name: '搜索处理', type: 'process', isRequired: true },
          { id: 3, name: '结果展示', type: 'output', isRequired: true }
        ],
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('更新工作流失败:', error);
    res.status(500).json({
      success: false,
      message: '更新工作流失败'
    });
  }
};

/**
 * 删除工作流
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.deleteWorkflow = (req, res) => {
  try {
    const workflowId = parseInt(req.params.id);
    
    // 模拟删除工作流
    res.json({
      success: true,
      message: `ID为${workflowId}的工作流已成功删除`
    });
  } catch (error) {
    console.error('删除工作流失败:', error);
    res.status(500).json({
      success: false,
      message: '删除工作流失败'
    });
  }
}; 