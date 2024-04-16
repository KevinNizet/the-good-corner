FROM node:18-alpine3.17
WORKDIR /app

COPY package.json package.json
RUN npm install

COPY src src
COPY tgc.sqlite tgc.sqlite
COPY tsconfig.json tsconfig.json

CMD npm start
