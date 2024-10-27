FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

CMD ["./wait-for-it.sh", "postgres:5432", "--", "./wait-for-it.sh", "rabbitmq:5672","--", "npm", "run", "start"]
