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
my-app-2-7777b8c7-7fs48         1/1     Running   0          51s
reverseproxy-7f955ddf55-cnrhn   1/1     Running   0          14s
```

kubectl get services
```
NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes         ClusterIP   10.100.0.1      <none>        443/TCP    34h
my-app-2-svc       ClusterIP   10.100.168.90   <none>        8080/TCP   18m
reverseproxy-svc   ClusterIP   10.100.17.116   <none>        8080/TCP   18m
```

kubectl exec -it my-app-2-7777b8c7-7fs48 bash
```
root@my-app-2-7777b8c7-7fs48:/usr/src/app# 