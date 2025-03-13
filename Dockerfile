# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run prisma:generate

CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --production

COPY . .

RUN npm run prisma:generate
RUN npm run build

CMD ["npm", "start"]