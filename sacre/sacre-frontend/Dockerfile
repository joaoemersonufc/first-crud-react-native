FROM docker-nexus.uds.com.br/node:12.16-alpine as builder
ARG API_HOST
ENV API_URL=${API_HOST}
RUN apk --no-cache add git
WORKDIR /opt/react-skeleton
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./template.production.html ./template.production.html
COPY ./tsconfig.json ./tsconfig.json
COPY ./webpack.production.js ./webpack.production.js
RUN echo $API_HOST
RUN export API_URL=$API_HOST
RUN echo $API_URL
RUN npm i
RUN npm run build

FROM docker-nexus.uds.com.br/nginx:alpine
COPY --from=builder /opt/react-skeleton/public /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf