FROM node:alpine
RUN apk add sqlite
RUN mkdir -p /usr/src/app/data
RUN mkdir -p /usr/src/app/config
WORKDIR /usr/src/app
# Bundle app source
COPY ./package*.json /usr/src/app/
COPY ./index.js /usr/src/app/
COPY ./credentials.js /usr/src/app/
COPY ./controllers /usr/src/app/controllers
COPY ./models /usr/src/app/models
COPY ./service /usr/src/app/service
COPY ./utils /usr/src/app/utils
COPY ./docs /usr/src/app/docs
COPY ./api /usr/src/app/api
VOLUME /usr/src/app/config
VOLUME /usr/src/app/data
# Install app dependencies
RUN npm install
EXPOSE 8091
CMD [ "npm", "start" ]
