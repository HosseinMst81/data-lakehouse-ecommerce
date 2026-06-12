"""
Phase 3: Data Quality Analysis
Analyzes the Bronze layer data to identify anomalies before cleaning in Silver.
"""
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, countDistinct, sum as spark_sum, when, isnan, isnull, lit, length

spark = SparkSession.builder \
    .appName("DataQualityAnalysis") \
    .getOrCreate()

# Read Bronze Delta table from MinIO
bronze_path = "s3a://ecommerce-bronze/delta/bronze/online_retail"
df = spark.read.format("delta").load(bronze_path)

total_rows = df.count()
print(f"{'='*60}")
print(f"DATA QUALITY REPORT - E-Commerce Dataset")
print(f"{'='*60}")
print(f"Total records in Bronze layer: {total_rows:,}")
print()

# ------------------------------------------------------------
# 1. NULL Analysis
# ------------------------------------------------------------
print("1. NULL VALUES ANALYSIS")
print("-" * 40)

# CustomerID nulls
null_customer = df.filter(col("CustomerID").isNull()).count()
null_customer_pct = (null_customer / total_rows) * 100
print(f"  CustomerID NULL: {null_customer:,} records ({null_customer_pct:.2f}%)")

# Description nulls/empty
null_desc = df.filter(col("Description").isNull() | (col("Description") == "")).count()
null_desc_pct = (null_desc / total_rows) * 100
print(f"  Description NULL/Empty: {null_desc:,} records ({null_desc_pct:.2f}%)")

# Check all columns for nulls
print("  Null counts per column:")
for column in df.columns:
    null_count = df.filter(col(column).isNull()).count()
    if null_count > 0:
        print(f"    - {column}: {null_count:,} nulls")

print()

# ------------------------------------------------------------
# 2. Negative Quantity Analysis
# ------------------------------------------------------------
print("2. QUANTITY ANALYSIS")
print("-" * 40)

neg_qty = df.filter(col("Quantity") < 0)
neg_qty_count = neg_qty.count()
neg_qty_pct = (neg_qty_count / total_rows) * 100
print(f"  Negative Quantity: {neg_qty_count:,} records ({neg_qty_pct:.2f}%)")

# Distinguish: cancellations (InvoiceNo starts with 'C' or 'c')
cancel_neg = neg_qty.filter(col("InvoiceNo").rlike("^[Cc]")).count()
return_neg = neg_qty_count - cancel_neg
print(f"    - Linked to Cancellation Invoice (C-code): {cancel_neg:,}")
print(f"    - Possible Returns (non C-code): {return_neg:,}")

# Zero quantity?
zero_qty = df.filter(col("Quantity") == 0).count()
print(f"  Zero Quantity: {zero_qty:,} records")

print()

# ------------------------------------------------------------
# 3. UnitPrice Analysis
# ------------------------------------------------------------
print("3. UNIT PRICE ANALYSIS")
print("-" * 40)

zero_price = df.filter(col("UnitPrice") == 0).count()
neg_price = df.filter(col("UnitPrice") < 0).count()
print(f"  UnitPrice = 0: {zero_price:,} records")
print(f"  UnitPrice < 0: {neg_price:,} records")
print(f"  UnitPrice > 0: {total_rows - zero_price - neg_price:,} records")

# Price statistics
df.select("UnitPrice").describe().show()
print()

# ------------------------------------------------------------
# 4. Duplicate Analysis
# ------------------------------------------------------------
print("4. DUPLICATE ANALYSIS")
print("-" * 40)

# Exact duplicates
exact_dup = df.count() - df.distinct().count()
print(f"  Exact duplicate rows: {exact_dup:,}")

# Duplicates by all columns except ingestion_time
cols_without_time = [c for c in df.columns if c != "ingestion_time"]
logical_dup = df.count() - df.select(cols_without_time).distinct().count()
print(f"  Logical duplicates (excluding ingestion_time): {logical_dup:,}")

print()

# ------------------------------------------------------------
# 5. StockCode Analysis
# ------------------------------------------------------------
print("5. STOCKCODE ANALYSIS")
print("-" * 40)

total_unique_stock = df.select("StockCode").distinct().count()
print(f"  Unique StockCode values: {total_unique_stock:,}")

# Non-numeric StockCodes (special codes like POST, DOT, M, etc.)
non_numeric = df.filter(~col("StockCode").rlike("^[0-9]+$"))
non_numeric_count = non_numeric.count()
print(f"  Non-numeric StockCode (POST, DOT, etc.): {non_numeric_count:,} records")

if non_numeric_count > 0:
    print("  Examples of non-numeric StockCodes:")
    non_numeric.select("StockCode", "Description").distinct().show(10, truncate=False)

print()

# ------------------------------------------------------------
# 6. InvoiceNo Pattern Analysis
# ------------------------------------------------------------
print("6. INVOICENO ANALYSIS")
print("-" * 40)

# Cancellation invoices (starting with C)
cancel_invoices = df.filter(col("InvoiceNo").rlike("^[Cc]"))
cancel_count = cancel_invoices.count()
cancel_pct = (cancel_count / total_rows) * 100
print(f"  Cancellation invoices (C-code): {cancel_count:,} records ({cancel_pct:.2f}%)")

print()

# ------------------------------------------------------------
# 7. Summary & Recommendations
# ------------------------------------------------------------
print("7. SUMMARY & RECOMMENDATIONS FOR SILVER LAYER")
print("-" * 40)

issues = []
if null_customer_pct > 1:
    issues.append(f"- {null_customer_pct:.1f}% of records lack CustomerID → isolate, don't drop blindly.")
if cancel_neg > 0:
    issues.append(f"- {cancel_neg:,} negative quantities linked to cancellations → flag, separate from returns.")
if return_neg > 0:
    issues.append(f"- {return_neg:,} negative quantities NOT linked to C-code → investigate as possible returns/bad data.")
if zero_price > 0:
    issues.append(f"- {zero_price:,} records with zero price → likely samples/gifts, flag for review.")
if exact_dup > 0:
    issues.append(f"- {exact_dup:,} exact duplicates found → deduplicate in Silver.")
if non_numeric_count > 0:
    issues.append(f"- {non_numeric_count:,} records with non-standard StockCode → separate from product analysis.")

for issue in issues:
    print(issue)

print()
print("="*60)
print("End of Data Quality Report. Ready for Silver Layer processing.")
print("="*60)

spark.stop()