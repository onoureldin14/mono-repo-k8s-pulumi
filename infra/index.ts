import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

// Configure Kubernetes provider
const k8sProvider = new k8s.Provider("k8s-provider", {
    kubeconfig: process.env.KUBECONFIG || "~/.kube/config",
    context: "minikube",
});

// Configuration values
const appName = "simple-typescript-app-pulumi";
const imageTag = "latest";
const containerPort = 3000;
const nodePort = 30000;
const replicas = 2;

// Kubernetes Deployment
const deployment = new k8s.apps.v1.Deployment(appName, {
    metadata: {
        name: appName,
        labels: {
            app: appName,
        },
    },
    spec: {
        replicas: replicas,
        selector: {
            matchLabels: {
                app: appName,
            },
        },
        template: {
            metadata: {
                labels: {
                    app: appName,
                },
            },
            spec: {
                containers: [{
                    name: appName,
                    image: `onoureldin14/${appName}:${imageTag}`,
                    ports: [{
                        containerPort: containerPort,
                    }],
                    env: [{
                        name: "NODE_ENV",
                        value: "production",
                    }, {
                        name: "PORT",
                        value: containerPort.toString(),
                    }],
                    resources: {
                        requests: {
                            cpu: "100m",
                            memory: "128Mi",
                        },
                        limits: {
                            cpu: "500m",
                            memory: "512Mi",
                        },
                    },
                    livenessProbe: {
                        httpGet: {
                            path: "/health",
                            port: containerPort,
                        },
                        initialDelaySeconds: 30,
                        periodSeconds: 10,
                    },
                    readinessProbe: {
                        httpGet: {
                            path: "/health",
                            port: containerPort,
                        },
                        initialDelaySeconds: 5,
                        periodSeconds: 5,
                    },
                }],
            },
        },
    },
}, { provider: k8sProvider });

// Kubernetes Service
const service = new k8s.core.v1.Service(`${appName}-service`, {
    metadata: {
        name: `${appName}-service`,
        labels: {
            app: appName,
        },
    },
    spec: {
        type: "NodePort",
        selector: {
            app: appName,
        },
        ports: [{
            port: containerPort,
            targetPort: containerPort,
            nodePort: nodePort,
        }],
    },
}, { provider: k8sProvider });

// Export important values
export const deploymentName = deployment.metadata.name;
export const serviceName = service.metadata.name;
export const appUrl = `http://$(minikube ip):${nodePort}`;
