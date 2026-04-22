FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/Dockerfile.deploy \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/.gitignore
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
