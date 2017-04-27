# OWASP Juice Shop - An intentionally insecure Javascript Web Application
FROM            node:6-alpine
MAINTAINER      Bjoern Kimminich <bjoern.kimminich@owasp.org>
LABEL version = "2.26.0"

RUN apk update && apk add git

COPY . /juice-shop
WORKDIR /juice-shop
RUN npm install --production --unsafe-perm

ENV NODE_ENV=iteratec

EXPOSE 3000 1337
CMD ["npm", "start"]
