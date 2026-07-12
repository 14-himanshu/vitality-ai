# pyrefly: ignore [missing-import]
from fastapi import FastAPI, File, UploadFile, Form
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse
from agent import process_agent_query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import base64

@app.post("/ask")
async def ask_agent(
    command: str = Form(...),
    userId: str = Form(...),
    userContext: str = Form(None),
    imageBase64: str = Form(None)
):
    image_bytes = None
    if imageBase64:
        # Strip the data:image/jpeg;base64, prefix if present
        if "," in imageBase64:
            imageBase64 = imageBase64.split(",")[1]
        if imageBase64:
            image_bytes = base64.b64decode(imageBase64.split(",")[1] if "," in imageBase64 else imageBase64)
            
    # Process with Agent
    result = await process_agent_query(command, userId, image_bytes, userContext)
    return JSONResponse(content=result)

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
