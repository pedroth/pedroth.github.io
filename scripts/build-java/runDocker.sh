# Dockerfile here: https://hub.docker.com/repository/docker/pedroth/java-apps

xhost + && sudo docker run --rm -v /tmp/.X11-unix:/tmp/.X11-unix:ro -e DISPLAY=$DISPLAY -it pedroth/java-apps bash -c "java -cp ${jar} ${appName}"