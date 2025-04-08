import json
from typing import Dict, Any


def main(args) -> str:
    try:
        print("开始处理数据...")

        # 从args获取输入数据
        params = args.params

        # 获取choosed_number和input数据
        choosed_number = params.get("choosed_number")  # 直接获取整数值
        input_data = params.get("input", [])

        print(f"选择的序号: {choosed_number}")
        print(f"输入数据条数: {len(input_data)}")

        # 查找匹配的新闻
        selected_news = None
        for item in input_data:
            if item.get("index") == choosed_number:
                selected_news = item
                break

        if selected_news is None:
            print(f"警告: 未找到序号为 {choosed_number} 的新闻")
            return json.dumps(
                {"error": f"未找到序号为 {choosed_number} 的新闻"},
                ensure_ascii=False,
                indent=2,
            )

        # 构建返回对象，使用news_data作为键名
        result = {"news_data": [selected_news]}

        # 转换为JSON字符串
        ret = json.dumps(result, ensure_ascii=False, indent=2)
        print(f"\n处理完成，找到序号为 {choosed_number} 的新闻")

        return ret

    except Exception as e:
        print(f"处理过程中出现错误: {str(e)}")
        import traceback

        traceback.print_exc()
        return json.dumps({"error": str(e)}, ensure_ascii=False, indent=2)
