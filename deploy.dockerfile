FROM node:16-alpine AS builder

RUN apk --no-cache add --virtual builds-deps build-base python3

WORKDIR /usr/src/app

COPY package* ./

# install dependencies
RUN npm install --silent

COPY . .

# build application
RUN npm run build

FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3001