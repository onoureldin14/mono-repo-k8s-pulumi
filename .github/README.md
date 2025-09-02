# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD of your TypeScript application.

## Workflows

### 1. `deploy.yml` - Main Deployment Pipeline
**Triggers:**
- Push to `main` or `develop` branches
- Manual workflow dispatch (with environment selection)
- Pull request to `main` (runs tests only)

**What it does:**
1. **Build & Test**: Compiles TypeScript, runs tests
2. **Docker Build**: Builds and pushes image to GitHub Container Registry
3. **Deploy**: Uses Pulumi to deploy to Kubernetes
4. **Health Check**: Verifies deployment success

### 2. `pr-check.yml` - Pull Request Validation
**Triggers:**
- Pull requests to `main` or `develop`

**What it does:**
1. **Build & Test**: Validates app code changes
2. **Infra Validation**: Checks Pulumi configuration
3. **No Deployment**: Safe for PR validation

## Required Secrets

Set these in your GitHub repository settings:

### `DOCKERHUB_USERNAME`
- Your Docker Hub username
- Used for Docker Hub authentication

### `DOCKERHUB_TOKEN`
- Your Docker Hub access token
- Get from [Docker Hub Account Settings](https://hub.docker.com/settings/security)
- Used for pushing images to Docker Hub

## Environment Protection

The deployment workflow uses GitHub Environments for additional security:

### `dev` Environment
- Deploys from `main` branch
- Simple development setup with Minikube

## Manual Deployment

You can manually trigger deployments:

1. Go to **Actions** tab in your repository
2. Select **Deploy to Kubernetes** workflow
3. Click **Run workflow**
4. Deploy to development environment
5. Click **Run workflow**

## Customization

### Change Container Registry
Update the `REGISTRY` and `IMAGE_NAME` environment variables in `deploy.yml`:
```yaml
env:
  REGISTRY: your-dockerhub-username
  IMAGE_NAME: your-app-name
```

### Add Custom Tests
Add test scripts to your `app/package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  }
}
```

### Modify Deployment Strategy
Edit the `deploy` job in `deploy.yml` to:
- Add approval gates
- Change deployment order
- Add rollback capabilities
- Integrate with monitoring tools

## Troubleshooting

### Common Issues

1. **Pulumi Access Token Invalid**
   - Regenerate token in Pulumi Console
   - Update repository secret

2. **Docker Build Fails**
   - Check Dockerfile syntax
   - Verify app dependencies are installed

3. **Kubernetes Deployment Fails**
   - Check Minikube is running
   - Verify Pulumi stack configuration
   - Check resource quotas and limits

### Debug Mode

Add `--debug` flag to Pulumi commands for verbose output:
```yaml
- name: Deploy to Kubernetes
  run: |
    cd infra
    pulumi up --yes --non-interactive --debug
```

### Check Minikube Status

If you need to debug Minikube issues:
```bash
minikube status
minikube logs
kubectl get nodes
```

## Security Best Practices

1. **Use Environments**: Protect production with approval gates
2. **Limit Permissions**: Only grant necessary permissions to workflows
3. **Secret Rotation**: Regularly rotate Pulumi access tokens
4. **Branch Protection**: Require PR reviews before merging to main
5. **Audit Logs**: Monitor workflow execution and deployments
