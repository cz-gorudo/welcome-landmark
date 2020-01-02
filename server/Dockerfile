FROM node:alpine

WORKDIR /opt/app

RUN npm install nodemon -g

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE  8000

CMD ["npm", "run", "server"]