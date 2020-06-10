- goto secret directory
    - please see 'kustomization.yaml'
- kubectl apply -k .
- kubectl get secret udacity-project-secret -o yaml
- kubectl get secret
```
NAME                                TYPE                                  DATA   AGE
default-token-2rnn6                 kubernetes.io/service-account-token   3      4d13h
udacity-project-secret-gf9ck597fk   Opaque                                1      62s
```
- kubectl get secret udacity-project-secret-gf9ck597fk -o yaml
```
apiVersion: v1
data:
  POSTGRES_USERNAME: cG9zdGdyZXM=
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","data":{"POSTGRES_USERNAME":"cG9zdGdyZXM="},"kind":"Secret","metadata":{"annotations":{},"name":"udacity-project-secret-gf9ck597fk","namespace":"default"},"type":"Opaque"}
  creationTimestamp: "2020-06-08T04:37:19Z"
  name: udacity-project-secret-gf9ck597fk
  namespace: default
  resourceVersion: "642047"
  selfLink: /api/v1/namespaces/default/secrets/udacity-project-secret-gf9ck597fk
  uid: 2c67d9dd-622f-4777-8994-bb7633c8e0f2
type: Opaque
```
- kubectl delete secret udacity-project-secret-gf9ck597fk