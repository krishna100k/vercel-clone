FROM ubuntu:focal

RUN apt-get update

RUN apt-get install -y curl git

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get upgrade -y && \
    apt-get install -y nodejs

WORKDIR /home/app

COPY package*.json ./
RUN npm install

RUN npm install -g typescript

COPY main.sh main.sh
COPY script.ts script.ts

RUN npx tsc

RUN chmod +x main.sh
RUN chmod +x script.js

# Set entrypoint script
ENTRYPOINT [ "/home/app/main.sh" ]
