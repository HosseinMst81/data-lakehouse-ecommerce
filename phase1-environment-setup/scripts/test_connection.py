"""
Test script to verify Spark ↔ MinIO connectivity.
Writes a sample DataFrame as Parquet to MinIO and reads it back.
"""
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, IntegerType, StringType

# Create Spark session – configurations are inherited from spark-defaults.conf
spark = SparkSession.builder \
    .appName("MinIOConnectionTest") \
    .getOrCreate()

# Define a simple schema and data
schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("name", StringType(), True)
])
data = [(1, "Ali"), (2, "Sara"), (3, "Reza")]
df = spark.createDataFrame(data, schema)

# Write to MinIO (bucket named 'test-bucket')
output_path = "s3a://test-bucket/output/parquet/test_data"
df.write.mode("overwrite").parquet(output_path)
print("Data written successfully to MinIO.")

# Read it back
df_read = spark.read.parquet(output_path)
df_read.show()
print("Data read back successfully from MinIO.")

# Stop the session
spark.stop()