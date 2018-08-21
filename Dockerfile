FROM node:8.11.3

RUN mkdir /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN apt-get update && apt-get install apt-transport-https -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install openvpn \
                    yarn \
                    -y
RUN yarn global add pm2 && yarn
RUN yarn build:prod

CMD ["pm2-docker", "start", "ecosystem.json"]
