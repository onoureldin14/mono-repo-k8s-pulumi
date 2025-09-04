# AppDeployment Component

A reusable Pulumi component that abstracts Kubernetes application deployment, supporting both Deployment and DaemonSet patterns.

## Features

- **Dual Deployment Types**: Supports both `deployment` and `daemonset` modes
- **Flexible Service Types**: ClusterIP, NodePort, or LoadBalancer
- **Configurable Resources**: CPU and memory requests/limits
- **Health Checks**: Built-in liveness and readiness probes
- **Environment Variables**: Custom environment variable support
- **Labels**: Flexible labeling system
- **Policy Compliant**: Works with Pulumi policy packs

## Usage

### Basic Deployment

```typescript
import { AppDeployment } from "./components";

const app = new AppDeployment("my-app", {
    name: "my-application",
    image: "myregistry/my-app",
    imageTag: "v1.0.0",
    containerPort: 3000,
    deploymentType: "deployment",
    replicas: 3,
    serviceType: "NodePort",
    nodePort: 30000,
});
```

### DaemonSet Deployment

```typescript
const daemonApp = new AppDeployment("my-daemon", {
    name: "my-daemon-app",
    image: "myregistry/my-app",
    imageTag: "v1.0.0",
    containerPort: 3000,
    deploymentType: "daemonset",
    serviceType: "ClusterIP",
    resources: {
        requests: { cpu: "50m", memory: "64Mi" },
        limits: { cpu: "200m", memory: "256Mi" },
    },
});
```

## Configuration Options

### AppDeploymentArgs

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | ✅ | Application name |
| `image` | string | ✅ | Container image name |
| `imageTag` | string | ✅ | Container image tag |
| `containerPort` | number | ✅ | Container port |
| `deploymentType` | "deployment" \| "daemonset" | ✅ | Deployment type |
| `nodePort` | number | ❌ | NodePort for NodePort services |
| `replicas` | number | ❌ | Number of replicas (deployment only) |
| `serviceType` | "ClusterIP" \| "NodePort" \| "LoadBalancer" | ❌ | Service type |
| `env` | Array<{name: string, value: string}> | ❌ | Environment variables |
| `resources` | object | ❌ | Resource requests/limits |
| `labels` | Record<string, string> | ❌ | Additional labels |

## Configuration Presets

Use the configuration system for different deployment scenarios:

```typescript
import { deploymentPresets } from "./config";

// Web application
const webConfig = deploymentPresets.webApp();

// Node-level service (monitoring, logging)
const nodeConfig = deploymentPresets.nodeService();

// High availability deployment
const haConfig = deploymentPresets.highAvailability();

// Development environment
const devConfig = deploymentPresets.development();
```

## Pulumi Config Integration

Set configuration via Pulumi config:

```bash
# Set deployment type
pulumi config set deploymentType daemonset

# Set replicas
pulumi config set replicas 5

# Set service type
pulumi config set serviceType LoadBalancer

# Set resource limits
pulumi config set cpuLimit 1000m
pulumi config set memoryLimit 1Gi
```

## Outputs

The component provides the following outputs:

- `deployment`: The Kubernetes Deployment (if deploymentType is "deployment")
- `daemonSet`: The Kubernetes DaemonSet (if deploymentType is "daemonset")
- `service`: The Kubernetes Service
- `appUrl`: Generated application URL

## Examples

### Switching Between Deployment Types

```typescript
// Deploy as regular deployment
const appDeployment = new AppDeployment("app", {
    name: "my-app",
    image: "myregistry/my-app",
    imageTag: "v1.0.0",
    containerPort: 3000,
    deploymentType: "deployment",
    replicas: 3,
});

// Deploy as daemonset
const appDaemonSet = new AppDeployment("app-daemon", {
    name: "my-app-daemon",
    image: "myregistry/my-app",
    imageTag: "v1.0.0",
    containerPort: 3000,
    deploymentType: "daemonset",
});
```

### Environment-Specific Configurations

```typescript
// Production
const prodApp = new AppDeployment("prod-app", {
    name: "my-app",
    image: "myregistry/my-app",
    imageTag: "v1.0.0",
    containerPort: 3000,
    deploymentType: "deployment",
    replicas: 5,
    serviceType: "LoadBalancer",
    resources: {
        requests: { cpu: "200m", memory: "256Mi" },
        limits: { cpu: "1000m", memory: "1Gi" },
    },
    labels: { environment: "production" },
});

// Development
const devApp = new AppDeployment("dev-app", {
    name: "my-app-dev",
    image: "myregistry/my-app",
    imageTag: "latest",
    containerPort: 3000,
    deploymentType: "deployment",
    replicas: 1,
    serviceType: "NodePort",
    nodePort: 30000,
    resources: {
        requests: { cpu: "50m", memory: "64Mi" },
        limits: { cpu: "200m", memory: "256Mi" },
    },
    labels: { environment: "development" },
});
```

## Benefits

1. **Reusability**: Single component for multiple deployment patterns
2. **Consistency**: Standardized configuration across environments
3. **Flexibility**: Easy switching between deployment types
4. **Maintainability**: Centralized application deployment logic
5. **Policy Compliance**: Built-in support for Pulumi policies
6. **Type Safety**: Full TypeScript support with proper interfaces
