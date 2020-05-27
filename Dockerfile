FROM node:latest
RUN mkdir server
WORKDIR /server

COPY main.js /server/
RUN mkdir files
COPY files /server/files/
COPY package.json /server/
COPY package-lock.json /server/

RUN npm install
EXPOSE 80 443
CMD npm start
