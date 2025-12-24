FROM python:3.12

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# 2. Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .
RUN cp /app/env-example .env 

EXPOSE 80

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]