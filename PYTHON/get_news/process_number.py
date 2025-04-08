import json
from typing import Dict, Any


def main(args) -> str:
    try:
        print("开始处理数据...")

        # 从args获取输入数据
        input_value = args.params.get("input", 0)
        print(f"获取到输入值: {input_value}")

        # 将输入值加1
        result = input_value + 1
        print(f"处理后的值: {result}")

        # 构建返回对象并转换为格式化的JSON字符串
        data = {"output_data": result}
        ret = json.dumps(data, ensure_ascii=False, indent=2)
        print("\n处理完成")

        return ret

    except Exception as e:
        print(f"main函数执行出错: {str(e)}")
        import traceback

        traceback.print_exc()
        raise Exception(f"Error in main: {str(e)}")
