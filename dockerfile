FROM node:18-alpine

WORKDIR /usr/src/app

# copia somente package para instalar dependências antes (cache)
COPY package*.json ./
RUN npm install --production

# copia restante
COPY . .

EXPOSE 3000
CMD ["node","server.js"]