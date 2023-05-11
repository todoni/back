FROM alpine:3.17

WORKDIR /usr/app/src

RUN apk update && \
    apk add bash nodejs-lts npm && \
    npm install -g pm2 yarn
  
COPY package.json yarn.lock ./
RUN yarn

COPY . .

CMD ["yarn", "deploy:prod"]