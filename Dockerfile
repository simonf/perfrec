FROM node:alpine
RUN apk add sqlite
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Bundle app source
COPY . /usr/src/app
# Install app dependencies
RUN npm install
EXPOSE 8081
CMD [ "npm", "start" ]
