import json
from process_number import main

try:
    print("开始测试...")

    # 读取data.json作为测试数据
    print("正在读取data.json...")
    with open("data.json", "r", encoding="utf-8") as f:
        json_data = json.load(f)
        # 打印输入数据
        print("\n输入数据:")
        print(json.dumps(json_data, ensure_ascii=False, indent=2))

    # 创建模拟的Args对象
    class Args:
        def __init__(self, data):
            self.params = data

    # 创建Args实例
    test_args = Args(json_data)

    # 打印输入值
    print(f"\n输入值: {json_data.get('input', 0)}")

    # 调用main函数处理数据
    print("\n调用main函数处理数据...")
    ret_json = main(test_args)  # 获取JSON字符串

    # 将返回的JSON字符串解析为Python对象
    ret_data = json.loads(ret_json)

    # 打印处理结果
    print("\n处理结果:")
    if "output_data" in ret_data:
        print(f"输出值: {ret_data['output_data']}")

    # 将结果保存到文件
    output_file = "number_result.json"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(json.dumps(ret_data, ensure_ascii=False, indent=2))
    print(f"\n结果已保存到 {output_file}")

except FileNotFoundError:
    print("错误: 找不到data.json文件")
except json.JSONDecodeError as e:
    print(f"错误: JSON格式无效: {str(e)}")
except Exception as e:
    print(f"测试过程中出现错误: {str(e)}")
    import traceback

    traceback.print_exc()
