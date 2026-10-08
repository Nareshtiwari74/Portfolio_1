FROM node:22-alpine

WORKDIR /app

# copy package files first (for caching)
COPY package*.json ./

# install production dependencies
RUN npm ci --omit=dev --ignore-scripts

# copy rest of code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

