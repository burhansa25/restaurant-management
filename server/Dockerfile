FROM node:24-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

FROM node:24-bookworm-slim AS builder

WORKDIR /app

ARG DATABASE_URL=file:./dev.db
ENV DATABASE_URL=$DATABASE_URL

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build

RUN npm prune --omit=dev && npm cache clean --force

FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV DOCKER_HOST=0.0.0.0
ENV PORT=4000
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start"]
