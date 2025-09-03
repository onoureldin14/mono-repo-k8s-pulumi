# Kubernetes Policies

This Pulumi policy pack enforces Kubernetes best practices using the proper Pulumi policy template.

## Policy Included

- **no-latest-tag**: Warns against using 'latest' image tags in Kubernetes deployments

## Creating a New Policy Pack

To create a new policy pack using the proper Pulumi template:

```bash
pulumi policy new kubernetes-typescript
```

This creates a properly structured policy pack with correct dependencies and TypeScript configuration.

## Quick Start

### 1. Test the Policy Pack Locally
```bash
cd ../../infra
pulumi preview --policy-pack ../policies/kubernetes-policies
```

### 2. Publish the Policy Pack
```bash
cd ../policies/kubernetes-policies
pulumi policy publish
```

### 3. Install the Published Policy Pack
```bash
pulumi policy install kubernetes-typescript
```

### 4. Enable Policies on a Stack
```bash
pulumi policy enable kubernetes-typescript
```

## What the Policy Checks

### Policy: No Latest Tag
- **What it checks**: If your deployment uses `:latest` image tag
- **Your current infra**: Uses `imageTag = "latest"` - this will trigger a warning
- **Expected result**: Advisory warning about using latest tag

## Expected Output
When you run the test, you should see:
```
Policies:
    ⚠️ kubernetes-typescript@v0.0.1 (local: ../policies/kubernetes-policies)
        - [advisory] no-latest-tag (kubernetes:apps/v1:Deployment: simple-typescript-app-pulumi)
          Kubernetes deployments should not use 'latest' image tag
          Deployment should not use 'latest' image tag. Use specific version tags for better reproducibility.
```

## To Fix the Warning
Change in your `infra/index.ts`:
```typescript
const imageTag = "v1.0.0"; // instead of "latest"
```

## Policy Structure

The policy uses the proper Pulumi API:
```typescript
import * as k8s from "@pulumi/kubernetes";
import { PolicyPack, validateResourceOfType } from "@pulumi/policy";

new PolicyPack("kubernetes-typescript", {
    policies: [{
        name: "no-latest-tag",
        description: "Kubernetes deployments should not use 'latest' image tag",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(k8s.apps.v1.Deployment, (deployment, args, reportViolation) => {
            const containers = deployment.spec?.template?.spec?.containers || [];
            
            for (const container of containers) {
                if (container.image && container.image.endsWith(":latest")) {
                    reportViolation("Deployment should not use 'latest' image tag. Use specific version tags for better reproducibility.");
                }
            }
        }),
    }],
});
```

## Enforcement Levels

- **mandatory**: Policy violations will cause deployment to fail
- **advisory**: Policy violations will show warnings but allow deployment to proceed

## Adding More Policies

To add more policies, simply add new policy objects to the `policies` array in `index.ts`:

```typescript
{
    name: "your-policy-name",
    description: "Description of what the policy checks",
    enforcementLevel: "advisory", // or "mandatory"
    validateResource: validateResourceOfType(k8s.apps.v1.Deployment, (deployment, args, reportViolation) => {
        // Your policy logic here
    }),
}
```