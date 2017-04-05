# OWASP Juice Shop - An intentionally insecure Javascript Web Application
FROM            node:6
MAINTAINER      Bjoern Kimminich <bjoern.kimminich@owasp.org>
LABEL version = "2.25.0"

COPY . /juice-shop
WORKDIR /juice-shop

RUN npm install --production --unsafe-perm

ENV NODE_ENV iteratec

EXPOSE  3000 1337
CMD ["npm", "start"]
