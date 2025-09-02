# Pulumi Infrastructure for TypeScript App

This directory contains the Pulumi infrastructure code to build, push to Docker registry, and deploy your TypeScript application to Kubernetes.

## Prerequisites

1. **Pulumi CLI** installed
2. **Docker** running locally
3. **Kubernetes cluster** accessible (local or remote)
4. **Docker registry** credentials

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your Docker registry:**
   Update the stack configuration files (`Pulumi.dev.yaml` or `Pulumi.prod.yaml`) with your registry details:
   ```yaml
   config:
     typescript-app-infra:dockerRegistryUrl: "your-registry.azurecr.io"
     typescript-app-infra:dockerRegistryUsername: "your-username"
     typescript-app-infra:dockerRegistryPassword: "your-password"
     typescript-app-infra:ingressHost: "your-domain.com"
   ```

3. **Set up Pulumi stack:**
   ```bash
   # For development
   pulumi stack select dev
   
   # For production
   pulumi stack select prod
   ```

## Deployment

1. **Preview changes:**
   ```bash
   npm run preview
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

3. **Check status:**
   ```bash
   pulumi stack outputs
   ```

## What Gets Created

- **Docker Image**: Built from your app directory and pushed to registry
- **Kubernetes Namespace**: Isolated namespace for your application
- **Deployment**: 2 replicas with health checks and resource limits
- **Service**: ClusterIP service for internal communication
- **Ingress**: External access configuration (requires nginx ingress controller)

## Configuration Options

- **Replicas**: Number of application instances (default: 2)
- **Resources**: CPU and memory limits/requests
- **Health Checks**: Liveness and readiness probes using `/health` endpoint
- **Port**: Application runs on port 3000 internally

## Cleanup

To destroy all resources:
```bash
npm run destroy
```

## Troubleshooting

1. **Docker build issues**: Ensure Docker is running and has access to the app directory
2. **Registry authentication**: Verify your registry credentials are correct
3. **Kubernetes connection**: Ensure kubectl is configured and cluster is accessible
4. **Ingress issues**: Make sure nginx ingress controller is installed in your cluster
