In [[Kubernetes]] the concept of an ephemeral [[Container]] is one that can run temporarily, aka it can spin up and spin down as required without needing any container specific memory.
Ephemeral containers can still use [[Persistent Volume Claim]] but shared across [[Pods]] rather than specific to the individual [[Pods]].

Ephemeral containers are the opposite of stateful containers where history of the container is required for proper operation.