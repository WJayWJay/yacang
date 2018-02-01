FROM nginx:alpine
# author
LABEL author="434788303@qq.com"

# ssh
RUN mkdir /var/run/sshd -p
EXPOSE 8899
COPY dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
ENV SERVER_IP 121.8.160.34
CMD echo $SERVER_IP yacang.server>>/etc/hosts && nginx -g "daemon off;"

