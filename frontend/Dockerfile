FROM worleydl/nginx-grunt:v1

# Copy source to nginx host
ADD . /code
WORKDIR /code

# Get deps
RUN npm install
RUN bower --allow-root install -g

# Build the app
RUN grunt build:dist

RUN rm -rf /usr/share/nginx/html/*
RUN cp -r dist/* /usr/share/nginx/html/.

# Start nginx
CMD /code/srv.sh 
