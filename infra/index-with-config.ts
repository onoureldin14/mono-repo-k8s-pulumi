import * as pulumi from "@pulumi/pulumi";
import { AppDeployment } from "./components";
import { getAppConfig, deploymentPresets } from "./config";

// Get configuration
const config = new pulumi.Config();

// Configuration values
const appName = "simple-typescript-app-pulumi";
const imageTag = "v1.0.0";

// Option 1: Use Pulumi config values
const appConfig = getAppConfig();

// Option 2: Use preset configurations (uncomment one)
// const appConfig = deploymentPresets.webApp();
// const appConfig = deploymentPresets.nodeService();
// const appConfig = deploymentPresets.highAvailability();
// const appConfig = deploymentPresets.development();

// Deploy using the configuration
const appDeployment = new AppDeployment("app-deployment", {
    name: appName,
    image: "onoureldin14/simple-typescript-app-pulumi",
    imageTag: imageTag,
    containerPort: 3000,
    nodePort: appConfig.nodePort,
    replicas: appConfig.replicas,
    deploymentType: appConfig.deploymentType,
    serviceType: appConfig.serviceType,
    resources: appConfig.resources,
    env: [
        { name: "ENVIRONMENT", value: appConfig.environment },
        { name: "DEPLOYMENT_TYPE", value: appConfig.deploymentType },
    ],
    labels: {
        environment: appConfig.environment,
        team: "platform",
        deploymentType: appConfig.deploymentType,
    },
});

// Export important values
export const deploymentName = appDeployment.deployment?.metadata.name;
export const daemonSetName = appDeployment.daemonSet?.metadata.name;
export const serviceName = appDeployment.service.metadata.name;
export const appUrl = appDeployment.appUrl;
export const deploymentType = appConfig.deploymentType;
export const environment = appConfig.environment;
