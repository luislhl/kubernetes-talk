aws ecr get-login-password \
    --region us-east-1 \
| sudo docker login \
    --username AWS \
    --password-stdin 702141274116.dkr.ecr.us-east-1.amazonaws.com

sudo docker build -t 702141274116.dkr.ecr.us-east-1.amazonaws.com/kubernetes-talk:v2 .
sudo docker push 702141274116.dkr.ecr.us-east-1.amazonaws.com/kubernetes-talk:v2
