FROM node:22-alpine

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run migrate

CMD ["npm", "start"]
