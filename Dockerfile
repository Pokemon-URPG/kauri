FROM node:16
WORKDIR /usr/src/app
COPY . . 
RUN npm install && npm run build
CMD ["node", "./dist/index.js"]