- build and push Docker images under nginx/image and simple-express/image

- go to directory nginx 
kubectl apply -f deployment.yml
kubectl apply -f service.yml

- go to directory simple-express
kubectl apply -f deployment.yml
kubectl apply -f service.yml


- check 
kubectl get pods
```
NAME                            READY   STATUS    RESTARTS   AGE
my-app-2-7777b8c7-xg9x7         1/1     Running   0          6m6s
reverseproxy-7d67ccfb8c-nh8rw   1/1     Running   4          6m53s
```

kubectl get services
```
NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes         ClusterIP   10.100.0.1       <none>        443/TCP    3d10h
my-app-2-svc       ClusterIP   10.100.214.122   <none>        8080/TCP   3m54s
reverseproxy-svc   ClusterIP   10.100.195.209   <none>        8080/TCP   4m39s

```

kubectl exec -it my-app-2-7777b8c7-xg9x7 bash
```
root@my-app-2-7777b8c7-xg9x7:/usr/src/app# curl reverseproxy-svc:8080/api/health
Hello!
```

- clean up
kubectl delete service my-app-2-svc  
kubectl delete service reverseproxy-svc  
kubectl delete deployment my-app-2  
kubectl delete deployment reverseproxy  

