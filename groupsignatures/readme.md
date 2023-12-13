Go to server
## build docker
docker build -t groupsignature-server .

## run docker
docker run -d -p 5000:5000 groupsignature-server