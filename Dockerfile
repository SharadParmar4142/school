FROM node:21-alpine3.18

WORKDIR /app

COPY . .

COPY .env .env

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
