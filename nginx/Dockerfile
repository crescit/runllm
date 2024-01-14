# Use the official Nginx base image
FROM nginx:latest

# Copy your Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy your self-signed certificate and private key
COPY localhost.crt /etc/nginx/localhost.crt
COPY localhost.key /etc/nginx/localhost.key

# Expose ports
EXPOSE 80
EXPOSE 443