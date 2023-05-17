FROM 'node':18.16.0
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .

CMD yarn start
