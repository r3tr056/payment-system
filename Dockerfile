FROM node

WORKDIR /services/payment-system

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "start"]