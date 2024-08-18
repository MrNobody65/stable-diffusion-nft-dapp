from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

import torch
from torch import autocast
from diffusers import StableDiffusionPipeline

from io import BytesIO
import base64

print(torch.cuda.is_available())

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=["*"],
    allow_methods=["*"], 
    allow_headers=["*"]
)

device = "cuda"
model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16, variant="fp16")
pipe.to(device)

@app.get("/")
def generate(prompt: str): 
    with autocast(device): 
        image = pipe(prompt, guidance_scale=8.5).images[0]

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(content=imgstr, media_type="image/png")