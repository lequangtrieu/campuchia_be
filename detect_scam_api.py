from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

# 🔑 Kết nối OpenAI API
client = openai.OpenAI(
    base_url="https://aiportalapi.stu-platform.live/jpe",
    api_key="sk-C7RYrHpOQlgwCJkL0LB2cw"
)

@app.route("/detect", methods=["POST"])
def detect_scam():
    data = request.get_json()
    text = data.get("message", "")

    # 🧠 Prompt hướng dẫn AI nhận biết lừa đảo
    conversation = [
        {
            "role": "system",
            "content": (
                "Bạn là một AI phát hiện nội dung lừa đảo trong tin nhắn. "
                "Trả lời cực ngắn gọn chỉ theo 1 trong 3 dạng sau:\n\n"
                "⚠️ Có dấu hiệu lừa đảo — nêu lý do ngắn (ví dụ: hứa hẹn tiền, link giả mạo, yêu cầu thông tin cá nhân)\n"
                "✅ Không có dấu hiệu lừa đảo — nếu nội dung an toàn, tự nhiên\n"
                "❓ Không chắc chắn — nếu nội dung mơ hồ, cần người dùng kiểm tra thêm"
            ),
        },
        {"role": "user", "content": text},
    ]

    # 🚀 Gọi OpenAI model
    response = client.chat.completions.create(
        model="GPT-4o-mini",
        messages=conversation,
        temperature=0.3,
    )

    result = response.choices[0].message.content
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7009)