FROM node:16.19.0-alpine AS nodemodule
WORKDIR /app
COPY package.json ./
RUN npm install

FROM nodemodule AS builder
COPY . .
RUN npm run build

FROM nodemodule AS runner
# Setup timezone
RUN apk add --no-cache alpine-conf && \
    setup-timezone -z Asia/Bangkok
# Copy build
COPY package.json ./package.json
COPY ecdsa.key ./keys/ecdsa.key
COPY ecdsa.pub ./keys/ecdsa.pub
COPY .env ./.env
COPY run-container.sh ./run-container.sh
COPY --from=builder /app/dist ./

EXPOSE 3000

CMD ["/bin/sh", "run-container.sh"]
