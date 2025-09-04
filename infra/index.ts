import * as pulumi from "@pulumi/pulumi";
import { AppDeployment } from "./components";

// Get configuration
const config = new pulumi.Config();

// Configuration values
const appName = "simple-typescript-app-pulumi";
const imageTag = "v1.0.0"; // Changed from "latest" to avoid policy violation
const containerPort = 3000;
const nodePort = 30000;

// Deploy as Deployment (default)
const appDeployment = new AppDeployment("app-deployment", {
    name: appName,
    image: "onoureldin14/simple-typescript-app-pulumi",
    imageTag: imageTag,
    containerPort: containerPort,
    nodePort: nodePort,
    replicas: 2,
    deploymentType: "deployment",
    serviceType: "NodePort",
    env: [
        { name: "CUSTOM_ENV", value: "production" }
    ],
    resources: {
        requests: { cpu: "100m", memory: "128Mi" },
        limits: { cpu: "500m", memory: "512Mi" },
    },
    labels: {
        environment: "production",
        team: "platform",
    },
});

// Example: Deploy as DaemonSet (commented out, uncomment to use)
// const appDaemonSet = new AppDeployment("app-daemonset", {
//     name: `${appName}-daemon`,
//     image: "onoureldin14/simple-typescript-app-pulumi",
//     imageTag: imageTag,
//     containerPort: containerPort,
//     deploymentType: "daemonset",
//     serviceType: "ClusterIP",
//     env: [
//         { name: "CUSTOM_ENV", value: "daemon" }
//     ],
//     resources: {
//         requests: { cpu: "50m", memory: "64Mi" },
//         limits: { cpu: "200m", memory: "256Mi" },
//     },
//     labels: {
//         environment: "production",
//         team: "platform",
//         workload: "daemon",
//     },
// });

// Export important values
export const deploymentName = appDeployment.deployment?.metadata.name;
export const serviceName = appDeployment.service.metadata.name;
export const appUrl = appDeployment.appUrl;
