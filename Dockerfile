FROM node:16-alpine
WORKDIR /usr/src/bot
COPY . . 
RUN npm install && npm run build
CMD ["node", "./dist/index.js"]