import * as pulumi from "@pulumi/pulumi";

// Configuration interface
export interface AppConfig {
    deploymentType: "deployment" | "daemonset";
    replicas?: number;
    serviceType: "ClusterIP" | "NodePort" | "LoadBalancer";
    nodePort?: number;
    resources: {
        requests: { cpu: string; memory: string };
        limits: { cpu: string; memory: string };
    };
    environment: string;
}

// Get configuration from Pulumi config
export function getAppConfig(): AppConfig {
    const config = new pulumi.Config();
    
    return {
        deploymentType: config.get("deploymentType") as "deployment" | "daemonset" || "deployment",
        replicas: config.getNumber("replicas") || 2,
        serviceType: config.get("serviceType") as "ClusterIP" | "NodePort" | "LoadBalancer" || "NodePort",
        nodePort: config.getNumber("nodePort") || 30000,
        resources: {
            requests: {
                cpu: config.get("cpuRequest") || "100m",
                memory: config.get("memoryRequest") || "128Mi",
            },
            limits: {
                cpu: config.get("cpuLimit") || "500m",
                memory: config.get("memoryLimit") || "512Mi",
            },
        },
        environment: config.get("environment") || "production",
    };
}

// Preset configurations for different scenarios
export const deploymentPresets = {
    // Standard web application
    webApp: (): AppConfig => ({
        deploymentType: "deployment",
        replicas: 3,
        serviceType: "NodePort",
        nodePort: 30000,
        resources: {
            requests: { cpu: "100m", memory: "128Mi" },
            limits: { cpu: "500m", memory: "512Mi" },
        },
        environment: "production",
    }),

    // DaemonSet for node-level services (monitoring, logging)
    nodeService: (): AppConfig => ({
        deploymentType: "daemonset",
        serviceType: "ClusterIP",
        resources: {
            requests: { cpu: "50m", memory: "64Mi" },
            limits: { cpu: "200m", memory: "256Mi" },
        },
        environment: "production",
    }),

    // High availability deployment
    highAvailability: (): AppConfig => ({
        deploymentType: "deployment",
        replicas: 5,
        serviceType: "LoadBalancer",
        resources: {
            requests: { cpu: "200m", memory: "256Mi" },
            limits: { cpu: "1000m", memory: "1Gi" },
        },
        environment: "production",
    }),

    // Development environment
    development: (): AppConfig => ({
        deploymentType: "deployment",
        replicas: 1,
        serviceType: "NodePort",
        nodePort: 30000,
        resources: {
            requests: { cpu: "50m", memory: "64Mi" },
            limits: { cpu: "200m", memory: "256Mi" },
        },
        environment: "development",
    }),
};
