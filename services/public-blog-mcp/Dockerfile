FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml .
COPY src ./src
RUN pip install --no-cache-dir .
USER 65532:65532
EXPOSE 8000
CMD ["personal-blog-mcp"]
