# Publishing the image to Docker Hub

Docker Hub is a cloud-based repository where you can share Docker images publicly or privately. Publishing your images to Docker Hub makes them accessible from any machine and allows others to use your images.

## What is Docker Hub?

Docker Hub is Docker's official registry for container images. It hosts hundreds of thousands of images, both official (maintained by Docker and software vendors) and community images. You can:
- Share images publicly for open-source projects
- Store images privately for your own use
- Automate builds from GitHub repositories
- Manage organizations and teams
- Implement access controls

## Prerequisites for Publishing

Before you can publish images to Docker Hub, you need:
1. A Docker Hub account (free tier available)
2. Docker installed and running on your machine
3. A Docker image built and ready to push

## Step-by-Step Guide

### Step 1: Create a Docker Hub Account

Create an account on [Docker Hub](https://hub.docker.com/) if you don't have one.
- Visit the website
- Click on "Sign Up"
- Fill in your details
- Verify your email address

### Step 2: Log In to Docker Hub from Your Terminal

Authenticate your local Docker installation with Docker Hub:
```bash
docker login
```

You'll be prompted to enter your Docker Hub username and password. After successful authentication, Docker will store your credentials (usually in `~/.docker/config.json`).

### Step 3: Tag Your Docker Image

Tag your Docker image with your Docker Hub username and repository name:

```bash
docker tag my-node-app your-dockerhub-username/my-node-app:latest
```

### Understanding Image Tags

```bash
" my-node-app" is the name of your local image.
"your-dockerhub-username" is your Docker Hub username. This must match your Docker Hub account name.
"my-node-app" is the name of the repository you want to create on Docker Hub.
"latest" is the tag for the image version. You can use version numbers like v1.0.0 or v2.1.0
```

### Tagging Best Practices

- Always tag with specific versions: `v1.0.0`, `v1.0.1`, not just `latest`
- Use `latest` as an alias to the most recent stable version
- Include meaningful tags like `stable`, `dev`, `production`

Example:
```bash
docker tag my-node-app your-dockerhub-username/my-node-app:v1.0.0
docker tag my-node-app your-dockerhub-username/my-node-app:latest
```

### Step 4: Push the Image to Docker Hub

Push your tagged image to Docker Hub:
```bash
docker push your-dockerhub-username/my-node-app:latest
```

Replace `your-dockerhub-username` with your actual Docker Hub username. Docker will upload your image layers to Docker Hub. This may take a few minutes depending on your internet connection and image size.

You can also push multiple tags:
```bash
docker push your-dockerhub-username/my-node-app:v1.0.0
docker push your-dockerhub-username/my-node-app:latest
```

### Step 5: Verify Your Image on Docker Hub

Visit your Docker Hub profile to see your published image. Navigate to [Docker Hub](https://hub.docker.com/) and look in your repositories section. Your image should be listed there with all its tags.

## Pulling and Running Published Images

### Step 6: Pull the Image from Docker Hub

Your image is now published on Docker Hub! You can pull it from any machine using:

```bash
docker pull your-dockerhub-username/my-node-app:latest
```

If the image already exists locally, this command will update it to the latest version from Docker Hub.

### Step 7: Run Your Published Image

Run the container directly from Docker Hub:
```bash
docker run -it -e PORT=4000 -p 3000:3000 your-dockerhub-username/my-node-app:latest
```

Docker will:
1. Check if the image exists locally
2. If not, pull it from Docker Hub
3. Create and start a new container

## Managing Versions

As you update your application, follow semantic versioning:
- `v1.0.0` - Initial release
- `v1.0.1` - Bug fix
- `v1.1.0` - New feature
- `v2.0.0` - Breaking changes

Each version should have its own tag and image.

## Visibility and Permissions

By default, images are public. You can make them private in Docker Hub settings:
1. Go to your Docker Hub account settings
2. Navigate to the repository settings
3. Change visibility to "Private"
4. Add team members who need access

## Troubleshooting Docker Hub Issues

### Issue: Login fails
```bash
docker logout
docker login
```

### Issue: Push fails with "unauthorized"
Make sure your image tag matches your username correctly.

### Issue: Image not found when pulling
Verify the image exists on Docker Hub and you have the correct name and tag.

## Integration with CI/CD

Docker Hub can automatically build images when you push to GitHub:
1. Connect your GitHub account to Docker Hub
2. Link a repository
3. Configure build rules
4. Push to trigger automatic builds

## Next Steps

Learn how to manage multi-container applications with [Docker Compose](docker-compose.md), which is useful when your application depends on multiple services like databases.
