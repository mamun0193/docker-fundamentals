# Getting Started

This is a simple Node.js application containerized with Docker. This guide will walk you through the initial setup and prerequisites needed to begin working with Docker.

## Prerequisites

- **Docker installed on your machine**. You can download it from [here](https://www.docker.com/get-started).
  - Windows: Download Docker Desktop for Windows
  - macOS: Download Docker Desktop for Mac
  - Linux: Install Docker using your package manager
- **Basic knowledge of Node.js and Docker** - You should be familiar with npm and basic JavaScript concepts
- **A text editor or IDE** - VS Code, Sublime Text, or any editor of your choice
- **Command line/terminal access** - Familiarity with command line operations

## Verifying Docker Installation

Before proceeding, verify that Docker is installed correctly by running:
```bash
docker --version
```

You should see the Docker version number. If not, revisit the installation steps.

## Setting Up Your Node.js Application

### Step 1: Create Project Directory
Create a new directory for your project and navigate into it:
```bash
mkdir my-node-app
cd my-node-app
```

### Step 2: Initialize Node.js Project
Initialize a new Node.js application:
```bash
npm init -y
```

This command creates a `package.json` file with default settings. The `-y` flag skips the interactive questionnaire.

### Step 3: Create Your Application
Create an `index.js` file with a simple Express server:
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

This creates a basic Express server that listens on port 3000 and responds with "Hello, World!" to requests on the root path.

### Step 4: Install Dependencies
Install the Express framework:
```bash
npm install express
```

This downloads the Express package and saves it to your `node_modules` directory, and updates your `package.json` file with the dependency information.

### Step 5: Test Your Application (Optional)
You can test your application locally before containerizing it:
```bash
node index.js
```

Then open your browser and navigate to `http://localhost:3000` to see your application running.

## Project Structure

After completing these steps, your project directory should look like this:
```
my-node-app/
├── index.js
├── package.json
├── package-lock.json
└── node_modules/
```

## Troubleshooting

### npm not found
Make sure Node.js and npm are properly installed. Run `node --version` and `npm --version` to verify.

### Express installation fails
Try clearing npm cache: `npm cache clean --force` and retry the installation.

### Port already in use
If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 node index.js
```

## Understanding package.json

Your package.json file contains metadata about your project:
- **name**: Project name
- **version**: Project version
- **dependencies**: Production dependencies (Express, etc.)
- **devDependencies**: Development-only dependencies

## Next Steps

Now that you have a basic Node.js application set up, proceed to [Dockerfile Basics](dockerfile-basics.md) to learn how to containerize it with Docker.
