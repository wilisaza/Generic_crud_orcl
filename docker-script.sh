#!/bin/sh

#Stop running container
docker stop $(docker ps -a -q  --filter ancestor=rest/orcl_rest)

# Build container
docker build -t rest/orcl_rest .

# Run container
docker run -p 5400:5400 -d rest/orcl_rest