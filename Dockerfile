FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

COPY package*.json ./

# Instala as dependências e garante que o @prisma/client esteja presente
RUN npm install && npm install @prisma/client

# Copia a pasta prisma
COPY prisma ./prisma/

# Gera o cliente, mas forçando o uso do engine para a plataforma correta
RUN npx prisma generate

COPY . .

EXPOSE 5000
CMD ["node", "app.js"]