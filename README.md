# kubernetes-talk


## Create Namespace
```sh
cat <<EOF > namespace.yaml
kind: Namespace
apiVersion: v1
metadata:
  name: kubernetes-talk
EOF

# Apply yaml to the cluster
kubectl apply -f namespace.yaml

# Check namespace was created
kubectl get namespace kubernetes-talk
```

## Create Deployment v1

```sh
# Create deployment yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubernetes-talk-deployment
  labels:
    app: kubernetes-talk
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kubernetes-talk
  template:
    metadata:
      labels:
        app: kubernetes-talk
    spec:
      containers:
      - name: kubernetes-talk-container
        image: 702141274116.dkr.ecr.us-east-1.amazonaws.com/kubernetes-talk:v1
        ports:
        - containerPort: 3000
EOF

# Apply yaml to the cluster
kubectl apply -f deployment.yaml -n kubernetes-talk

# Check deployment status and number of pods
kubectl get deployment kubernetes-talk-deployment -n kubernetes-talk

# Check pods
kubectl get pods -n kubernetes-talk

# Check logs of a pod 
kubectl logs <pod> -n kubernetes-talk

# Port Forward
kubectl port-forward deployment/kubernetes-talk-deployment 3000:3000 -n kubernetes-talk

# Make request to the deployment
curl localhost:3000

# Check the requests being made to the API 
kubectl get deployment kubernetes-talk-deployment -n kubernetes-talk -v=7
```

## Create ConfigMap
```sh
# Create config-map.yaml
cat <<EOF > config-map.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kubernetes-talk-config
data:
  SPECIAL_LEVEL: very
  SPECIAL_TYPE: charm
EOF

# Apply yaml to the cluster
kubectl apply -f config-map.yaml -n kubernetes-talk

# Describe ConfigMap
kubectl describe configmap kubernetes-talk-config -n kubernetes-talk
```

## Create Deployment v2

```sh
# Create deployment yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubernetes-talk-deployment
  labels:
    app: kubernetes-talk
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kubernetes-talk
  template:
    metadata:
      labels:
        app: kubernetes-talk
    spec:
      containers:
      - name: kubernetes-talk-container
        image: 702141274116.dkr.ecr.us-east-1.amazonaws.com/kubernetes-talk:v2
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: kubernetes-talk-config
EOF

# Apply yaml to the cluster
kubectl apply -f deployment.yaml -n kubernetes-talk

# Check deployment status and number of pods
kubectl describe deployment kubernetes-talk-deployment -n kubernetes-talk

# Port Forward
kubectl port-forward deployment/kubernetes-talk-deployment 3000:3000 -n kubernetes-talk

# Make request to the deployment
curl localhost:3000
```

## Create Deployment v3

```sh
# Create deployment yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubernetes-talk-deployment
  labels:
    app: kubernetes-talk
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kubernetes-talk
  template:
    metadata:
      labels:
        app: kubernetes-talk
    spec:
      containers:
      - name: kubernetes-talk-container
        image: 702141274116.dkr.ecr.us-east-1.amazonaws.com/kubernetes-talk:v2
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: kubernetes-talk-config
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 3
          periodSeconds: 5
EOF

# Apply yaml to the cluster
kubectl apply -f deployment.yaml -n kubernetes-talk

# Describe deployment 
kubectl describe deployment kubernetes-talk -n kubernetes-talk

# Get pods
kubectl get pods -n kubernetes-talk
```

## Create Service 

```sh
# Create service yaml
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: kubernetes-talk 
spec:
  selector:
    app: kubernetes-talk
  ports:
    - name: http
      port: 3000
  type: ClusterIP
EOF

# Apply yaml to the cluster
kubectl apply -f service.yaml -n kubernetes-talk

# Get service 
kubectl get service kubernetes-talk -n kubernetes-talk
```

## Create Ingress

```sh
# Create ingress yaml
cat <<EOF > ingress.yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: kubernetes-talk
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: kubernetes-talk.k8s.paretoquantic.com
    http:
      paths:
      - path: /
        backend:
          serviceName: kubernetes-talk
          servicePort: 3000
EOF

# Apply yaml to the cluster
kubectl apply -f ingress.yaml -n kubernetes-talk

# Describe deployment 
kubectl get ingress kubernetes-talk -n kubernetes-talk

# Try to make a request. Why does it work? 
curl kubernetes-talk.k8s.paretoquantic.com

# Get Ingress Controller address
kubectl get service -n default
```
