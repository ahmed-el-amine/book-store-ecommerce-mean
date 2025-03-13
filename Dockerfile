FROM node:22-slim AS build

WORKDIR /app
COPY package*.json nx.json ./
RUN npm install

COPY . .
# Build only the backend app
RUN npx nx build node-api --configuration=production

# Final image - lightweight Node.js runtime
FROM node:18-alpine
WORKDIR /app

# Copy only the backend build and package files
COPY --from=build /app/dist/apps/server ./dist
COPY --from=build /app/package*.json ./

# Install production dependencies only
RUN npm install --production

# Add a health check endpoint
RUN echo 'app.get("/health", (req, res) => res.status(200).send("OK"));' >> ./dist/main.js

# Expose the port that the backend listens on
ENV PORT=3000
EXPOSE $PORT

# Start the backend
CMD node dist/main.js
