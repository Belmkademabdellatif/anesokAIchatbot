from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from crag import app
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from async_generator import asynccontextmanager

class TextRequest(BaseModel):
    question: str

server = FastAPI()

# Enable CORS
server.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend origin here
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

@server.post("/generate/")
def generate_answer(request: TextRequest):
    result = app.invoke({
        "keys": {
            "question": request.question,
            "local": "No"
        }
    })
    return result['keys']['generation']
            