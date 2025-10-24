import openai
import json
client = openai.OpenAI(
    base_url="https://aiportalapi.stu-platform.live/jpe",
    api_key="sk-C7RYrHpOQlgwCJkL0LB2cw"
)

def detect_scam():
    print("=== Scam Detector Chat ===")
    print("Dán tin nhắn hoặc đoạn chat vào đây (gõ 'exit' để thoát)\n")

    #Conversation diaglouge
    conversation = []

    #System prompt
    system_prompt = {
        "role": "system",
        "content": """Bạn là một AI chuyên phát hiện nội dung lừa đảo (scam/phishing).
            Phân tích đoạn chat hoặc tin nhắn người dùng gửi
            và trả lời một trong hai dạng:
            1️⃣ '⚠️ Có dấu hiệu lừa đảo' — kèm lý do (ví dụ: hứa hẹn tiền, link giả mạo, thông tin nhạy cảm).
            2️⃣ '✅ Không có dấu hiệu lừa đảo' — nếu tin nhắn an toàn, tự nhiên.
            Hãy thật ngắn gọn và dễ hiểu cho người dùng bình thường."""
    }

    fewshot_prompts = [
        {
            "role" : "user", "content" : "Tài khoản của bạn vừa bị đăng nhập ở nơi khác. Vui lòng nhấn vào link để xác nhận thông tin và bảo vệ tài khoản của bạn."
        },
        {
            "role" : "assistant", "content" : "⚠️ Có dấu hiệu lừa đảo"
        },
        {
            "role" : "user", "content" : "Hệ thống phát hiện máy tính của bạn có virus. Gọi ngay hotline 1800-XXX-XXX để được hỗ trợ và tránh mất dữ liệu."
        },
        {
            "role" : "assistant", "content" : "⚠️ Có dấu hiệu lừa đảo"
        },
        {
            "role" : "user", "content" : "Chào bạn, hôm nay bạn thế nào?"
        },
        {
            "role" : "assistant", "content" : "✅ Không có dấu hiệu lừa đảo"
        },
        {
            "role" : "user", "content" : "Mẹ nấu cơm xong rồi, về ăn nhé."
        },
        {
            "role" : "assistant", "content" : "✅ Không có dấu hiệu lừa đảo"
        }
    ]

    conversation.append(system_prompt)
    conversation.append(fewshot_prompts)

    print(conversation)

    # Define a function schema
    functions = [
        {
            "name": "check_scam",
            "description": "Classify a message as scam or not. If it is a scam message returns ⚠️ Có dấu hiệu lừa đảo, if not returns ✅ Không có dấu hiệu lừa đảo",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": ["⚠️ Có dấu hiệu lừa đảo", "✅ Không có dấu hiệu lừa đảo"],
                        "description": "Scam status"
                    }
                },
                "required": ["status"]
            }
        }
    ]

    while True:
        user_input = input("Tin nhắn: ")
        if user_input.lower() == "exit":
            break

        conversation = [system_prompt]
        conversation.extend(fewshot_prompts)

        response = client.chat.completions.create(
            model="GPT-4o-mini",
            messages=conversation,
            temperature=0.3,
            functions=functions,
            function_call={"name":"check_scam"}
        )

        ai_message = response.choices[0].message
        ai_message_content = json.loads(ai_message.function_call.arguments)
        print("\nKết quả:", ai_message_content["status"], "\n")
        conversation.append({"role": "assistant", "content": ai_message_content["status"]})

if __name__ == "__main__":
    detect_scam()