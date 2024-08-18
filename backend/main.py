import uvicorn

from dotenv import load_dotenv
import os

from app.api import app

load_dotenv()

uvicorn.run(app, host=os.getenv('HOST'), port=int(os.getenv('PORT')))