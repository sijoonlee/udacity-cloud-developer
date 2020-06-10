#!/bin/bash
kubectl apply -f feed/deployment.yml
kubectl apply -f feed/service.yml

kubectl apply -f user/deployment.yml
kubectl apply -f user/service.yml

kubectl apply -f reverse-proxy/deployment.yml
kubectl apply -f reverse-proxy/service.yml

kubectl get pods

echo test commands
echo kubectl exec -it _____ bash
echo curl reverseproxy-svc:8080/api/v0/feed
echo curl reverseproxy-svc:8080/api/v0/user
echo To check log:
echo kubectl logs -f [pod name]

kubectl get services
echo check external address of reverse proxy service, use it to secret