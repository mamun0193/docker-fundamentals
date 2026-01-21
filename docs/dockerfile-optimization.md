# Dockerfile Optimization

## Understanding Docker Layers

Docker uses a layered filesystem, where each instruction in the Dockerfile creates a new layer. When building an image, Docker caches these layers to speed up subsequent builds. If a layer hasn't changed, Docker reuses the cached version instead of rebuilding it.

To optimize caching, place frequently changing instructions (like copying source code) towards the end of the Dockerfile, and less frequently changing instructions (like installing dependencies) towards the beginning. This way, changes to your application code won't invalidate the cache for the dependency installation layer.

e.g., if you change only the `index.js` file, Docker will reuse the cached layer for `npm install`, speeding up the build process. This can significantly reduce build times for frequently changed applications.

## Layer Caching Strategy

### How Docker Cache Works
1. Docker looks at the instruction and the files it references
2. If it finds an existing layer with the same instruction and files, it uses the cached layer
3. If anything changes, the cache is invalidated for that layer and all subsequent layers
4. This is why layer ordering matters - you want changes to happen as late as possible

## Efficient Way of Caching Layers in Dockerfile

To further optimize caching in your Dockerfile, you can copy only the files necessary for installing dependencies before copying the rest of your application code. This way, changes to your application code won't invalidate the cache for the dependency installation layer.

```Dockerfile
# Use a base image
FROM node
# Copy only package.json and package-lock.json to leverage caching
COPY package.json package-lock.json ./
# Install the dependencies
RUN npm install
# Copy the rest of the application code
COPY . .

# Create a .dockerignore file to exclude files and directories that are not needed in the Docker image.
# .dockerignore:
node_modules
dist
.git
.npm
.eslintcache

# Define the command to run the application
CMD ["node", "index.js"]
```

By copying package files first and installing dependencies before copying application code, you ensure that:
- Changes to `index.js` don't trigger a full npm install
- Dependency installation is cached and reused when only code changes
- Build times are dramatically reduced for rapid development cycles

## Using .dockerignore File

The `.dockerignore` file works similarly to `.gitignore`. It tells Docker which files and directories to exclude when building the image.

```
node_modules
dist
.git
.npm
.eslintcache
.env.local
.DS_Store
COVERAGE
README.md
```

This reduces image size and build time by not copying unnecessary files into the container.

## Project Structure Organization

Currently we're copying files in root directory which is not a good practice. To make it better, organize your project structure in containers. For example, you can have a structure like this:

```
Dockerfile
app/
  ├── index.js
  ├── package.json
  └── package-lock.json
.dockerignore
```

In this case we need to give `app/path` everywhere instead of just `.`. So we can set working directory in dockerfile which simplifies the paths and no need to specify the full path every time.

## Working Directory in Dockerfile

You can set a working directory inside the Docker container using the `WORKDIR` instruction in your Dockerfile. This sets the working directory for any subsequent `COPY`, `RUN`, `CMD`, `ENTRYPOINT`, and `ENV` instructions.

```Dockerfile
# Use a base image
FROM node
# Set the working directory inside the container
WORKDIR /app
# Copy only package.json and package-lock.json to leverage caching
COPY package.json package-lock.json ./
# Install the dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Expose the port (informational)
EXPOSE 3000
# Define the command to run the application
CMD ["node", "index.js"]
```

### Benefits of WORKDIR

1. **Cleaner Dockerfile**: No need to specify full paths in `COPY` and `RUN` commands
2. **Consistent structure**: All container paths are relative to the working directory
3. **Better organization**: Container filesystem is organized logically
4. **Easier maintenance**: Changes to directory structure only need to happen in one place

## EXPOSE Instruction

The `EXPOSE` instruction documents which ports the container listens on. It doesn't actually publish the port - you still need to use `-p` when running the container. It serves as documentation and helps others understand what ports your application uses.

## Next Steps

Now that you know how to optimize your Dockerfile for faster builds and smaller images, learn how to share your images in [Publishing to Docker Hub](docker-hub.md).

## Quick Reference Checklist

### Build Time Optimization
- [ ] Copy package.json before source code
- [ ] Use .dockerignore to exclude files
- [ ] Combine RUN commands where possible
- [ ] Use npm ci instead of npm install
- [ ] Cache node_modules by layer ordering

### Image Size Optimization
- [ ] Use smallest appropriate base image (alpine, slim)
- [ ] Remove unnecessary files
- [ ] Use multi-stage builds
- [ ] Remove dev dependencies from production image
- [ ] Delete package manager cache

### Security & Maintenance
- [ ] Use specific versions (not latest)
- [ ] Run as non-root user
- [ ] Scan for vulnerabilities
- [ ] Keep base images updated
- [ ] Use HEALTHCHECK
