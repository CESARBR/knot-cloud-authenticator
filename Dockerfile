FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build
RUN npm prune --production

ENV NODE_ENV=production
CMD [ "npm", "start" ]
