FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4201

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4201"]
