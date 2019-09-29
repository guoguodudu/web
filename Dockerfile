# stage: 1
FROM node:alpine as react-build
WORKDIR /fortunefintechfrontend

COPY package.json /tmp/package.json


RUN npm config set registry https://registry.npm.taobao.org && cd /tmp && npm install --production

RUN cp -a /tmp/node_modules /fortunefintechfrontend/

# RUN yarn cache clean
# RUN yarn --no-cache

COPY . ./

RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine
#更改容器时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --chown=www-data:www-data --from=react-build /fortunefintechfrontend/build /usr/share/nginx/html
COPY --from=react-build /fortunefintechfrontend/build /usr/share/nginx/html
RUN chmod -R o+r /usr/share/nginx/html
EXPOSE 3060
CMD ["nginx", "-g", "daemon off;"]