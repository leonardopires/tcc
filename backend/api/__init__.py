import subprocess
import tempfile

from typing import Union
from fastapi import FastAPI, UploadFile, File, HTTPException, WebSocket
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    print ("> File uploaded: ", file.filename)
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=f"-{file.filename}")
    try:
        contents = file.file.read()
        with temp as f:
            f.write(contents)
            print("> File saved: ", temp.name)
            subprocess.run(["demucs", "--mp3", "-d=cuda", temp.name])
            print("> Demucs completed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)
    finally:
        file.file.close()

    return {"filename": temp.name.removesuffix(".mp3")}


@app.websocket("/ws_split")
async def ws_split(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_bytes()
        websocket.send_json({"status": "Done"})
