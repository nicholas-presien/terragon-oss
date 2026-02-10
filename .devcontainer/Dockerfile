FROM mcr.microsoft.com/devcontainers/typescript-node:20-bookworm

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        redis-tools \
        vim \
        nano \
        net-tools \
        openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Switch to node user for tool installations
USER node

# Install exact pnpm version (10.14.0) - critical requirement
RUN npm install -g pnpm@10.14.0

# Install ngrok (required for development tunnel)
RUN curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
    | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
    && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
    | sudo tee /etc/apt/sources.list.d/ngrok.list \
    && sudo apt-get update \
    && sudo apt-get install -y ngrok \
    && sudo apt-get clean \
    && sudo rm -rf /var/lib/apt/lists/*

# Install GitHub CLI (gh)
RUN type -p curl >/dev/null || (sudo apt update && sudo apt install curl -y) \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && sudo apt update \
    && sudo apt install gh -y \
    && sudo apt-get clean \
    && sudo rm -rf /var/lib/apt/lists/*

# Configure pnpm store directory and ensure it exists with correct ownership
RUN mkdir -p /home/node/.local/share/pnpm/store \
    && pnpm config set store-dir /home/node/.local/share/pnpm/store

# Create workspace directory and node_modules with correct ownership
# node_modules is a Docker volume mount - pre-creating ensures node user owns it
RUN mkdir -p /home/node/workspace/node_modules \
    && chown -R node:node /home/node/workspace
WORKDIR /home/node/workspace

# Default command
CMD ["/bin/bash"]
