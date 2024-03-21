FROM node:16-alpine as builder

WORKDIR /app
COPY / /app

ENV VITE_API_URL=https://api.example.com
ENV VITE_SENTRY_URL=https://sentry.example.com
ENV VITE_SENTRY_DISABLED=0
ENV VITE_SENTRY_ENVIORNMENT=production

RUN yarn install
RUN yarn build

FROM httpd
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/
COPY --from=builder /app/.htaccess /usr/local/apache2/htdocs/.htaccess
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/AllowOverride None/AllowOverride ALL/g'  /usr/local/apache2/conf/httpd.conf

CMD sed -i "s#REPLACE_ME_API_URL#${VITE_API_URL}#g" ./htdocs/index.html; sed -i "s#REPLACE_ME_SENTRY_URL#${VITE_SENTRY_URL}#g" ./htdocs/index.html; sed -i "s#REPLACE_ME_SENTRY_DISABLED#${VITE_SENTRY_DISABLED}#g" ./htdocs/index.html; sed -i "s#REPLACE_ME_SENTRY_ENVIORNMENT#${VITE_SENTRY_ENVIORNMENT}#g" ./htdocs/index.html; exec httpd-foreground

