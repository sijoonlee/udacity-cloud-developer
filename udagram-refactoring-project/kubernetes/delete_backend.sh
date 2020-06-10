#!/bin/bash
kubectl delete deployment endpoint-feed
kubectl delete service endpoint-feed-svc

kubectl delete deployment endpoint-user
kubectl delete service endpoint-user-svc

kubectl delete deployment reverseproxy
kubectl delete service reverseproxy-svc
