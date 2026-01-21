# Dockerfile Basics

## Understanding Dockerfiles

A Dockerfile is a text file that contains a set of instructions to build a Docker image. Each instruction in a Dockerfile creates a new layer in the image. Docker reads the Dockerfile and executes the instructions in sequence to create the final image.

## Creating Your First Dockerfile

Create a `Dockerfile` in the root of your project directory (note: no file extension):

```Dockerfile
# Use a base image (In my case I used ubuntu then go through the steps to install nodejs and npm)
You can use the official Node.js image as well:
FROM node

#Copy the index.json package.json and package-lock.json files to the container(Use same directory structure and name as in your local machine)

COPY index.js index.js
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install the dependencies
RUN npm install

# Define the command to run the application
CMD ["node", "index.js"]
```

## Dockerfile Instructions Explained

- **FROM node**: Specifies the base image to use. This pulls the official Node.js image from Docker Hub. This is the starting point for your image.
- **COPY**: Copies files from your local machine to the container. The first argument is the source path on your host machine, and the second is the destination path in the container.
- **RUN npm install**: Executes the npm install command inside the container to install dependencies listed in package.json
- **CMD [\"node\", \"index.js\"]**: Specifies the default command to run when the container starts

## Building the Docker Image

Build the Docker image using the docker build command:
```bash
docker build -t my-node-app .
```

### Understanding Build Flags

```bash
"-t `my-node-app`"
tags the Docker image with the name "my-node-app".(You can change the name as needed)
"."
specifies the build context, which is the current directory in this case.
```

The build process will:
1. Read the Dockerfile
2. Download the base image (if not already present)
3. Execute each instruction in sequence
4. Create layers for each step
5. Tag the final image with the name you specified

## Verifying Your Image

After building, you can verify the image was created:
```bash
docker images
```

You should see your \"my-node-app\" image listed with its size and creation date.

## Running the Docker Container

Run the Docker container:

```bash
docker run -it -e PORT=4000 -p 3000:3000 my-node-app
```

### Understanding Run Flags

```bash
"-it"
runs the container in interactive mode with a terminal attached.
```

The `-i` flag keeps STDIN open even if not attached, and the `-t` flag allocates a pseudo-terminal.

```bash
"-p 3000:3000"
maps port 3000 of the container to port 3000 on your host machine.(You can change the host port if needed keep in 1st one is for local machine and 2nd one is for container)
```

Port mapping allows you to access the application running inside the container from your host machine.

```bash
"-e PORT=4000"
#sets the PORT environment variable inside the container to 4000.(You can change the port number as needed)

#You can also use multiple environment variables by adding more -e flags.
```

### Accessing Your Application

Open your browser and navigate to `http://localhost:3000` (or the port you specified) to see the application running. You should see \"Hello, World!\" displayed in your browser.

### Container Information

To see running containers in another terminal:
```bash
docker ps
```

To stop a running container:
```bash
docker stop <container-id>
```

## Conclusion

You have successfully containerized a simple Node.js application using Docker. Your application is now isolated in a container with all its dependencies, making it reproducible and deployable across different environments. You can now deploy this containerized application to any environment that supports Docker.

## Common Issues and Solutions

### Issue: Image size too large
**Solution**: Use Alpine Linux base image or multi-stage builds to reduce size

### Issue: Can't access the application from browser
**Solution**: Make sure you're using the `-p` flag to map ports: `docker run -p 3000:3000 my-node-app`

### Issue: Container exits immediately
**Solution**: Check logs with `docker logs <container-id>` to see what went wrong

### Issue: Port already in use
**Solution**: Map to a different host port: `docker run -p 3001:3000 my-node-app`

## Best Practices for Dockerfiles

1. **Use specific base image versions** - Never use `latest` tag in production
2. **Keep images small** - Remove unnecessary files and dependencies
3. **Use .dockerignore** - Exclude unnecessary files from build context
4. **Use multi-stage builds** - For production-ready images
5. **Document with comments** - Make your Dockerfile understandable
6. **Run as non-root user** - For security

## Next Steps

Learn how to optimize your Dockerfile for better performance and smaller image sizes in [Dockerfile Optimization](dockerfile-optimization.md).
