FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g yarn

RUN yarn

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "start:dev" ]
