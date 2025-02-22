Nodes are a key concept of [[Kubernetes]], these are your worker servers (more commonly VM's such as EC2 instances) used in your cluster and as such spin up and down much less than [[Pods]].

In one [[Kubernetes Overview]] cluster you should have multiple nodes to allow for [[High Availability]]. Larger nodes allow for less overheads and are more cost effective per compute used but more smaller nodes allow for more dynamic scalability to spin up and down as demand rises and falls.

Nodes (sometimes called Worker Nodes) are made of four main components :
1. [[Container Runtime]]
2. [[Container]]s
3. Node Agent ([[kubelet]])
4. [[Proxy]] (Not always required) ([[kube-proxy]])