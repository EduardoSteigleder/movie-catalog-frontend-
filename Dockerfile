# Frontend (Vue + Vite) - dev server
FROM node:20-alpine

WORKDIR /app

# Instala dependências primeiro (melhor cache)
COPY package*.json ./
RUN npm ci

# Copia o restante
COPY . .

EXPOSE 5173

CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]
