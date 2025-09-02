# Simple TypeScript Application

A simple TypeScript Node.js application with Docker support for Kubernetes deployment on Minikube.

## Features

- TypeScript-based Express server
- Health check endpoints for Kubernetes
- Docker multi-stage build
- Kubernetes manifests for Minikube
- Resource limits and health probes

## Prerequisites

- Node.js 18+ 
- Docker
- Minikube
- kubectl

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Build the application:
```bash
npm run build
```

4. Start production build:
```bash
npm start
```

## Docker

1. Build the Docker image:
```bash
npm run docker:build
```

2. Run locally with Docker:
```bash
npm run docker:run
```

## Kubernetes Deployment

The Kubernetes resources are managed by Terraform in the `infra/` folder:

- `infra/k8s-deployment.yaml` - Application deployment
- `infra/k8s-service.yaml` - Service configuration

To deploy:
1. Build the Docker image in Minikube context
2. Use Terraform to apply the infrastructure
3. Access via the exposed service

## API Endpoints

- `GET /` - Root endpoint with app info
- `GET /health` - Health check for Kubernetes
- `GET /api/info` - Detailed application information

## Kubernetes Resources

The Kubernetes resources are defined in the `infra/` folder:

- **Deployment**: 2 replicas with health checks
- **Service**: NodePort service exposing port 30000
- **Resource Limits**: CPU and memory constraints
- **Health Probes**: Liveness and readiness probes

## Monitoring

The application includes:
- Health check endpoint for Kubernetes probes
- Resource usage information
- Uptime tracking
- Environment information

## Troubleshooting

1. Check pod logs:
```bash
kubectl logs -l app=simple-typescript-app
```

2. Check pod status:
```bash
kubectl describe pods -l app=simple-typescript-app
```

3. Check service:
```bash
kubectl describe service simple-typescript-app-service
```

## Cleanup

To remove the deployment, use Terraform to destroy the infrastructure resources.
