FROM node:16.16.0 AS build

WORKDIR /build

COPY . .

RUN apt-get update && apt-get install -y telnet net-tools dnsutils curl &&\
    npm i -g @nestjs/cli &&\
    yarn install &&\
    yarn build

## Runtime env
FROM node:16.16.0 AS runtime

ARG CACHEBUST=1

ARG SRV_DIR=/srv/posterr
WORKDIR $SRV_DIR

ARG NODE_AUTH_TOKEN
ENV NODE_APP_INSTANCE=aws
ENV NODE_PATH=dist/src
ENV PORT=22200

RUN apt-get update && apt-get install -y telnet net-tools dnsutils curl

RUN groupadd -g 2000 appuser &&\
    useradd -r -u 2000 -g appuser  appuser

COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist ./dist
#COPY --from=build /build/migrations ./migrations
#COPY --from=build /build/seeders ./seeders
COPY --from=build /build/package.json .
COPY --from=build /build/yarn.lock .
#COPY --from=build /build/sequelize-config.js ./sequelize-config.js

RUN chown -R appuser:appuser $SRV_DIR

EXPOSE ${PORT}

CMD ["yarn", "start:prod"]
