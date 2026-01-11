# Dockerized of a simple Node.js Application

This is a simple Node.js application containerized with Docker.

## Prerequisites

- Docker installed on your machine. You can download it from [here](https://www.docker.com/get-started).
- Basic knowledge of Node.js and Docker.

## Docker File for Node.js Application

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

## Conclusion

You have successfully containerized a simple Node.js application using Docker. You can now deploy this containerized application to any environment that supports Docker.

# Caching Layers in Docker

Docker uses a layered filesystem, where each instruction in the Dockerfile creates a new layer. When building an image, Docker caches these layers to speed up subsequent builds. If a layer hasn't changed, Docker reuses the cached version instead of rebuilding it.
To optimize caching, place frequently changing instructions (like copying source code) towards the end of the Dockerfile, and less frequently changing instructions (like installing dependencies) towards the beginning. This way, changes to your application code won't invalidate the cache for the dependency installation layer.

e.g., if you change only the `index.js` file, Docker will reuse the cached layer for `npm install`, speeding up the build process.

# Efficient way of caching layers in Dockerfile

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

dockerignore file
# Create a .dockerignore file to exclude files and directories that are not needed in the Docker image.
node_modules
dist
.git

# Define the command to run the application
CMD ["node", "index.js"]

```

Currently we're copying files in root directory which is not a good practice.
To make it better organize your project structure in containers.For example, you can have a structure
like this:

```
Dockerfile
app/
  ├── index.js
  ├── package.json
  └── package-lock.json
```
In this case we need to give `app/path` evrywhere instead of just. So we can set working directory in dockerfile which simplifies the paths and no need to specify the full path every time.

# Working directory in Dockerfile

You can set a working directory inside the Docker container using the `WORKDIR` instruction in your Dockerfile. This sets the working directory for any subsequent `COPY`, `RUN`, and `CMD` instructions.

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
# Define the command to run the application
CMD ["node", "index.js"]
```

# Publishing the image to Docker Hub

1. Create an account on [Docker Hub](https://hub.docker.com/) if you don't have one.
2. Log in to Docker Hub from your terminal:
   ```bash
   docker login
   ```
3. Tag your Docker image with your Docker Hub username and repository name:

   ```bash
   docker tag my-node-app your-dockerhub-username/my-node-app:latest

   " my-node-app" is the name of your local image.
   "your-dockerhub-username" is your Docker Hub username.
   "my-node-app" is the name of the repository you want to create on Docker Hub.
   "latest" is the tag for the image version.
   ```

4. Push the image to Docker Hub:
   ```bash
   docker push your-dockerhub-username/my-node-app:latest
   ```
   Replace `your-dockerhub-username` with your actual Docker Hub username.
5. Your image is now published on Docker Hub! You can pull it from any machine using:

   ```bash
   docker pull your-dockerhub-username/my-node-app:latest
   ```

6. Run it directly using:
   ```bash
   docker run -it -e PORT=4000 -p 3000:3000 your-dockerhub-username/my-node-app:latest
   ```

# Docker Compose

In real-world applications often consist of multiple services (e.g., a web server, database, cache). Docker Compose is a tool that allows you to define and manage multi-container Docker applications using a yml/yaml file.

Let's assume you have a Node.js application that requires postgres as a database and rds as a cache.

1. Create a `docker-compose.yml` file in your project directory:

   ```yaml
   version: "4.0"
   services:
   postgres:
     image: postgres:15 # Use the official PostgreSQL 15 image from Docker Hub
     container_name: my_postgres # Name of the container
     environment:
       POSTGRES_USER: myuser
       POSTGRES_PASSWORD: mypassword
       POSTGRES_DB: mydatabase
     ports:
       - "5432:5432" # Port mapping
   redis:
     image: redis:7 # Use the official Redis 7 image from Docker Hub
     container_name: my_redis # Name of the container
     ports:
       - "6379:6379" # Port mapping
     command: ["redis-server", "--appendonly", "yes"] # Enable AOF persistence
   ```

2. Start the services using Docker Compose:

   ```bash
   "docker-compose up" (Normally it will run in foreground)
   " docker-compose up -d" (To run in detached mode in background)
   ```

   This will create a stack in docker with two services: `postgres` and `redis`, each running in its own container.

3. To stop the services, run:
   ```bash
   "docker-compose down"
   ```
   This command stops and removes the containers defined in the `docker-compose.yml` file.

## Conclusion

You have successfully set up a multi-container application using Docker Compose. You can now extend this setup by adding more services or linking your Node.js application to these services.

# Docker Networking

Docker provides a built-in networking feature that allows containers to communicate with each other. By default, Docker creates a bridge network for containers to connect to each other.

## Network Types:

1. **Bridge Network:** The default network type for containers. Containers on the same bridge network can communicate with each other using their container names as hostnames.

```bash
docker run -it --network=bridge my-node-app
```

This command runs the `my-node-app` container using the default bridge network.

2. **Host Network:** Containers share the host's network stack. This means that the container's network interfaces are directly mapped to the host's interfaces.(So no port mapping is needed in this case)

```bash
docker run -it --network=host my-node-app
```

This command runs the `my-node-app` container using the host network.

3. **Overlay Network:** Overlay networks in Docker enable **secure, multi-host container communication** with built‑in **service discovery and load balancing** across a Swarm or Kubernetes cluster.

```bash
# Initialize Docker Swarm
docker swarm init

# Create an overlay network
docker network create -d overlay my_overlay_net

# Deploy a service on the overlay network
docker service create --name web --network my_overlay_net nginx
```

- The `nginx` service will be accessible across all nodes in the Swarm cluster.
- Containers/services can join multiple networks if needed.

4. **Macvlan Network:** Macvlan driver assigns a unique MAC address to each container’s virtual interface, making it look like a physical device on the LAN.

```bash
# Create a Macvlan network
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 my_macvlan_net

# Run a container on the Macvlan network
docker run -it --network my_macvlan_net alpine sh
```

5. **None:** Disables all networking for the container.
   Disabling Networking for a Container:
   You can disable networking for a container by using the `none` network driver.

```bash
docker run -it --network=none my-node-app
```

This command runs the `my-node-app` container with networking disabled.

## Creating a Custom Bridge Network:

You can create a custom bridge network to isolate your containers and control their communication.

```bash
docker network create my_custom_network
```

This command creates a new bridge network named `my_custom_network`.
Connecting Containers to the Custom Network:
When running a container, you can specify the network it should connect to using the `--network` flag.

```bash
docker run -it --network=my_custom_network my-node-app
```

This command runs the `my-node-app` container and connects it to the `my_custom_network`.
Inspecting Networks:
You can inspect the details of a network using the `docker network inspect` command.

```bash
docker network inspect my_custom_network
```

This command displays detailed information about the `my_custom_network`, including connected containers and their IP addresses.

## Conclusion

Docker provides a flexible and powerful networking model that lets containers communicate seamlessly, whether on a single host or across multiple nodes. From the simplicity of the bridge network, to the performance of host networking, the scalability of overlay networks, and the LAN integration of macvlan, each driver serves a distinct purpose. By creating custom networks and inspecting them, developers gain fine‑grained control over container connectivity, isolation, and security.

# Volume Mounting in Docker

Whenever we destroy a container all the data inside the container is lost. To persist data beyond the lifecycle of a container, Docker provides a feature called Volumes. Volumes are directories or files that exist outside of the container's filesystem and can be shared between containers.

## Mounting a Volume:

You can mount a volume when running a container using the `-v` or `--mount` flag.

```bash
docker run -it -v /host/path:/container/path my-node-app
```

This command mounts the directory `/host/path` from the host machine to `/container/path` inside the container.

- `/host/path`: The path on the host machine where the data will be stored.
- `/container/path`: The path inside the container where the volume will be mounted.

## Create and manage volumes:

You can create a named volume using the `docker volume create` command.

```bash
docker volume create my_volume
```

This command creates a new volume named `my_volume`.
You can then mount this volume to a container:

```bash
docker run -it -v my_volume:/container/path my-node-app
```

This command mounts the named volume `my_volume` to `/container/path` inside the container.

## Inspecting Volumes:

You can inspect a volume to see its details using the `docker volume inspect` command.

```bash
docker volume inspect my_volume
```

This command displays detailed information about the `my_volume`, including its mount point on the host machine.

## Listing Volumes:

You can list all the volumes on your Docker host using the `docker volume ls` command.

```bash
docker volume ls
```

This command lists all the volumes available on the Docker host.

## Removing Volumes:

You can remove a volume using the `docker volume rm` command.

```bash
docker volume rm my_volume
```

This command removes the volume named `my_volume`. Note that you cannot remove a volume that is currently in use by a container.

## Conclusion

Volumes are a powerful feature in Docker that allows you to persist data beyond the lifecycle of a container. By mounting volumes, you can share data between containers and ensure that important data is not lost when containers are destroyed.


# Advaned Dockerfile Techniques
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

In this example:
- The `builder` stage compiles TypeScript to JavaScript
- The `runtime` stage only copies the compiled `dist` folder, excluding TypeScript source and build tools
- This results in a much smaller final image since TypeScript compiler and dev dependencies are not included