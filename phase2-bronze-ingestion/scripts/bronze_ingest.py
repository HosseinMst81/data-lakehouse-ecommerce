# phase2-bronze-ingestion/scripts/bronze_ingest.py
"""
Bronze Layer Ingestion Script
Reads raw e-commerce CSV, adds ingestion timestamp, writes to MinIO as Delta table.
"""
from pyspark.sql import SparkSession
from pyspark.sql.functions import current_timestamp

# Create Spark session – custom config file will be provided via --properties-file
spark = SparkSession.builder \
    .appName("BronzeIngestion") \
    .getOrCreate()

# Path to CSV file inside the container (we'll copy to /opt/spark/work-dir/)
csv_path = "file:///opt/spark/work-dir/data.csv"

# Read CSV with header and inferred schema (preserving raw structure)
df_raw = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .csv(csv_path)

# Add ingestion timestamp
df_bronze = df_raw.withColumn("ingestion_time", current_timestamp())

# Define output Delta table path in MinIO (bucket 'ecommerce-bronze')
output_path = "s3a://ecommerce-bronze/delta/bronze/online_retail"

# Write as Delta table with column mapping enabled (supports schema evolution later)
df_bronze.write \
    .format("delta") \
    .mode("overwrite") \
    .option("delta.columnMapping.mode", "name") \
    .save(output_path)

print("Bronze ingestion completed successfully.")
print(f"Data written to: {output_path}")

# Read back and show a sample for verification
df_verify = spark.read.format("delta").load(output_path)
print("Schema of Bronze table:")
df_verify.printSchema()
print("Sample rows (5):")
df_verify.show(5, truncate=False)

spark.stop()