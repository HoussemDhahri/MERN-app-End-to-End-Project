FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3500

EXPOSE 3500

CMD ["node", "index.js"]