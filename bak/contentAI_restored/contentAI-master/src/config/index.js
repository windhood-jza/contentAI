/**
 * 配置管理模块
 * @description 管理应用配置，支持动态修改和持久化存储
 */

const fs = require('fs');
const path = require('path');
const defaultConfig = require('./default');

// 配置文件路径
const CONFIG_FILE_PATH = path.join(__dirname, '../../config.json');

/**
 * 加载配置
 * @returns {Object} 配置对象
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const configJson = fs.readFileSync(CONFIG_FILE_PATH, { encoding: 'utf8' });
      console.log("加载配置文件成功");
      const savedConfig = JSON.parse(configJson);
      // 合并默认配置和保存的配置
      return mergeConfigs(defaultConfig, savedConfig);
    }
  } catch (err) {
    console.warn('无法加载配置文件，使用默认配置', err);
  }
  return { ...defaultConfig };
}

/**
 * 合并配置
 * @param {Object} defaultConfig 默认配置
 * @param {Object} savedConfig 保存的配置
 * @returns {Object} 合并后的配置
 */
function mergeConfigs(defaultConfig, savedConfig) {
  const result = { ...defaultConfig };
  
  // 递归合并配置对象
  Object.keys(savedConfig).forEach(key => {
    if (
      typeof savedConfig[key] === 'object' &&
      savedConfig[key] !== null &&
      !Array.isArray(savedConfig[key]) &&
      typeof defaultConfig[key] === 'object'
    ) {
      result[key] = mergeConfigs(defaultConfig[key], savedConfig[key]);
    } else {
      result[key] = savedConfig[key];
    }
  });
  
  return result;
}

/**
 * 保存配置
 * @param {Object} config 配置对象
 * @returns {Boolean} 是否保存成功
 */
function saveConfig(config) {
  try {
    // 创建备份
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const backupPath = `${CONFIG_FILE_PATH}.backup`;
      fs.copyFileSync(CONFIG_FILE_PATH, backupPath);
    }
    
    // 处理配置对象，确保没有循环引用
    const safeConfig = JSON.parse(JSON.stringify(config));
    
    // 保存新配置
    fs.writeFileSync(
      CONFIG_FILE_PATH, 
      JSON.stringify(safeConfig, null, 2), 
      { encoding: 'utf8' }
    );
    
    console.log("配置文件已保存到:", CONFIG_FILE_PATH);
    return true;
  } catch (err) {
    console.error('保存配置失败:', err);
    return false;
  }
}

// 加载配置
let currentConfig = loadConfig();

// 导出配置模块
module.exports = {
  /**
   * 获取完整配置
   * @returns {Object} 当前配置
   */
  getConfig: () => {
    return { ...currentConfig };
  },
  
  /**
   * 获取特定配置项
   * @param {String} key 配置键
   * @returns {*} 配置值
   */
  get: (key) => {
    if (!key) return { ...currentConfig };
    
    const keys = key.split('.');
    let value = { ...currentConfig };
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  },
  
  /**
   * 设置配置
   * @param {String} key 配置键
   * @param {*} value 配置值
   * @param {Boolean} persist 是否持久化
   * @returns {Boolean} 是否设置成功
   */
  set: (key, value, persist = true) => {
    if (!key) return false;
    
    const keys = key.split('.');
    let target = currentConfig;
    const lastKey = keys.pop();
    
    // 导航到嵌套对象
    for (const k of keys) {
      if (!(k in target) || typeof target[k] !== 'object') {
        target[k] = {};
      }
      target = target[k];
    }
    
    // 设置值
    target[lastKey] = value;
    
    // 持久化存储
    if (persist) {
      return saveConfig(currentConfig);
    }
    
    return true;
  },
  
  /**
   * 重置配置为默认值
   * @param {Boolean} persist 是否持久化
   * @returns {Boolean} 是否重置成功
   */
  reset: (persist = true) => {
    currentConfig = { ...defaultConfig };
    
    if (persist) {
      return saveConfig(currentConfig);
    }
    
    return true;
  },
  
  /**
   * 导入配置
   * @param {Object} config 配置对象
   * @param {Boolean} persist 是否持久化
   * @returns {Boolean} 是否导入成功
   */
  import: (config, persist = true) => {
    if (!config || typeof config !== 'object') {
      return false;
    }
    
    currentConfig = mergeConfigs(defaultConfig, config);
    
    if (persist) {
      return saveConfig(currentConfig);
    }
    
    return true;
  }
}; 