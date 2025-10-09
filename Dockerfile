FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm instal

COPY . .


CMD ["node", "index.js"]