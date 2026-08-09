FROM python:3.11-slim

WORKDIR /app

# (Removed build-essential to save 500MB of disk space during build)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
