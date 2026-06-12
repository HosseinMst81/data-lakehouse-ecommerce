FROM apache/spark:3.5.0

USER root

# Install wget and Python packages including Jupyter
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Install Jupyter and any other Python libraries you want (e.g., matplotlib, pandas)
RUN pip install --no-cache-dir jupyter matplotlib pandas

# Set Hadoop and AWS SDK versions
ENV HADOOP_AWS_VERSION=3.3.4
ENV AWS_SDK_VERSION=1.12.262

# Download jars into Spark's jars directory
RUN wget -q -P /opt/spark/jars/ \
    https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/${HADOOP_AWS_VERSION}/hadoop-aws-${HADOOP_AWS_VERSION}.jar \
    && wget -q -P /opt/spark/jars/ \
    https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/${AWS_SDK_VERSION}/aws-java-sdk-bundle-${AWS_SDK_VERSION}.jar

# Expose Jupyter port (8888) – optional but good practice
EXPOSE 8888

# Switch back to the default user
USER ${spark_uid}