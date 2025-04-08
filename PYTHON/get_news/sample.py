# 在这里，您可以通过 'args'  获取节点中的输入变量，并通过 'ret' 输出结果
# 'args' 和 'ret' 已经被正确地注入到环境中
# 下面是一个示例，首先获取节点的全部输入参数params，其次获取其中参数名为'input'的值：
# params = args.params; 
# input = params.input;
# 下面是一个示例，输出一个包含多种数据类型的 'ret' 对象：
# ret: Output =  { "name": '小明', "hobbies": ["看书", "旅游"] };

import json
from urllib import request
from urllib.parse import urlparse
import ssl
from typing import Dict, List, Any
import re


# 使用正则表达式和基本的字符串处理来提取内容
def extract_main_content(html_content: str, url: str) -> str:
    """提取网页主要内容"""
    try:
        # 移除script标签内容
        html_content = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", html_content)
        # 移除style标签内容
        html_content = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", html_content)

        # 根据URL类型选择不同的提取策略
        if "weixin" in url or "mp.weixin" in url:
            # 微信文章
            match = re.search(
                r'<div[^>]*id="js_content"[^>]*>(.*?)</div>', html_content, re.DOTALL
            )
        elif "toutiao.com" in url:
            # 今日头条
            match = re.search(
                r"<article[^>]*>(.*?)</article>", html_content, re.DOTALL
            ) or re.search(
                r'<div[^>]*class="article-content"[^>]*>(.*?)</div>',
                html_content,
                re.DOTALL,
            )
        else:
            # 通用提取策略
            match = re.search(
                r"<article[^>]*>(.*?)</article>", html_content, re.DOTALL
            ) or re.search(
                r'<div[^>]*class="[^"]*(?:article|content|text|body)[^"]*"[^>]*>(.*?)</div>',
                html_content,
                re.DOTALL,
            )

        if match:
            content = match.group(1)
            # 移除HTML标签
            content = re.sub(r"<[^>]+>", "", content)
            # 移除多余空白
            content = re.sub(r"\s+", " ", content)
            # 分割成行
            lines = [line.strip() for line in content.split("\n") if line.strip()]
            return "\n".join(lines)
        return ""
    except Exception as e:
        print(f"提取内容失败: {str(e)}")
        return ""


def fetch_content(url: str) -> str:
    """获取URL内容"""
    try:
        print(f"正在获取URL内容: {url}")
        # 添加请求头，模拟浏览器访问
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        # 创建请求对象
        req = request.Request(url, headers=headers)

        # 忽略SSL证书验证
        context = ssl._create_unverified_context()

        # 发送请求并获取响应
        response = request.urlopen(req, timeout=10, context=context)

        if response.status == 200:
            # 获取网页内容并解码
            content = response.read()
            # 尝试不同的编码方式
            for encoding in ["utf-8", "gbk", "gb2312"]:
                try:
                    html_content = content.decode(encoding)
                    # 提取主要内容
                    return extract_main_content(html_content, url)
                except UnicodeDecodeError:
                    continue
            return ""
        return ""
    except Exception as e:
        print(f"获取内容失败: {url}, 错误: {str(e)}")
        return ""


def main(args) -> str:
    try:
        print("开始处理数据...")

        # 从args获取输入数据
        news_list = args.params["news"]
        print(f"获取到 {len(news_list)} 条新闻数据")

        results = []
        # 处理每条新闻
        for idx, item in enumerate(news_list, 1):
            print(f"\n处理第 {idx} 条新闻:")
            print(f"标题: {item.get('title', 'N/A')}")

            # 检查URL是否存在
            if "url" not in item:
                print(f"警告: 第 {idx} 条新闻没有URL")
                content = ""
            else:
                print(f"URL: {item['url']}")
                # 获取URL内容
                content = fetch_content(item["url"])

            print(f"内容长度: {len(content)} 字符")
            if not content:
                print(f"警告: 第 {idx} 条新闻未能获取到内容")

            # 构建单条新闻的结果字典
            news_item = {
                "index": idx,  # 添加序号
                "title": item["title"],
                "time": item["time"],
                "summary": item["summary"],
                "content": content,  # 存储提取的主要内容
                "url": item.get("url", ""),  # 添加URL字段到输出
            }
            results.append(news_item)
            print(f"第 {idx} 条新闻处理完成")

        # 构建返回对象并转换为格式化的JSON字符串
        data = {"news_data": results}
        ret = json.dumps(data, ensure_ascii=False, indent=2)
        print(f"\n全部处理完成，共 {len(results)} 条新闻")

        # 统计内容获取情况
        success_count = sum(1 for item in results if item["content"])
        print(f"成功获取内容: {success_count}/{len(results)} 条")

    return ret

    except Exception as e:
        print(f"main函数执行出错: {str(e)}")
        import traceback

        traceback.print_exc()
        raise Exception(f"Error in main: {str(e)}")
