Autoscaling is a process in [[Kubernetes]] that allows [[Pods]] and [[Nodes]] to be automatically scaled to manage changing demand. [[Pods]] autoscaling is managed in the [[kube-controller-manager]] where resources are monitored on loop to detect if thresholds are met and need scaling.
[[Nodes]] Autoscaling is managed in another component called "Cluster Autoscaling".
Autoscaling is managed in the [[Control Plane]]

There are two different methods of [[Pods]] autoscaling:
1. [[Horizontal Pod Autoscaling]] - Spin up and down pods on demand
2. [[Veritcal Pod Autoscaling]] - Scale you pod resources based on demand

All autoscaling requests occur through the typical [[Kubernetes]] [[Control Plane]] [[Application Programming Interface]].