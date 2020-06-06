FROM node:latest
WORKDIR /usr/src/app
# install dependencies here so rebuild later is faster
COPY package.json .
RUN npm install
COPY . .
ENV PORT=8000
EXPOSE ${PORT}
CMD [ "npm", "start" ]
