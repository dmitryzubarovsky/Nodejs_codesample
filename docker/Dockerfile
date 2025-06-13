FROM node:16-alpine@sha256:f21f35732964a96306a84a8c4b5a829f6d3a0c5163237ff4b6b8b34f8d70064b
#ARG NODE_ENV=production
ENV PORT=3000
RUN apk add --no-cache busybox-extras
WORKDIR /opt/app
RUN chown -R node:node /opt/app
USER node
COPY --chown=node:node package*.json ./
RUN npm ci
#RUN npm ci --only=production
COPY --chown=node:node . .
RUN npm run build
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]
