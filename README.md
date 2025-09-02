# TypeScript App with Kubernetes Deployment

A complete example project demonstrating how to build a TypeScript application, containerize it with Docker, and deploy it to Kubernetes using Pulumi Infrastructure as Code.

## 🏗️ Project Structure

```
mono-repo-k8s-pulumi/
├── app/                    # TypeScript application
│   ├── src/               # Source code
│   ├── Dockerfile         # Container definition
│   └── package.json       # App dependencies
├── infra/                  # Pulumi infrastructure
│   ├── index.ts           # Infrastructure code
│   ├── package.json       # Pulumi dependencies
│   └── Pulumi.*.yaml     # Stack configurations
├── .github/workflows/      # GitHub Actions CI/CD
│   ├── deploy.yml         # Main deployment pipeline
│   └── pr-check.yml       # PR validation
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker
- Pulumi CLI
- Kubernetes cluster access
- GitHub repository

### 1. Setup Application
```bash
cd app
npm install
npm run dev          # Development mode
npm run build        # Production build
```

### 2. Setup Infrastructure
```bash
cd infra
npm install
pulumi stack select dev
```

### 3. Deploy
```bash
cd infra
pulumi up
```

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows that automatically:

1. **Build & Test** your TypeScript application
2. **Build & Push** Docker image to registry
3. **Deploy** to Kubernetes using Pulumi
4. **Validate** deployment health

### Manual Deployment
- Go to GitHub Actions tab
- Select "Deploy to Kubernetes"
- Choose environment (dev/prod)
- Click "Run workflow"

## 🐳 Docker

The application is containerized with:
- Multi-stage Dockerfile
- Node.js 18 Alpine base
- Optimized for production
- Health check endpoints

```bash
# Build locally
cd app
npm run docker:build

# Run locally
npm run docker:run
```

## ☸️ Kubernetes

Deployment includes:
- **Namespace**: Isolated environment
- **Deployment**: 2 replicas with health checks
- **Service**: Internal communication
- **Ingress**: External access (requires nginx controller)
- **Resource limits**: CPU/memory constraints

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Production/development mode
- `PORT`: Application port (default: 3000)

### Pulumi Configuration
- `ingressHost`: Domain for external access (optional)
- Uses Docker Hub registry: `onoureldin14/simple-typescript-app-pulumi:latest`

## 📊 Health Monitoring

The application provides health endpoints:
- `/health` - Kubernetes readiness/liveness probes
- `/api/info` - System information
- `/` - Basic status

## 🛠️ Development

### Local Development
```bash
cd app
npm run dev          # Hot reload with ts-node
```

### Testing Infrastructure
```bash
cd infra
pulumi preview       # Preview changes
pulumi up            # Deploy changes
pulumi destroy       # Clean up resources
```

## 🔒 Security

- Environment-based deployments
- Secret management via Pulumi
- Resource quotas and limits
- Health check validation

## 📚 Learn More

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
