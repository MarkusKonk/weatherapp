FROM reidweb1/node-typescript:1.0.0

WORKDIR /app

ADD ./app /app
COPY package.json package.json

EXPOSE 3000

RUN npm install 

CMD ["cd", "app"]

RUN tsc