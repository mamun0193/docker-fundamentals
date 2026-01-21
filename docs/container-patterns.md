# Container Patterns

Container patterns are best practices and design patterns for building and deploying containerized applications. These patterns help you structure applications for scalability, maintainability, and reliability.

## Why Container Patterns?

Container patterns provide:
- **Separation of concerns** - Each container has a single responsibility
- **Reusability** - Patterns can be applied to different applications
- **Scalability** - Easier to scale individual components
- **Maintainability** - Clear structure and responsibilities
- **Flexibility** - Mix and match patterns as needed

## Common Container Patterns

### 1. Sidecar Pattern

In this pattern, a secondary container (sidecar) runs alongside the main application container to provide additional functionality, such as logging, monitoring, or proxying.

**Use Cases:**
- Centralized logging (logging agent container)
- Monitoring and metrics collection
- Security proxies
- Configuration management
- SSL/TLS termination

**Example: Logging Sidecar**
```yaml
services:
  app:
    image: my-app:latest
    volumes:
      - shared_logs:/var/log/app
  
  logging-agent:
    image: filebeat:latest
    volumes:
      - shared_logs:/var/log/app:ro
    depends_on:
      - app
```

**Benefits:**
- Main application code remains clean
- Logging logic is separated and reusable
- Can be upgraded independently

### 2. Ambassador Pattern

An ambassador container acts as a proxy for the main application container, handling communication with external services (microservices) or other containers.

**Use Cases:**
- Service discovery
- Load balancing
- Connection pooling
- Protocol translation
- API gateway functionality

**Example: Redis Ambassador**
```yaml
services:
  app:
    image: my-app:latest
    environment:
      REDIS_HOST: redis-ambassador
      REDIS_PORT: 6379
    depends_on:
      - redis-ambassador
  
  redis-ambassador:
    image: redis:7
```

**Benefits:**
- Decouples application from external services
- Centralizes connection management
- Easy to replace external services

### 3. Adapter Pattern

An adapter container is used to transform data or requests between the main application container and external services. This is useful when integrating legacy systems or services with different protocols.

**Use Cases:**
- Protocol translation
- Data format conversion
- Legacy system integration
- API compatibility layer

**Example: Protocol Adapter**
```
For instance, we have a legacy application that communicates using a specific protocol, 
and we want to integrate it with a modern service that uses a different protocol. 
We can create an adapter container that translates requests and responses between 
the two protocols.
```

**Benefits:**
- Enables integration without modifying legacy code
- Isolates compatibility logic
- Makes systems easier to migrate

### 4. Work Queue Pattern

In this pattern, a queue is used to distribute tasks among multiple worker containers. This is useful for processing background jobs or handling asynchronous tasks.

**Use Cases:**
- Background job processing
- Image resizing
- Email sending
- Report generation
- Data processing pipelines

**Example Architecture:**
```
Producer → Queue (RabbitMQ/Redis) → Workers (multiple containers)
```

**Implementation with Docker Compose:**
```yaml
services:
  queue:
    image: redis:7
  
  worker1:
    image: my-worker:latest
    depends_on:
      - queue
  
  worker2:
    image: my-worker:latest
    depends_on:
      - queue
  
  worker3:
    image: my-worker:latest
    depends_on:
      - queue
```

**Benefits:**
- Decouples producers from consumers
- Easy to scale workers
- Resilient to failures
- Better resource utilization

### 5. Init Pattern

In this pattern, an init container is used to perform initialization tasks and exit before the main application container starts. This can include tasks like database migrations, configuration setup, or data seeding.

**Use Cases:**
- Database migrations
- Database schema initialization
- Configuration setup
- Data seeding
- Dependency checking
- Secret preparation

**Example with Docker Compose:**
```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
  
  db-init:
    image: db-migrator:latest
    depends_on:
      - db
    command: npm run migrate
  
  app:
    image: my-app:latest
    depends_on:
      - db-init
```

**Key Difference from Sidecar:**
```
In sidecar pattern: Secondary container runs alongside the main application container 
while in init pattern: Init container runs first to perform initialization tasks and 
exits before the main application container starts.
```

**Benefits:**
- Ensures application state is ready before starting
- Separates setup concerns from application code
- Prevents race conditions
- Reusable across multiple environments

## Pattern Comparison Table

| Pattern | Purpose | Lifetime | When to Use |
|---------|---------|----------|-------------|
| Sidecar | Additional functionality | Runs with main | Logging, monitoring |
| Ambassador | External communication | Runs with main | Service proxying |
| Adapter | Data translation | Runs with main | Legacy integration |
| Work Queue | Task distribution | Runs continuously | Background jobs |
| Init | Setup and preparation | Runs once, exits | Initialization |

## Combining Patterns

You can combine multiple patterns in a single application:

```yaml
services:
  app:
    image: my-app:latest
  
  logging-sidecar:
    image: filebeat:latest  # Sidecar pattern
  
  redis-ambassador:
    image: redis:latest     # Ambassador pattern
  
  worker:
    image: my-worker:latest # Work queue consumer
  
  db-init:
    image: db-init:latest   # Init pattern
```

## Best Practices

1. **Single Responsibility**: Each container should have one clear purpose
2. **Loose Coupling**: Containers should be independent and loosely coupled
3. **High Cohesion**: Related functionality should be together
4. **Reusability**: Design patterns to be reused across projects
5. **Documentation**: Document the purpose and interaction of each container

## When to Use Which Pattern

- **Need background processing?** → Work Queue Pattern
- **Need logging/monitoring?** → Sidecar Pattern
- **Need external service communication?** → Ambassador Pattern
- **Need to integrate legacy systems?** → Adapter Pattern
- **Need to prepare the environment?** → Init Pattern

## Real-World Application Example

Here's a complex application using multiple patterns:

```yaml
version: '3.8'

services:
  # Main web application
  web:
    image: my-web-app:latest
    ports:
      - "3000:3000"
    volumes:
      - shared_logs:/var/log/app

  # Sidecar: Log aggregation
  logger:
    image: filebeat:latest
    volumes:
      - shared_logs:/var/log/app:ro
    depends_on:
      - web

  # Ambassador: Database proxy
  db-proxy:
    image: db-proxy:latest
    environment:
      DB_HOST: postgres:5432
    depends_on:
      - postgres

  # Init: Database setup
  db-init:
    image: db-migrator:latest
    depends_on:
      - postgres
    command: npm run migrate

  # Main application database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret

  # Worker: Background jobs
  worker:
    image: my-worker:latest
    depends_on:
      - redis
      - db-init

  # Queue: Redis for task distribution
  redis:
    image: redis:7

  # Adapter: API compatibility layer
  api-adapter:
    image: legacy-api-adapter:latest
    depends_on:
      - web
```

## Conclusion

By using these container patterns, you can build more modular, scalable, and maintainable containerized applications. Understanding when and how to apply these patterns is key to designing robust distributed systems.

The more you practice with these patterns, the more naturally they'll come to you when designing new applications.
