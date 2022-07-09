FROM node:15-alpine3.10 as build
#ENV NODE_ENV production
LABEL version="1.0"
LABEL description="This is the base docker image for prod nodejs app."
WORKDIR /fileshare-docker
COPY . /fileshare-docker
#RUN npm install -g npm@8.3.1
#RUN apk --no-cache add --virtual builds-deps build-base python
#RUN npm i bcrypt --unsafe-perm=true --allow-root --save
RUN npm install
CMD npm run start