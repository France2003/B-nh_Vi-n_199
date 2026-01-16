# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install serve to serve the built app or use express
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy server.js and package.json for backend API
COPY server.js .
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Expose ports
# Port 5173 for frontend (served by vite preview or serve)
# Port 3001 for backend API server
EXPOSE 5173 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Default command: run both backend and frontend
CMD ["sh", "-c", "node server.js & serve -s dist -l 5173"]
