FROM node:20-alpine

WORKDIR /app

# Install the lightweight static server
RUN npm install -g serve

# We already built the optimized dist folder locally, so just copy it in!
COPY dist ./dist

EXPOSE 5173

# Serve it perfectly in production mode
CMD ["serve", "-s", "dist", "-l", "5173"]
