FROM apache/spark:3.5.0

USER root

# Install wget if not present (the image usually has it)
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Set Hadoop and AWS SDK versions matching Spark’s Hadoop version (Spark 3.5.0 uses Hadoop 3.3.4)
ENV HADOOP_AWS_VERSION=3.3.4
ENV AWS_SDK_VERSION=1.12.262

# Download jars into Spark's jars directory
RUN wget -q -P /opt/spark/jars/ \
    https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/${HADOOP_AWS_VERSION}/hadoop-aws-${HADOOP_AWS_VERSION}.jar \
    && wget -q -P /opt/spark/jars/ \
    https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/${AWS_SDK_VERSION}/aws-java-sdk-bundle-${AWS_SDK_VERSION}.jar

# Switch back to the default user (the image uses 'spark' UID 1001)
USER ${spark_uid}