FROM oven/bun:1.3

WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production
COPY . .

EXPOSE 8001
CMD ["bun", "src/index.ts"]
