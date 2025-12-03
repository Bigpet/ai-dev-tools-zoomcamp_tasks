#!/bin/bash

docker build --build-arg BACKEND_URL=http://your-domain.com -f Containerfile .
