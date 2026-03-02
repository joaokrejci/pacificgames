FROM openjdk:25-rc-jdk-slim

ENV DIR=/nim-server

COPY app $DIR/app
COPY gradle $DIR/gradle
COPY gradle.properties $DIR/gradle.properties
COPY gradlew $DIR/gradlew
COPY settings.gradle $DIR/settings.gradle

RUN << EOF 
    cd ${DIR} 
    ./gradlew distTar 
    mkdir dist 
    tar -xf app/build/distributions/app.tar -C ./dist
EOF

CMD ["sh", "/nim-server/dist/app/bin/app"]