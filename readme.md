# Dockerized Node.js Application

This is a simple Node.js application containerized with Docker.

## Documentation

The documentation has been organized into separate guides for better readability. Visit the [docs folder](docs/README.md) for complete documentation.

### Quick Links

- [Getting Started](docs/getting-started.md) - Prerequisites and basic setup
- [Dockerfile Basics](docs/dockerfile-basics.md) - Creating your first Dockerfile
- [Dockerfile Optimization](docs/dockerfile-optimization.md) - Caching, working directories, and best practices
- [Publishing to Docker Hub](docs/docker-hub.md) - Sharing your images
- [Docker Compose](docs/docker-compose.md) - Multi-container applications
- [Docker Networking](docs/networking.md) - Container communication
- [Volume Mounting](docs/volumes.md) - Data persistence
- [Advanced Dockerfile Techniques](docs/advanced-dockerfile.md) - Multi-stage builds and optimization
- [Container Patterns](docs/container-patterns.md) - Design patterns for containerized applications

## Quick Start

1. Create a new directory for your project and navigate into it:
   ```bash
   mkdir my-node-app
   cd my-node-app
   ```
2. Initialize a new Node.js application:
   ```bash
    npm init -y
   ```
3. Create an `index.js` file with a simple Express server:
   ```javascript
   const express = require("express");
   const app = express();
   const PORT = process.env.PORT || 3000;
   app.get("/", (req, res) => {
     res.send("Hello, World!");
   });
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
   ```
4. Install Express:
   ```bash
    npm install express
   ```
5. Create a `Dockerfile` in the root of your project directory:

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

6. Build the Docker image:
   ```bash
    docker build -t my-node-app .
   ```

```bash
"-t `my-node-app`"
tags the Docker image with the name "my-node-app".(You can change the name as needed)
"."
specifies the build context, which is the current directory in this case.
```

7. Run the Docker container:

   ```bash
   docker run -it -e PORT=4000 -p 3000:3000 my-node-app
   ```

```bash
"-it"
runs the container in interactive mode with a terminal attached.
```

```bash
"-p 3000:3000"
maps port 3000 of the container to port 3000 on your host machine.(You can change the host port if needed keep in 1st one is for local machine and 2nd one is for container)
```

```bash
"-e PORT=4000"
#sets the PORT environment variable inside the container to 4000.(You can change the port number as needed)

#You can also use multiple environment variables by adding more -e flags.
```

8. Open your browser and navigate to `http://localhost:3000` (or the port you specified) to see the application running.

## Learn More

For detailed information on Docker concepts and advanced techniques, check out the [complete documentation](docs/README.md).
