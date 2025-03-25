
from .rag import prompt_maker, ask_gemini
from fastapi import FastAPI, WebSocket
import json
from .agent import research_bot, streaming_research_bot
app = FastAPI()

@app.websocket("/ask")
async def ask( websocket: WebSocket):
    print("The endpoint was hit!!!")
    await websocket.accept()
    print("After accepting in normal ask")
    
    try:
        while True:
          
            data = await websocket.receive_text()
            parsed_data = json.loads(data)
            query = parsed_data.get("query", "")
            role = parsed_data.get("role", "")
            
            research  = await research_bot(query)
            
        
            prompt = prompt_maker(question = query, context = research, role = "Please provide a detailed response using all the research in the 'CONTEXT' section and try to add on any information you may know that is not outdated or relient on current events.")

         
            print("THIS IS MY PROMPT:::     ", prompt)
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