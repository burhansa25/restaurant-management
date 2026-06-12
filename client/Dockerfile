FROM node:24-bookworm-slim AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --network-timeout=100000


FROM node:24-bookworm-slim AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_ENDPOINT
ARG NEXT_PUBLIC_URL
ARG DOCKER_PUBLIC_API_ENDPOINT

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV DOCKER_PUBLIC_API_ENDPOINT=$DOCKER_PUBLIC_API_ENDPOINT

COPY package*.json ./
COPY . .
RUN npm ci && npm run build


FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN npm ci --omit=dev --network-timeout=100000

EXPOSE 3000

CMD ["npm", "run", "start"]
