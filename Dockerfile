FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN mkdir -p /storage/images

EXPOSE 5000
CMD ["npm", "start"]