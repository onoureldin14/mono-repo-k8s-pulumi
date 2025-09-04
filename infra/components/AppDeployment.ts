import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export interface AppDeploymentArgs {
    name: string;
    image: string;
    imageTag: string;
    containerPort: number;
    nodePort?: number;
    replicas?: number;
    deploymentType: "deployment" | "daemonset";
    env?: Array<{ name: string; value: string }>;
    resources?: {
        requests?: { cpu?: string; memory?: string };
        limits?: { cpu?: string; memory?: string };
    };
    serviceType?: "ClusterIP" | "NodePort" | "LoadBalancer";
    labels?: Record<string, string>;
}

export class AppDeployment extends pulumi.ComponentResource {
    public readonly deployment?: k8s.apps.v1.Deployment;
    public readonly daemonSet?: k8s.apps.v1.DaemonSet;
    public readonly service: k8s.core.v1.Service;
    public readonly appUrl: pulumi.Output<string>;

    constructor(name: string, args: AppDeploymentArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:kubernetes:AppDeployment", name, {}, opts);

        const config = new pulumi.Config();
        const k8sContext = config.get("kubernetes:context") || "minikube";

        // Configure Kubernetes provider
        const k8sProvider = new k8s.Provider(`${name}-provider`, {
            context: k8sContext,
        }, { parent: this });

        // Common labels
        const commonLabels = {
            app: args.name,
            component: "application",
            ...args.labels,
        };

        // Common container spec
        const containerSpec: k8s.types.input.core.v1.Container = {
            name: args.name,
            image: `${args.image}:${args.imageTag}`,
            ports: [{
                containerPort: args.containerPort,
            }],
            env: [
                { name: "NODE_ENV", value: "production" },
                { name: "PORT", value: args.containerPort.toString() },
                ...(args.env || [])
            ],
            resources: args.resources || {
                requests: { cpu: "100m", memory: "128Mi" },
                limits: { cpu: "500m", memory: "512Mi" },
            },
            livenessProbe: {
                httpGet: {
                    path: "/health",
                    port: args.containerPort,
                },
                initialDelaySeconds: 30,
                periodSeconds: 10,
            },
            readinessProbe: {
                httpGet: {
                    path: "/health",
                    port: args.containerPort,
                },
                initialDelaySeconds: 5,
                periodSeconds: 5,
            },
        };

        // Create Deployment or DaemonSet based on type
        if (args.deploymentType === "deployment") {
            this.deployment = new k8s.apps.v1.Deployment(`${name}-deployment`, {
                metadata: {
                    name: args.name,
                    labels: commonLabels,
                },
                spec: {
                    replicas: args.replicas || 2,
                    selector: {
                        matchLabels: { app: args.name },
                    },
                    template: {
                        metadata: {
                            labels: { app: args.name },
                        },
                        spec: {
                            containers: [containerSpec],
                        },
                    },
                },
            }, { provider: k8sProvider, parent: this });
        } else {
            this.daemonSet = new k8s.apps.v1.DaemonSet(`${name}-daemonset`, {
                metadata: {
                    name: args.name,
                    labels: commonLabels,
                },
                spec: {
                    selector: {
                        matchLabels: { app: args.name },
                    },
                    template: {
                        metadata: {
                            labels: { app: args.name },
                        },
                        spec: {
                            containers: [containerSpec],
                        },
                    },
                },
            }, { provider: k8sProvider, parent: this });
        }

        // Create Service
        const servicePorts: k8s.types.input.core.v1.ServicePort[] = [{
            port: args.containerPort,
            targetPort: args.containerPort,
        }];

        // Add nodePort if specified and service type is NodePort
        if (args.serviceType === "NodePort" && args.nodePort) {
            servicePorts[0].nodePort = args.nodePort;
        }

        this.service = new k8s.core.v1.Service(`${name}-service`, {
            metadata: {
                name: `${args.name}-service`,
                labels: commonLabels,
            },
            spec: {
                type: args.serviceType || "NodePort",
                selector: { app: args.name },
                ports: servicePorts,
            },
        }, { provider: k8sProvider, parent: this });

        // Generate app URL based on service type
        this.appUrl = pulumi.all([this.service.spec]).apply(([spec]) => {
            if (spec?.type === "NodePort" && args.nodePort) {
                return `http://$(minikube ip):${args.nodePort}`;
            } else if (spec?.type === "LoadBalancer") {
                return "http://<load-balancer-ip>";
            } else {
                return `http://${args.name}-service:${args.containerPort}`;
            }
        });

        // Register outputs
        this.registerOutputs({
            deployment: this.deployment,
            daemonSet: this.daemonSet,
            service: this.service,
            appUrl: this.appUrl,
        });
    }
}
