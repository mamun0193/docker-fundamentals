# Docker Compose

In real-world applications, you often need multiple services working together (e.g., a web server, database, cache, message queue). Docker Compose is a tool that allows you to define and manage multi-container Docker applications using a yml/yaml file.

With Docker Compose, you can:
- Define multiple services in a single file
- Start all services with one command
- Manage networking between services
- Set environment variables and configurations
- Handle service dependencies
- Scale services up and down

## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML file (docker-compose.yml) to configure your application's services. You can then start all your services with a single command.

## Basic Concepts

- **Service**: A container running a specific application or tool (web server, database, cache, etc.)
- **Compose File**: A YAML file defining the services, networks, volumes, and other configurations
- **Network**: Services in the same Compose file can communicate with each other by service name
- **Volume**: Persistent storage for data that survives container restart

## Creating a Docker Compose File

Create a `docker-compose.yml` file in your project directory:

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15
    container_name: my_postgres
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydatabase
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7
    container_name: my_redis
    ports:
      - "6379:6379"
    command: ["redis-server", "--appendonly", "yes"]
  
  web:
    build: .
    container_name: my_node_app
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://myuser:mypassword@postgres:5432/mydatabase
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app

volumes:
  postgres_data:
```

## Understanding the Compose File

- **version**: Compose file version (3.8+ is recommended for modern Docker)
- **services**: List of all services that make up your application
- **image**: Which Docker image to use for the service
- **container_name**: Name for the container (optional, but helpful for identification)
- **environment**: Environment variables to pass to the service
- **ports**: Port mapping from container to host
- **volumes**: Persistent storage and file mounts
- **depends_on**: Define service startup order and dependencies
- **volumes** (top level): Define named volumes that can be reused across services

## Service Communication

Services in the same Compose file can communicate with each other using the service name as the hostname:
- From `web` service to `postgres`: `postgres:5432`
- From `web` service to `redis`: `redis:6379`

This networking is automatic and doesn't require any additional configuration.

## Running Docker Compose

### Starting Services

Start the services using Docker Compose:

```bash
docker-compose up
```

This runs in foreground mode and shows you the logs from all services. This is useful for development.

To run in detached mode (background):
```bash
docker-compose up -d
```

With the `-d` flag, Docker Compose starts the services in the background and you get control of your terminal back.

### Viewing Logs

To view logs from running services:
```bash
docker-compose logs
```

To follow logs in real-time:
```bash
docker-compose logs -f
```

To view logs from a specific service:
```bash
docker-compose logs postgres
```

### Managing Services

To check running services:
```bash
docker-compose ps
```

To stop services (keeps data in volumes):
```bash
docker-compose stop
```

To start stopped services:
```bash
docker-compose start
```

To restart services:
```bash
docker-compose restart
```

### Cleaning Up

To stop and remove all containers:
```bash
docker-compose down
```

This command stops and removes the containers defined in the `docker-compose.yml` file. Volumes are preserved by default.

To also remove volumes:
```bash
docker-compose down -v
```

To remove everything including images:
```bash
docker-compose down -v --rmi all
```

## Useful Compose Commands

- `docker-compose build` - Build or rebuild services
- `docker-compose pull` - Pull service images
- `docker-compose exec <service> <command>` - Run a command in a running service
- `docker-compose rm` - Remove stopped containers
- `docker-compose config` - Validate and display the Compose file

## Environment Variables in Compose

You can use `.env` files to manage environment variables:

```
# .env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
DATABASE_NAME=mydatabase
NODE_ENV=development
```

Then reference them in your compose file:
```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

## Conclusion

You have successfully set up a multi-container application using Docker Compose. Your services can now communicate with each other seamlessly. You can extend this setup by adding more services or linking your Node.js application to these services. This approach makes it easy to reproduce your entire development environment locally.

## Next Steps

Understand how containers communicate with each other in detail in [Docker Networking](networking.md).
