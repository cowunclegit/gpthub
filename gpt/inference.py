import uvicorn
from fastapi import FastAPI
import torch
from transformers import T5TokenizerFast, T5ForConditionalGeneration

app = FastAPI();

# GPU 사용 가능 여부 확인
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# 토크나이저와 모델 로드 및 GPU에 이동
tokenizer = T5TokenizerFast.from_pretrained("./outputs/model_files")
model = T5ForConditionalGeneration.from_pretrained("./outputs/model_files")
model.to(device)

@app.get("/")
def root():
    # 입력 데이터 생성 및 GPU에 이동
    #prompt_tpl = "사용자가 한 말을 읽고 그에 질문에 답하거나 명령에 응답하는 비서입니다.\n\n사용자:\n{text}\n\n비서:\n"
    prompt_tpl = "질문을 받으면 답변을 해주는 BOT입니다.\n BOT : {text}\n 사용자 : "
    prompt = prompt_tpl.format(text="제일 재미있는 여행 프로그램은?")
    input_ids = tokenizer(prompt, return_tensors='pt').input_ids.to(device)

    # 모델로 추론 수행
    logits = model.generate(
        input_ids,
        max_length=1024,
        temperature=0.5,
        no_repeat_ngram_size=6,
        do_sample=True,
        num_return_sequences=1,
    )
    text = tokenizer.batch_decode(logits, skip_special_tokens=True)[0]
    print(text)
    return text
