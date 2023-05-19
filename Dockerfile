FROM 'node':18.16.0
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

CMD yarn start
