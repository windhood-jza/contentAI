import json
from sample import main

try:
    print("开始测试...")

    # 读取data.json作为测试数据
    print("正在读取data.json...")
    with open("data.json", "r", encoding="utf-8") as f:
        json_data = json.load(f)

    # 创建模拟的Args对象
    class Args:
        def __init__(self, data):
            self.params = data

    # 创建Args实例
    test_args = Args(json_data)

    # 打印数据结构
    print(f"成功创建测试数据")
    if "news" in json_data:
        news_count = len(json_data["news"])
        print(f"新闻数量: {news_count}")
        print("\n新闻URL列表:")
        for idx, news in enumerate(json_data["news"], 1):
            print(f"{idx}. {news.get('title', 'N/A')}")
            print(f"   URL: {news.get('url', '无')}")

    # 调用main函数处理数据
    print("\n调用main函数处理数据...")
    ret_json = main(test_args)  # 获取JSON字符串

    # 将返回的JSON字符串解析为Python对象
    ret_data = json.loads(ret_json)

    # 打印内容获取状态
    print("\n内容获取状态:")
    for idx, news in enumerate(ret_data["news_data"], 1):
        content_length = len(news["content"])
        status = "成功" if content_length > 0 else "失败"
        print(f"{idx}. {news['title']}")
        print(f"   状态: {status} (内容长度: {content_length})")
        print(f"   URL: {news.get('url', '无')}")

    # 将结果保存到文件
    with open("result.json", "w", encoding="utf-8") as f:
        f.write(json.dumps(ret_data, ensure_ascii=False, indent=2))
    print("\n结果已保存到 result.json")

except FileNotFoundError:
    print("错误: 找不到data.json文件")
except json.JSONDecodeError as e:
    print(f"错误: JSON格式无效: {str(e)}")
except Exception as e:
    print(f"测试过程中出现错误: {str(e)}")
    import traceback

    traceback.print_exc()
