FROM node:22

# OS packages
RUN apt-get update && apt-get install -y \
    yamllint \
    bash \
    build-essential \
    xorg \
    openbox \
    libx11-dev \
    libxtst-dev \
    && rm -rf /var/lib/apt/lists/*

# Node
RUN corepack enable pnpm
RUN npm install -g bun

# App
WORKDIR /app
COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY .npmrc .npmrc
RUN pnpm install --frozen-lockfile
COPY . .

# Boot
ENTRYPOINT ["pnpm"]
CMD ["run", "start"]
