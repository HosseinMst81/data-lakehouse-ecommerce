# backend/Dockerfile
FROM phase1-environment-setup-spark-master:latest

USER root

# Install Python dependencies
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Create a working directory
WORKDIR /app

# Copy the application
COPY main.py /app/main.py

# Expose port
EXPOSE 8000

# Run the FastAPI server (using the spark user for permissions)
USER ${spark_uid}
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]