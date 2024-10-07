FROM node:20-alpine

# Create app directory
RUN mkdir -p /app && chown node:node /app
USER node
WORKDIR /app

# Install dependencies
COPY --chown=node:node package*.json ./

# Bundle app source
COPY --chown=node:node index.js index.js

# Exports
EXPOSE 8080
CMD [ "node", "index.js" ]
