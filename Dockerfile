FROM node:16-alpine as builder

WORKDIR /app
COPY / /app

RUN yarn install
RUN yarn build

FROM httpd
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/
COPY --from=builder /app/.htaccess /usr/local/apache2/htdocs/.htaccess
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/AllowOverride None/AllowOverride ALL/g'  /usr/local/apache2/conf/httpd.conf