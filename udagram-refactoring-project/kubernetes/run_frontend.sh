#!/bin/bash
kubectl apply -f front-end/deployment.yml
kubectl apply -f front-end/service.yml
kubectl get services