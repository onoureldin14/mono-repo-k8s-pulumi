import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";

const stack = pulumi.getStack();
const config = new pulumi.Config();

// Configuration values
const appName = "simple-typescript-app-pulumi";
const imageTag = "latest";
const containerPort = 3000;
const replicas = 2;

// Docker registry configuration
const registryUrl = "onoureldin14";

// Use the pre-built image from Docker Hub
const image = new docker.RemoteImage(`${appName}-image`, {
    name: `${registryUrl}/${appName}:latest`,
});

// Create Kubernetes namespace
const namespace = new k8s.core.v1.Namespace(`${appName}-namespace`, {
    metadata: {
        name: appName,
        labels: {
            app: appName,
        },
    },
});

// Create Kubernetes deployment
const deployment = new k8s.apps.v1.Deployment(`${appName}-deployment`, {
    metadata: {
        name: appName,
        namespace: namespace.metadata.name,
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
                    image: image.name,
                    ports: [{
                        containerPort: containerPort,
                    }],
                    env: [{
                        name: "NODE_ENV",
                        value: "production",
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
}, { dependsOn: [namespace] });

// Create Kubernetes service
const service = new k8s.core.v1.Service(`${appName}-service`, {
    metadata: {
        name: appName,
        namespace: namespace.metadata.name,
        labels: {
            app: appName,
        },
    },
    spec: {
        type: "ClusterIP",
        ports: [{
            port: 80,
            targetPort: containerPort,
            protocol: "TCP",
        }],
        selector: {
            app: appName,
        },
    },
}, { dependsOn: [deployment] });

// Create Kubernetes ingress (optional - for external access)
const ingress = new k8s.networking.v1.Ingress(`${appName}-ingress`, {
    metadata: {
        name: appName,
        namespace: namespace.metadata.name,
        labels: {
            app: appName,
        },
        annotations: {
            "kubernetes.io/ingress.class": "nginx",
            "nginx.ingress.kubernetes.io/rewrite-target": "/",
        },
    },
    spec: {
        rules: [{
            host: config.get("ingressHost") || `${appName}.local`,
            http: {
                paths: [{
                    path: "/",
                    pathType: "Prefix",
                    backend: {
                        service: {
                            name: service.metadata.name,
                            port: {
                                number: 80,
                            },
                        },
                    },
                }],
            },
        }],
    },
}, { dependsOn: [service] });

// Export important values
export const imageName = image.name;
export const namespaceName = namespace.metadata.name;
export const serviceName = service.metadata.name;
export const ingressName = ingress.metadata.name;
export const appUrl = config.get("ingressHost") || `${appName}.local`;
