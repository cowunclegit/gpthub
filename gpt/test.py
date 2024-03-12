import sys
import uvicorn
from fastapi import FastAPI

app = FastAPI();

@app.get("/")
def root():
    return 'Server is Running'

if __name__ == "__main__":
    argv = sys.argv
    if len(argv) < 2:
        print('Input Port')
    else:
        uvicorn.run(app, host="0.0.0.0", port=argv[1])
