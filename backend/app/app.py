from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

import torch
from torch import autocast
from diffusers import StableDiffusionPipeline

from io import BytesIO
import base64

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
    prompts = [prompt] * 4
    with autocast(device): 
        images = pipe(prompts, height=512, width=512, guidance_scale=8).images

    imgArr = []

    for image in images:
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        imgArr.append(base64.b64encode(buffer.getvalue()))

    return imgArr