# 📘 Phase 1: Environment Setup

**Objective:** Provision the foundational infrastructure for the Data Lakehouse project using Docker Compose. This includes a local S3-compatible object store (MinIO) and a distributed processing engine (Apache Spark) with seamless connectivity between them.

## 1. Architecture Overview
```text
                     ┌────────────────────┐
                     │   Docker Network   │
                     │   lakehouse-net    │
                     └────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
 ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
 │   minio     │      │ spark-master │      │ spark-worker │
 │  (MinIO)    │      │  (Spark)     │      │  (Spark)     │
 │             │      │              │      │              │
 │ API: 9000   │      │ UI: 8080     │      │ UI: 8081     │
 │ Console:9001│      │ RPC: 7077    │      │              │
 └─────────────┘      └──────────────┘      └──────────────┘
 ```
 
- **MinIO** – object storage compatible with Amazon S3 API; stores raw, bronze, silver, and gold data.  
- **Spark Master** – cluster manager; receives and schedules jobs.  
- **Spark Worker** – executor node; performs the actual computations.  

All three services share the `lakehouse-net` bridge network for internal communication.

## 2. Technology Stack

| Component               | Technology                 | Version / Tag                |
| ----------------------- | -------------------------- | ---------------------------- |
| Container Runtime       | Docker & Docker Compose    | 3.8+                         |
| Object Store            | MinIO                      | `minio/minio:latest`         |
| Compute                 | Apache Spark (PySpark)     | `apache/spark-py:3.5.0`      |
| S3 File System          | Hadoop AWS + AWS Java SDK  | 3.3.4 / 1.12.262             |

## 3. Directory Structure
```text
phase1-environment-setup/
├── docker-compose.yml # Service orchestration
├── spark/
│ ├── Dockerfile # Custom Spark image with S3 libraries
│ └── spark-defaults.conf # Spark configuration for MinIO access
├── scripts/
│ └── test_connection.py # End‑to‑end connectivity test
└── README.md # This document
```

## 4. Service Description

### 4.1 MinIO
- **Image:** `minio/minio:latest`
- **Ports:**
  - `9000` → S3-compatible API
  - `9001` → Web Console
- **Credentials:** `minioadmin` / `minioadmin` (adjustable via environment variables)
- **Storage:** Persisted using a named Docker volume (`minio_data`)
- **Health check:** regularly probes the `/health/live` endpoint

### 4.2 Spark Master
- **Image:** custom built from `./spark/Dockerfile`
- **Ports:**
  - `8080` → Web UI
  - `7077` → RPC endpoint for workers
- **Environment:** `SPARK_MODE=master`
- **Mounts:** test scripts and the `spark-defaults.conf` configuration file

### 4.3 Spark Worker
- **Image:** same custom image
- **Ports:** `8081` → Worker Web UI
- **Environment:** `SPARK_MODE=worker`, `SPARK_MASTER_URL=spark://spark-master:7077`
- **Resources:** 1G memory, 1 core (scalable)
- **Depends on:** `spark-master` service

## 5. Prerequisites

- Docker (≥ 20.10) and Docker Compose (≥ 1.29)
- At least 4 GB of free RAM (allocatable to Docker)
- Ports `9000`, `9001`, `8080`, `8081`, `7077` available on the host (or modify the compose file accordingly)

## 6. Setup Instructions

### 6.1 Clone the Repository

```bash
git clone <your-repo-url>
cd data-lakehouse-ecommerce/phase1-environment-setup
```

### 6.2 Build and Start the Services
```bash
docker-compose up -d --build
```
The --build flag ensures the custom Spark image is built with the required S3 libraries.

Verify that all containers are running:
```bash
docker-compose ps
```

Expected output: minio, spark-master, spark-worker all in Up state.

### 6.3 Create a Test Bucket in MinIO
Open the MinIO Console at http://localhost:9001.

Log in with minioadmin / minioadmin.

Click Buckets → Create Bucket.

Name it test-bucket (or any name; the test script expects test-bucket).

### 6.4 Run the Connectivity Test
Execute the PySpark test script inside the master container:

```bash
docker exec -it spark-master /opt/spark/bin/spark-submit \
  --master spark://spark-master:7077 \
  /opt/spark/work-dir/scripts/test_connection.py
```
If successful, you will see:

- A message “Data written successfully to MinIO.”

- A DataFrame with three rows printed in the console.

- The bucket test-bucket will contain Parquet files under output/parquet/test_data/ (visible in MinIO Console).

## 7. Configuration Deep‑Dive
### 7.1 Custom Spark Dockerfile
```dockerfile
FROM apache/spark-py:3.5.0
USER root
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*
ENV HADOOP_AWS_VERSION=3.3.4
ENV AWS_SDK_VERSION=1.12.262
RUN wget -q -P /opt/spark/jars/ \
    https://repo1.maven.org/.../hadoop-aws-${HADOOP_AWS_VERSION}.jar \
    && wget -q -P /opt/spark/jars/ \
    https://repo1.maven.org/.../aws-java-sdk-bundle-${AWS_SDK_VERSION}.jar
USER ${spark_uid}
```
*Why:* The base Spark image lacks the hadoop-aws and AWS SDK JARs, which are required for Spark to treat s3a:// paths. This Dockerfile downloads them from Maven Central at build time.

## 7.2 Spark Defaults (spark-defaults.conf)
```properties
spark.hadoop.fs.s3a.endpoint           http://minio:9000
spark.hadoop.fs.s3a.access.key         minioadmin
spark.hadoop.fs.s3a.secret.key         minioadmin
spark.hadoop.fs.s3a.path.style.access  true
spark.hadoop.fs.s3a.impl               org.apache.hadoop.fs.s3a.S3AFileSystem
spark.hadoop.fs.s3a.connection.ssl.enabled  false
``` 
- Key settings:

endpoint – points to the MinIO API container.

path.style.access – mandatory for MinIO because it uses path‑style URLs (e.g., http://minio:9000/bucket/key) rather than virtual hosted‑style.

SSL is disabled for local development.

## 7.3 Test Script (test_connection.py)
The script:

1. Creates a Spark session (reads config from spark-defaults.conf).

2. Creates a tiny DataFrame.

3. Writes it as Parquet to s3a://test-bucket/output/parquet/test_data.

4. Reads it back and displays the content.

This validates both read and write operations against MinIO.

# 8. Accessing Web UIs
Component | URL | Credentials
MinIO Console	http://localhost:9001	minioadmin/minioadmin
Spark Master UI	http://localhost:8080	none
Spark Worker UI	http://localhost:8081	none