FROM node:22-slim AS build

WORKDIR /app
COPY package*.json nx.json ./
RUN npm install --verbose
COPY . .

# Build both apps
RUN npx nx build node-api --configuration=production
RUN npx nx build angular --configuration=production
# Final image for Heroku
FROM nginx:alpine
WORKDIR /app

# Copy backend app
COPY --from=build /app/dist/apps/server ./dist
COPY --from=build /app/package*.json ./
RUN apk add --update nodejs npm && npm install --production

# Copy frontend app
COPY --from=build /app/dist/apps/client/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script to start both Node.js and Nginx
COPY start.sh .
RUN chmod +x start.sh

# Use port provided by Heroku
EXPOSE $PORT

# Start both services
CMD ["./start.sh"]
