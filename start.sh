#!/bin/sh
# This script starts both Nginx and Node.js

# Replace Heroku's dynamic port in Nginx config
sed -i "s/listen 80/listen $PORT/" /etc/nginx/conf.d/default.conf

# Start Node.js in background
cd /app && node dist/main.js &

# Start Nginx in foreground (keeps container running)
nginx -g 'daemon off;'
