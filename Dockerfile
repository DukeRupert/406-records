# Stage 1: Build Hugo static site
FROM hugomods/hugo:exts AS hugo-builder

WORKDIR /src

# Install Node.js for Tailwind CSS processing
RUN apk add --no-cache nodejs npm

# Copy Hugo files
COPY hugo.toml ./
COPY content/ ./content/
COPY layouts/ ./layouts/
COPY data/ ./data/
COPY assets/ ./assets/
COPY static/ ./static/
COPY package.json tailwind.config.js postcss.config.js ./

# Install npm dependencies and build
RUN npm install
RUN hugo --minify

# Stage 2: Build Go API
FROM golang:1.21-alpine AS go-builder

WORKDIR /app

COPY api/go.mod ./
RUN go mod download

COPY api/main.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /api-server main.go

# Stage 3: Final image with Caddy
FROM caddy:2-alpine

# Install supervisor to run both Caddy and the API
RUN apk add --no-cache supervisor

# Copy Hugo static files
COPY --from=hugo-builder /src/public /srv

# Copy Go API binary
COPY --from=go-builder /api-server /usr/local/bin/api-server

# Copy Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
