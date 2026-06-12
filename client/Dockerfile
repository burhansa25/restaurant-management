FROM node:24-bookworm-slim AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --network-timeout=100000


FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_ENDPOINT
ARG NEXT_PUBLIC_URL
ARG DOCKER_PUBLIC_API_ENDPOINT

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV DOCKER_PUBLIC_API_ENDPOINT=$DOCKER_PUBLIC_API_ENDPOINT

RUN npm run build


FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["npm", "run", "start"]
