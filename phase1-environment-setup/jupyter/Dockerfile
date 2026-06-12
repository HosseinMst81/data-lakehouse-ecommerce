# phase1-environment-setup/jupyter/Dockerfile
FROM phase1-environment-setup-spark-master:latest

USER root

# Install Jupyter and additional visualization libraries
RUN pip install --no-cache-dir jupyter matplotlib pandas

EXPOSE 8888

# Switch back to the default user
USER ${spark_uid}