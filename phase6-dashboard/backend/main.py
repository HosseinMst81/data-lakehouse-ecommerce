from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pyspark.sql import SparkSession
from pyspark.sql.functions import col
import os

app = FastAPI(title="E-Commerce Dashboard API")

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Spark session (connect to the existing cluster)
spark = SparkSession.builder \
    .appName("DashboardBackend") \
    .master("spark://spark-master:7077") \
    .config("spark.hadoop.fs.s3a.endpoint", "http://minio:9000") \
    .config("spark.hadoop.fs.s3a.access.key", "minioadmin") \
    .config("spark.hadoop.fs.s3a.secret.key", "minioadmin") \
    .config("spark.hadoop.fs.s3a.path.style.access", "true") \
    .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem") \
    .config("spark.hadoop.fs.s3a.connection.ssl.enabled", "false") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
    .getOrCreate()

# Base paths for Gold tables
GOLD_BASE = "s3a://ecommerce-gold/delta/gold"

@app.get("/api/daily_sales")
def daily_sales(limit: int = Query(default=100, le=500)):
    df = spark.read.format("delta").load(f"{GOLD_BASE}/daily_sales")
    # Ensure date is converted to string for JSON
    pdf = df.orderBy("SaleDate").limit(limit).toPandas()
    pdf["SaleDate"] = pdf["SaleDate"].astype(str)
    return pdf.to_dict(orient="records")

@app.get("/api/monthly_sales")
def monthly_sales():
    df = spark.read.format("delta").load(f"{GOLD_BASE}/monthly_sales")
    pdf = df.orderBy("Year", "Month").toPandas()
    # Create a 'period' column for display
    pdf["period"] = pdf["Year"].astype(str) + "-" + pdf["Month"].astype(str).str.zfill(2)
    return pdf.to_dict(orient="records")

@app.get("/api/top_products")
def top_products(limit: int = Query(default=10, le=50)):
    df = spark.read.format("delta").load(f"{GOLD_BASE}/top_products_revenue")
    pdf = df.orderBy(col("TotalRevenue").desc()).limit(limit).toPandas()
    return pdf.to_dict(orient="records")

@app.get("/api/sales_by_country")
def sales_by_country():
    df = spark.read.format("delta").load(f"{GOLD_BASE}/sales_by_country")
    pdf = df.orderBy(col("TotalRevenue").desc()).toPandas()
    return pdf.to_dict(orient="records")

@app.get("/api/top_customers")
def top_customers(limit: int = Query(default=10, le=50)):
    df = spark.read.format("delta").load(f"{GOLD_BASE}/top_customers")
    pdf = df.orderBy(col("TotalRevenue").desc()).limit(limit).toPandas()
    return pdf.to_dict(orient="records")

# Additional KPI summary endpoint
@app.get("/api/summary")
def summary():
    daily_df = spark.read.format("delta").load(f"{GOLD_BASE}/daily_sales")
    monthly_df = spark.read.format("delta").load(f"{GOLD_BASE}/monthly_sales")
    total_revenue = daily_df.agg({"TotalRevenue": "sum"}).collect()[0][0]
    total_invoices = daily_df.agg({"NumberOfInvoices": "sum"}).collect()[0][0]
    avg_daily_revenue = total_revenue / daily_df.count()
    return {
        "total_revenue": round(total_revenue, 2),
        "total_invoices": int(total_invoices),
        "avg_daily_revenue": round(avg_daily_revenue, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)