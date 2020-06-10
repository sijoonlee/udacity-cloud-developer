#!/bin/bash
kubectl apply -f ./env-secret.yaml
kubectl apply -f ./aws-secret.yaml
kubectl apply -k .