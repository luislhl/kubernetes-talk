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

# Port Forward
kubectl port-forward deployment/kubernetes-talk 3000:3000 -n kubernetes-talk

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

# Port Forward
kubectl port-forward deployment/kubernetes-talk 3000:3000 -n kubernetes-talk

# Make request to the deployment
curl localhost:3000
```


# TODO: Nova versão do app que falha propositalmente após X segundos, e configuração do liveness probe
# TODO Configuração de um service que vai expor o app publicamente
