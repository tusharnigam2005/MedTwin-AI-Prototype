FROM python:3.11-slim

WORKDIR /app

# (Removed build-essential to save 500MB of disk space during build)
# Prevent Python from writing .pyc files to save disk space
ENV PYTHONDONTWRITEBYTECODE=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    find /usr/local/lib/python3.11/site-packages/ -name "*.pyc" -delete && \
    find /usr/local/lib/python3.11/site-packages/ -name "__pycache__" -delete && \
    rm -rf /root/.cache

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
