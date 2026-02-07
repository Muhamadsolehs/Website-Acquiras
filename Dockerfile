FROM node:20

WORKDIR /app

COPY package*.json ./
COPY vite.config.* ./
COPY tsconfig.json ./
COPY . .

RUN npm install
RUN npm run build

EXPOSE 80

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]
