FROM node:22-slim

WORKDIR /app

# Upgrade npm
RUN npm install -g npm@latest

# Use a reliable npm registry mirror (Taobao mirror works well from Iran)
RUN npm config set registry https://registry.npmmirror.com

# Copy package manifests
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]