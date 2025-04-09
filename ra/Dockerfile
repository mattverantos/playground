FROM python:3.13

RUN pip install uv && useradd user -u 1000 -m
USER user
ENV UV_CACHE_DIR=/tmp/uv_cache

WORKDIR /app
COPY pyproject.toml /app/pyproject.toml
COPY uv.lock /app/uv.lock
RUN uv sync
COPY main.py /app/main.py
