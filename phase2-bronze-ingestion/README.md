📖 Preliminary Concepts: From Warehouse to Lakehouse & Our Tech Stack
=====================================================================

Why a New Data Architecture?
----------------------------

As data volumes grow, traditional storage (flat CSV files, relational databases) struggles to scale, guarantee consistency, and support advanced analytics at the same time. Modern data teams need a platform that is **scalable**, **reliable**, **fast for both batch and interactive queries**, and **capable of tracking data lineage**. This project implements a **Data Lakehouse** to achieve exactly that, blending the best of two earlier paradigms: the Data Warehouse and the Data Lake.

A Quick History: Warehouse → Lake → Lakehouse
---------------------------------------------

1.  **Data Warehouse (1990s–today)**
    
    *   Stores highly structured, pre-processed data optimized for business intelligence.
        
    *   Enforces strict schemas, ACID transactions, and excellent performance for SQL queries.
        
    *   **Weakness:** expensive to scale, handles only structured data, and becomes a bottleneck when data variety or volume explodes.
        
2.  **Data Lake (2010s)**
    
    *   A cheap, scalable repository that stores raw data in any format (CSV, JSON, Parquet, etc.) on commodity object storage like Amazon S3.
        
    *   **Strength:** extremely flexible and cost-effective.
        
    *   **Weakness:** turns into a “data swamp” without proper governance; lacks ACID transactions, making updates and reliable reads difficult.
        
3.  **Data Lakehouse (emerging standard)**
    
    *   Combines a **Lake’s low-cost object storage** with a **transactional layer** (e.g., Delta Lake) that brings ACID guarantees, schema enforcement, and performance optimizations.
        
    *   You keep raw data on cheap, scalable storage, yet can query, update, and version it like a warehouse.
        
    *   Our project adopts this architecture using **MinIO (local S3)** as the lake, **Apache Spark** for processing, and **Delta Lake** as the transactional table format.
        

Core Building Blocks (in a logical chain)
-----------------------------------------

Below we explain the tools and concepts in the order they appear in the pipeline, from infrastructure to the final data structure.

### 1\. Containerization with Docker

Docker packages each service (Spark, MinIO) into isolated, reproducible environments. This guarantees the exact same setup runs on any machine. Docker Compose orchestrates multiple containers, networking them together so they communicate seamlessly.

### 2\. Object Storage & MinIO (The Data Lake)

*   **Object Storage** stores data as immutable _objects_ (key + value + metadata) in a flat namespace called a **bucket**. It scales horizontally by adding more nodes, making it ideal for big data.
    
*   **MinIO** is an open-source, self-hosted object store that is fully compatible with the Amazon S3 API. In our project it runs locally, serving as the data lake’s physical storage.
    
*   **Bucket**: a logical container for objects. We create buckets like ecommerce-bronze to organise raw data or test outputs.
    

### 3\. Apache Spark (The Compute Engine)

Spark is a unified, distributed processing engine that runs across a cluster of machines. Key roles:

*   **Driver** – the application (your Python script).
    
*   **Cluster Manager** – allocates resources (Spark Master in our case).
    
*   **Executors** – workers that actually process partitions of data in parallel.We use PySpark to read CSV files, transform DataFrames, and write results to MinIO via the s3a:// protocol.
    

### 4\. Delta Lake (The Transactional Layer)

Delta Lake is an open-source storage layer that sits on top of Parquet files. It adds:

*   **ACID transactions** – all writes either complete or roll back, preventing corrupt data.
    
*   **Time Travel** – query previous versions of the data.
    
*   **Schema Enforcement & Evolution** – safely change the table schema over time.With Delta Lake, our lake gains warehouse-like reliability without moving the data to a separate system.
    

### 5\. Medallion Architecture (Organising the Data)

We structure data into progressively refined layers:

*   **🥉 Bronze** – exact copy of raw source data, only enriched with an ingestion\_time timestamp. This is the immutable foundation.
    
*   **🥈 Silver** – cleansed, deduplicated, and lightly transformed data, ready for analysis.
    
*   **🥇 Gold** – aggregated, business-level views optimized for reporting and dashboards.
    

This layered approach ensures traceability: any error in a later stage can be corrected by re-processing from Bronze.

How They Fit Together (Our Project)
-----------------------------------

1.  **Docker Compose** starts MinIO (object store), Spark Master, and Spark Worker(s) on a dedicated network.
    
2.  Spark reads a raw CSV file, adds ingestion\_time, and writes the DataFrame to a **Delta table** in MinIO’s ecommerce-bronze bucket – this forms the **Bronze layer**.
    
3.  In subsequent phases, Spark will read Bronze, perform cleaning (Silver), and eventually build aggregated views (Gold), all while preserving the ability to travel back in time or modify data safely.
    

This setup demonstrates a fully functional, local Data Lakehouse that is both educational and ready to scale to cloud environments.