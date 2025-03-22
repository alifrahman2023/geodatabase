
from .rag import prompt_maker, ask_gemini
from fastapi import FastAPI, WebSocket
import json

app = FastAPI()

@app.websocket("/ask")
async def ask( websocket: WebSocket):
    print("The endpoint was hit!!!")
    await websocket.accept()
    print("After accepting in normal ask")

    try:
        while True:
            # Receive data from the WebSocket
            data = await websocket.receive_text()
            parsed_data = json.loads(data)
            query = parsed_data.get("query", "")
            role = parsed_data.get("role", "")

        
            if role == "":
                prompt = prompt_maker( question = query)

            else:
                prompt = prompt_maker(question = query, role = role)

         
            # Call the `ask_llama` async generator and stream its output
            async for message in ask_gemini(prompt):
                if not message["done"]:
                    print(message["response"])
                    await websocket.send_text(json.dumps({"response": message["response"], "done": False}))
                else:
                    await websocket.send_text(json.dumps({"done": True}))
                    await websocket.close()
                    return
    except Exception as e:
       
        await websocket.send_text(json.dumps({"error": str(e), "done": True}))
        await websocket.close()