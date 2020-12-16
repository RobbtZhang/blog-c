FROM nginx
LABEL name="blog-c"
LABEL version="1.0"
COPY ./dist /usr/share/nginx/html
COPY ./vue-front.conf /etc/nginx/conf.d
EXPOSE 80
