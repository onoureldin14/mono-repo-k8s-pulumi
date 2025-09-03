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
