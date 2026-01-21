# Advanced Dockerfile Techniques

## Multi-stage Builds

Multi-stage builds allow you to use multiple `FROM` statements in a single Dockerfile. This is useful for separating the build environment from the runtime environment, resulting in smaller and more efficient images.

```Dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Understanding Multi-Stage Builds Better

In the multi-stage build example above:
- **Build stage**: Everything needed to compile your code (TypeScript, build tools, dev dependencies)
- **Runtime stage**: Only the compiled code and production dependencies

This approach can reduce image size from 500MB+ to 50-100MB depending on your application.

### Benefits of Multi-Stage Builds

1. **Smaller images** - Leave build tools behind in earlier stages
2. **Faster deployments** - Smaller images deploy quicker
3. **Security** - Reduce attack surface by excluding dev dependencies
4. **Cleaner separation** - Build and runtime environments are separate

## Optimizing Docker Image

To optimize your Docker image, consider the following techniques:

### 1. Use a Smaller Base Image

Choose a minimal base image like `alpine` to reduce the overall size of your image.

- `node:18` - ~900MB (full Node.js with all tools)
- `node:18-slim` - ~180MB (minimal Node.js)
- `node:18-alpine` - ~45MB (minimal Alpine Linux with Node.js)

Alpine images are significantly smaller but may have compatibility issues with native modules.

### 2. Minimize Layers

Combine multiple `RUN` commands into a single command to reduce the number of layers in your image.

**Instead of:**
```Dockerfile
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
```

**Use:**
```Dockerfile
RUN apt-get update && apt-get install -y curl git
```

This reduces the number of layers and the overall image size.

### 3. Layer Caching

Static files and dependencies like `package.json`, `package-lock.json` should be copied before the application code to leverage Docker's layer caching. Frequently changing files should be copied later.

This is crucial for development speed - your dependencies won't reinstall every time you change code.

### 4. Remove Unnecessary Files

Use a `.dockerignore` file to exclude files and directories that are not needed in the Docker image:

```
node_modules
dist
.git
.npm
.eslintcache
.env
.env.local
.DS_Store
README.md
COVERAGE
.vscode
.idea
.github
tests
```

This reduces image size and build time.

### 5. Use Multi-Stage Builds

As demonstrated above, multi-stage builds help separate the build environment from the runtime environment, resulting in smaller images. This is especially useful for compiled languages or complex build processes.

## Image Size Optimization Example

**Without optimization:**
```Dockerfile
FROM node
COPY . .
RUN npm install
CMD ["node", "index.js"]
```
Size: ~900MB

**With optimization:**
```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]
```
Size: ~100MB (10x smaller!)

## Advanced Optimization Techniques

### 1. Use npm ci Instead of npm install

`npm ci` (clean install) is faster and more reliable in Docker:
- Installs exact versions from package-lock.json
- Fails if package-lock.json is missing
- Faster than npm install

```Dockerfile
RUN npm ci --only=production
```

### 2. Remove Development Dependencies

For production images, only install production dependencies:

```Dockerfile
RUN npm ci --only=production
```

### 3. Use .dockerignore

Already covered above, but essential for reducing build context size.

### 4. Health Checks

Add health checks to help Docker monitor your containers:

```Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js
```

### 5. Non-Root User

Run your application as a non-root user for security:

```Dockerfile
RUN useradd -m appuser
USER appuser
```

## Checking Image Size

You can check your image size using:
```bash
docker images | grep my-node-app
```

Or use Docker tools to analyze layer sizes:
```bash
docker history my-node-app:latest
```

## Performance vs Size Trade-offs

- **Alpine images**: Smallest but may lack some tools
- **Slim images**: Good balance between size and compatibility
- **Full images**: Largest but most compatible and easiest to debug

Choose based on your requirements.

## Real-World Optimization Example

```Dockerfile
# Multi-stage build optimized for production
FROM node:18 AS builder

WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /build/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /build/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /build/package*.json ./

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/index.js"]
```

By applying these techniques, you can create efficient and optimized Docker images for your Node.js applications. An optimized image means:
- Faster deployments
- Lower storage costs
- Quicker container startup times
- Reduced bandwidth usage
- Better security posture

## Next Steps

Learn about design patterns for containerized applications in [Container Patterns](container-patterns.md).
