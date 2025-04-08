/**
 * ContentAI 前端主脚本
 */

(function() {
  'use strict';
  
  // 在DOM加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    // 表单验证初始化
    initFormValidation();
    
    // 回到顶部按钮初始化
    initBackToTop();
  });
  
  /**
   * 初始化表单验证
   */
  function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.prototype.slice.call(forms).forEach(function(form) {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        form.classList.add('was-validated');
      }, false);
    });
  }
  
  /**
   * 初始化回到顶部按钮
   */
  function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.classList.add('btn', 'btn-primary', 'btn-sm', 'position-fixed', 'bottom-0', 'end-0', 'm-3', 'd-none');
    backToTopButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTopButton.setAttribute('id', 'back-to-top');
    backToTopButton.setAttribute('title', '回到顶部');
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('d-none');
      } else {
        backToTopButton.classList.add('d-none');
      }
    });
    
    backToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  /**
   * 显示加载遮罩
   * @param {String} message - 显示的消息
   */
  window.showLoading = function(message = '加载中...') {
    // 如果已有加载遮罩，则返回
    if (document.getElementById('loading-overlay')) {
      return;
    }
    
    const overlay = document.createElement('div');
    overlay.classList.add('loading-overlay');
    overlay.setAttribute('id', 'loading-overlay');
    
    const spinnerContainer = document.createElement('div');
    spinnerContainer.classList.add('spinner-container');
    
    const spinner = document.createElement('div');
    spinner.classList.add('spinner-border', 'text-primary', 'mb-3');
    spinner.setAttribute('role', 'status');
    
    const spinnerText = document.createElement('span');
    spinnerText.classList.add('visually-hidden');
    spinnerText.textContent = '加载中...';
    
    const loadingText = document.createElement('div');
    loadingText.textContent = message;
    
    spinner.appendChild(spinnerText);
    spinnerContainer.appendChild(spinner);
    spinnerContainer.appendChild(loadingText);
    overlay.appendChild(spinnerContainer);
    
    document.body.appendChild(overlay);
  };
  
  /**
   * 隐藏加载遮罩
   */
  window.hideLoading = function() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.remove();
    }
  };
  
  /**
   * 显示提示消息
   * @param {String} message - 消息内容
   * @param {String} type - 消息类型 (success, danger, warning, info)
   * @param {Number} duration - 显示持续时间（毫秒）
   */
  window.showMessage = function(message, type = 'success', duration = 3000) {
    // 创建提示元素
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show', 'position-fixed', 'top-0', 'end-0', 'm-3');
    alert.setAttribute('role', 'alert');
    alert.style.zIndex = '1050';
    alert.style.maxWidth = '400px';
    
    // 创建消息内容
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // 添加到页面
    document.body.appendChild(alert);
    
    // 自动关闭
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => {
        alert.remove();
      }, 150);
    }, duration);
  };
})(); 