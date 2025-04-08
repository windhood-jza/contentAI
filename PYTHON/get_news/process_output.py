import json
from typing import Dict, List, Any


def main(args) -> str:
    try:
        print("开始处理数据...")

        # 从args获取输入数据
        input_list = args.params.get("input", [])
        print(f"获取到 {len(input_list)} 条输入数据")

        # 打印第一条数据的结构（调试用）
        if input_list:
            print("\n第一条数据的结构:")
            print(json.dumps(input_list[0], ensure_ascii=False, indent=2))

        results = []
        # 处理每条数据
        for idx, item in enumerate(input_list, 1):
            print(f"\n处理第 {idx} 条数据:")

            # 构建输出项（同时检查中英文字段名）
            output_item = {
                "title": item.get("title", item.get("标题", "")),
                "content": item.get("content", item.get("正文", "")),
            }

            # 打印处理信息
            print(f"标题: {output_item['title']}")
            print(f"内容长度: {len(output_item['content'])} 字符")

            # 如果标题和内容都为空，打印原始数据（调试用）
            if not output_item["title"] and not output_item["content"]:
                print("警告: 未找到标题和内容，原始数据:")
                print(json.dumps(item, ensure_ascii=False, indent=2))

            results.append(output_item)
            print(f"第 {idx} 条数据处理完成")

        # 构建返回对象并转换为格式化的JSON字符串
        data = {"output_data": results}
        ret = json.dumps(data, ensure_ascii=False, indent=2)
        print(f"\n全部处理完成，共 {len(results)} 条数据")

        return ret

    except Exception as e:
        print(f"main函数执行出错: {str(e)}")
        import traceback

        traceback.print_exc()
        raise Exception(f"Error in main: {str(e)}")
