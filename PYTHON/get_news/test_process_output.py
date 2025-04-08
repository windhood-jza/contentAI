import json
from process_output import main

try:
    print("开始测试...")

    # 读取data.json作为测试数据
    print("正在读取data.json...")
    with open("data.json", "r", encoding="utf-8") as f:
        json_data = json.load(f)
        # 打印完整的输入数据结构（调试用）
        print("\n输入数据结构:")
        print(json.dumps(json_data, ensure_ascii=False, indent=2))

    # 创建模拟的Args对象
    class Args:
        def __init__(self, data):
            self.params = data

    # 创建Args实例
    test_args = Args(json_data)

    # 打印数据结构
    print(f"\n成功创建测试数据")
    if "input" in json_data:
        input_count = len(json_data["input"])
        print(f"输入数据数量: {input_count}")
        print("\n数据列表:")
        for idx, item in enumerate(json_data["input"], 1):
            print(f"{idx}. 数据字段:")
            for key, value in item.items():
                if isinstance(value, str):
                    print(f"   {key}: {value[:50]}...")  # 只显示前50个字符
                else:
                    print(f"   {key}: {type(value)}")

    # 调用main函数处理数据
    print("\n调用main函数处理数据...")
    ret_json = main(test_args)  # 获取JSON字符串

    # 将返回的JSON字符串解析为Python对象
    ret_data = json.loads(ret_json)

    # 打印处理状态
    print("\n处理状态:")
    if "output_data" in ret_data:
        for idx, item in enumerate(ret_data["output_data"], 1):
            content_length = len(item["content"])
            print(f"{idx}. {item['title']}")
            print(f"   内容长度: {content_length} 字符")
            if content_length == 0:
                print("   警告: 内容为空")

    # 将结果保存到文件
    output_file = "output_result.json"
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
