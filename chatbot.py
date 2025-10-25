import openai

client = openai.OpenAI(
    base_url="https://aiportalapi.stu-platform.live/jpe",
    api_key="sk-C7RYrHpOQlgwCJkL0LB2cw"
)

def detect_scam():
    print("=== Scam Detector Chat ===")
    print("Dán tin nhắn hoặc đoạn chat vào đây (gõ 'exit' để thoát)\n")

    conversation = [
        {
            "role": "system",
            "content": (
                "Bạn là một AI chuyên phát hiện nội dung lừa đảo (scam/phishing). "
                "Phân tích đoạn chat hoặc tin nhắn người dùng gửi, "
                "và trả lời một trong hai dạng:\n"
                "1️⃣ '⚠️ Có dấu hiệu lừa đảo' — kèm lý do (ví dụ: hứa hẹn tiền, link giả mạo, thông tin nhạy cảm).\n"
                "2️⃣ '✅ Không có dấu hiệu lừa đảo' — nếu tin nhắn an toàn, tự nhiên.\n"
                "Hãy thật ngắn gọn và dễ hiểu cho người dùng bình thường."
            )
        }
    ]

    while True:
        user_input = input("Tin nhắn: ")
        if user_input.lower() == "exit":
            break

        conversation.append({"role": "user", "content": user_input})

        response = client.chat.completions.create(
            model="GPT-4o-mini",
            messages=conversation,
            temperature=0.3
        )

        ai_message = response.choices[0].message.content
        print("\nKết quả:", ai_message, "\n")

        conversation.append({"role": "assistant", "content": ai_message})

if __name__ == "__main__":
    detect_scam()