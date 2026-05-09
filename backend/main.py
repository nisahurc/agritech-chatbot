from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODEL
model_path = "./agritech-chatbot"

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path)

tokenizer.pad_token = tokenizer.eos_token

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# REQUEST MODEL
class ChatRequest(BaseModel):
    question: str

# YASAKLI KELİMELER
yasakli = [
    "volt",
    "220",
    "24v",
    "ac",
    "dc",
    "plc",
    "sigorta",
    "alarm",
    "sinyal",
    "gerilim",
    "akım"
]

def temizle(text):
    for kelime in yasakli:
        text = re.sub(kelime, "", text, flags=re.IGNORECASE)

    return text

# CHAT API
@app.post("/chat")
def chat(req: ChatRequest):

    prompt = f"""
Kısa ve teknik cevap ver.

Soru: {req.question}

Cevap:
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt"
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():

        output = model.generate(
            **inputs,
            max_new_tokens=60,
            do_sample=False,
            repetition_penalty=1.5,
            no_repeat_ngram_size=3,
            pad_token_id=tokenizer.eos_token_id
        )

    response = tokenizer.decode(
        output[0],
        skip_special_tokens=True
    )

    answer = response.split("Cevap:")[-1].strip()

    answer = temizle(answer)

    answer = answer.replace("\n", " ")

    return {"answer": answer}