from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from crag import app
from pydantic import BaseModel



class Session(BaseModel):
    username: str
    conversationID: int
    relationShipStatus: str
    workingStatus: str
    bestFriendShortIntro: str

class TextRequest(BaseModel):
    question: str
    session:Session

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
    print(request)
    result = app.invoke({
        "keys": {
            "question": request.question,
            "session":request.session,
            "local": "No",
        }
    })
    return result['keys']['generation']
            