#!/bin/sh

set -eux

: "setup constant variables" && {
  ROOT_DIR=$(pwd)
  PROJECT_NAME=$(basename $ROOT_DIR)
  CONTAINER_NAME="ryoikarashi"
}

: "download latest docker image" && {
  docker-compose -f docker-compose.development.yml pull
  docker-compose -f docker-compose.proxy.development.yml pull
}

: "build docker image if docker container is NOT created yet" && {
  docker ps -a | grep $CONTAINER_NAME > /dev/null || {
    docker-compose -f docker-compose.development.yml build
    docker-compose -f docker-compose.proxy.development.yml build
  }
}

: "start docker container" && {
  docker-compose -f docker-compose.development.yml up -d
  docker-compose -f docker-compose.proxy.development.yml up -d
}

: "start tmuxinator" && {
  mkdir -p $HOME/.tmuxinator
  cp $ROOT_DIR/tmuxinator.yml $HOME/.tmuxinator/$PROJECT_NAME.yml
  bash -c "sleep 5 && rm -f $HOME/.tmuxinator/$PROJECT_NAME.yml" &
  tmuxinator start $PROJECT_NAME
}
