from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict

app = FastAPI()

# Store active users: user_id -> WebSocket
active_connections: Dict[str, WebSocket] = {}

@app.get('/')
def read_root():
    return {"message" : "Chat server is running"}

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    active_connections[user_id] = websocket
    print(f"User {user_id} connected.")

    try:
        while True:
            data = await websocket.receive_json()
            to_user = data.get("to")
            message = data.get("message")

            if to_user in active_connections:
                await active_connections[to_user].send_json({
                    "from": user_id,
                    "message": message
                })
            else:
                await websocket.send_json({
                    "error": f"User {to_user} is not connected."
                })

    except WebSocketDisconnect:
        del active_connections[user_id]
        print(f"User {user_id} disconnected.")
