FROM node:16 as builder

# Create app directory
WORKDIR /usr/src/app

# Dependencies

COPY ./ ./usr/src/app/

EXPOSE 8080
CMD [ "yarn", "start" ]