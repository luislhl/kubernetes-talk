FROM node:12-alpine

ADD package.json .

RUN npm install

ADD index.js .

EXPOSE 3000
ENTRYPOINT node index.js
