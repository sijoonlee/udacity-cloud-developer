# install kubectl
https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html

# install aws-iam-authenticator
https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html

# create a kubeconfig
https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html

# create a IAM user
- give EKS permissions
- after creating, go to security credentials, enable console password
- create access key 
- configure aws at your local machine: **aws configure**
```
AWS Access Key ID [****************ACSO]: A---------------P
AWS Secret Access Key [****************3W91]: X-------------------B
Default region name [ca-central-1]: ca-central-1
Default output format [None]: 
```

# create a clustuer @ EKS by using the IAM user on AWS web service EKS
- after creating, go to 'Compute' tab, and create Node

# follow commands below
- aws eks --region ca-central-1 update-kubeconfig --name Demo
```
Added new context arn:aws:eks:ca-central-1:609083582693:cluster/Demo2 to /home/sijoonlee/.kube/config
```
- kubectl apply -f deployment.yml
```
deployment.apps/my-app created
```
- kubectl apply -f service.yml
```
service/my-app created
```
- kubectl get pods
```
NAME                      READY   STATUS    RESTARTS   AGE
my-app-77f96dffbc-4l8zl   1/1     Running   0          51s
my-app-77f96dffbc-t4s89   1/1     Running   0          51s
```
- kubectl describe services
```
Name:              kubernetes
Namespace:         default
Labels:            component=apiserver
                   provider=kubernetes
Annotations:       <none>
Selector:          <none>
Type:              ClusterIP
IP:                10.100.0.1
Port:              https  443/TCP
TargetPort:        443/TCP
Endpoints:         172.31.13.71:443,172.31.17.17:443
Session Affinity:  None
Events:            <none>


Name:              my-app
Namespace:         default
Labels:            run=my-app
Annotations:       kubectl.kubernetes.io/last-applied-configuration:
                     {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"labels":{"run":"my-app"},"name":"my-app","namespace":"default"},"spec":{...
Selector:          run=my-app
Type:              ClusterIP
IP:                10.100.210.137
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         <none>
Session Affinity:  None
Events:            <none>
```
kubectl cluster-info
```
Kubernetes master is running at https://6FBA937A5214CAF37EF7E5A61C7E1989.gr7.ca-central-1.eks.amazonaws.com
CoreDNS is running at https://6FBA937A5214CAF37EF7E5A61C7E1989.gr7.ca-central-1.eks.amazonaws.com/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

# get a shell in the running container
kubectl exec -it my-app-77f96dffbc-t4s89 -- /bin/bash

# Clean up
- kubectl delete deployments my-app
- kubectl delete service my-app