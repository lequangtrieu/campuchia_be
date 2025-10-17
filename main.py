from flask import Flask, request, jsonify
from openai import AzureOpenAI
from dotenv import load_dotenv
import os

class OpenAIChat:
    def __init__(self, systemPromt):
        self.history = [{'role':"system", 'content': "You are a chat analyzer who will detect if there are any scam in the conversation"}]
        self.systemPromt = systemPromt

        load_dotenv('key.env')

        client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version="2024-07-01-preview",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
    
    @app.route('/api/---', methods=['POST'])
    def sendMessage():
        data = request.get_json()
        name = data.get("name", "stranger")
        return jsonify({"message": f"Hello, {name}!"})



app = Flask(__name__)

@app.route('/api/greet', methods=['POST'])
def greet():
    

if __name__ == '__main__':
    app.run(debug=True)
