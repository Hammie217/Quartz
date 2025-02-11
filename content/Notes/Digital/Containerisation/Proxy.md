A [[Proxy]] is installed on nodes to allow [[Kubernetes services]] to be implemented. This allows for exposing network points to [[Pods]] that require it.
If this is not a requirement a proxy does not need to be installed.

As [[Pods]] are spun up and down as required with differing IP's a proxy allows a specific [[Kubernetes services]] address to be used and the proxy can re-direct this traffic depending on what [[Pods]] are currently up.

The default kubernetes proxy is kube-proxy