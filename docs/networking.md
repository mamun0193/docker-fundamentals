# Docker Networking

Docker provides a built-in networking feature that allows containers to communicate with each other. By default, Docker creates a bridge network for containers to connect to each other. Understanding Docker networking is crucial for building multi-container applications.

## Why Docker Networking?

Container networking enables:
- **Inter-container communication** - Services can talk to each other
- **Service discovery** - Containers can find each other by name
- **Network isolation** - Applications are isolated from each other
- **Flexible deployment** - Containers can be on the same or different hosts

## Network Types

### 1. Bridge Network

The default network type for containers. Containers on the same bridge network can communicate with each other using their container names as hostnames.

```bash
docker run -it --network=bridge my-node-app
```

This command runs the `my-node-app` container using the default bridge network.

**Bridge Network Characteristics:**
- Default network used by containers
- Containers get their own IP address
- Good for single-host communication
- Port mapping required to access from host
- Automatic DNS resolution between containers

### 2. Host Network

Containers share the host's network stack. This means that the container's network interfaces are directly mapped to the host's interfaces (So no port mapping is needed in this case).

```bash
docker run -it --network=host my-node-app
```

This command runs the `my-node-app` container using the host network.

**Host Network Characteristics:**
- Container uses host's network stack directly
- No port mapping needed
- Lower network latency
- Port conflicts possible (can't run multiple services on same port)
- Use sparingly - reduces container isolation

### 3. Overlay Network

Overlay networks in Docker enable **secure, multi-host container communication** with built-in **service discovery and load balancing** across a Swarm or Kubernetes cluster.

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

### 4. Macvlan Network

Macvlan driver assigns a unique MAC address to each container's virtual interface, making it look like a physical device on the LAN.

```bash
# Create a Macvlan network
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 my_macvlan_net

# Run a container on the Macvlan network
docker run -it --network my_macvlan_net alpine sh
```

### 5. None Network

Disables all networking for the container. You can disable networking for a container by using the `none` network driver.

```bash
docker run -it --network=none my-node-app
```

This command runs the `my-node-app` container with networking disabled. This is useful for containers that don't need network access.

## Creating a Custom Bridge Network

You can create a custom bridge network to isolate your containers and control their communication.

```bash
docker network create my_custom_network
```

This command creates a new bridge network named `my_custom_network`.

### Connecting Containers to the Custom Network

When running a container, you can specify the network it should connect to using the `--network` flag.

```bash
docker run -it --network=my_custom_network my-node-app
```

This command runs the `my-node-app` container and connects it to the `my_custom_network`.

### Inspecting Networks

You can inspect the details of a network using the `docker network inspect` command.

```bash
docker network inspect my_custom_network
```

This command displays detailed information about the `my_custom_network`, including connected containers and their IP addresses.

## Best Practices for Docker Networking

### 1. Use Custom Bridge Networks
- Create custom networks for different applications
- Provides better isolation than the default bridge
- Easier to manage and organize containers

### 2. Service Discovery by Name
- Always use service names for container-to-container communication
- Avoid hardcoding IP addresses (they change)
- Example: database connection string = `postgres:5432` not an IP

### 3. Network Separation
- Frontend containers on one network
- Backend services on another
- Database on its own network
- Reduces attack surface and improves security

### 4. Use Environment Variables
- Pass network information via environment variables
- Makes containers portable and configurable
- Simplifies switching between development and production setups

## Conclusion

Docker provides a flexible and powerful networking model that lets containers communicate seamlessly, whether on a single host or across multiple nodes. From the simplicity of the bridge network, to the performance of host networking, the scalability of overlay networks, and the LAN integration of macvlan, each driver serves a distinct purpose. By creating custom networks and inspecting them, developers gain fine-grained control over container connectivity, isolation, and security.

## Common Networking Scenarios

### Scenario 1: Web Application + Database
```bash
# Create network
docker network create app-network

# Run database
docker run -d --network app-network --name postgres postgres:15

# Run web app (can access postgres via hostname 'postgres')
docker run -d --network app-network --name web -p 3000:3000 my-node-app
```

### Scenario 2: Multiple Applications
```bash
# Create separate networks
docker network create frontend-network
docker network create backend-network

# Run frontend
docker run -d --network frontend-network my-frontend-app

# Run backend
docker run -d --network backend-network my-backend-app
```

## Next Steps

Learn how to persist data beyond container lifecycle in [Volume Mounting](volumes.md).

## Debugging Network Issues

### Check container connectivity
```bash
docker exec -it container_name ping other_container_name
```

### View network interfaces
```bash
docker exec container_name ifconfig
```

### Test port accessibility
```bash
docker exec -it container_name curl http://other_service:port
```

### View network logs
```bash
docker network inspect network_name
```

## Advanced Networking Features

### DNS in Docker
- Container names are automatically resolvable as hostnames
- Use service names in connection strings
- Example: `mongodb://mongo:27017` works automatically in Docker networks

### Network Aliases
Containers can have multiple hostnames on the same network:
```bash
docker run --network=my_network --network-alias=db --network-alias=database postgres
```

## Performance Considerations

- Bridge networks have slight overhead compared to host network
- Host network provides best performance but less isolation
- Overlay networks add complexity for multi-host scenarios
- Use appropriate driver for your use case
