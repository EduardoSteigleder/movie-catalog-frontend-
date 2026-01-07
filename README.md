# 🎬 Catálogo de Filmes — Frontend

Frontend da aplicação **Catálogo de Filmes**, desenvolvido em **Vue.js 3** com **Vite**, consumindo uma **API REST** do backend via proxy.

Este projeto é responsável pela interface de busca de filmes, exibição de resultados e gerenciamento visual de favoritos.

---

## 🚀 Executar o Frontend (Docker Compose)

> Antes de iniciar o frontend, certifique-se de que o **Backend já esteja rodando**.

Na raiz do projeto frontend, execute:

docker-compose up -d

A aplicação ficará disponível em:
http://127.0.0.1:5173

---

## ⚙️ Executar em modo desenvolvimento (sem Docker)

1. Acesse a pasta frontend  
2. Instale as dependências  
3. Inicie o servidor de desenvolvimento  

Comandos:

npm install  
npm run dev  

A aplicação ficará disponível em:
http://127.0.0.1:5173

---

## 🚀 Tecnologias utilizadas

- Vue.js 3
- JavaScript
- Vite
- Axios
- Vue Router
- Pinia
- Docker
- Docker Compose

---

## 📁 Estrutura do projeto
```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── router/
│   ├── services/
│   ├── store/
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
├── Dockerfile
└── docker-compose.yml
```
---

## ⭐ Funcionalidades

- Interface para busca de filmes
- Listagem de resultados
- Exibição de informações básicas
- Gerenciamento visual de favoritos
- Comunicação com backend via API REST

---

## 📌 Observações

- O backend deve estar em execução para o funcionamento completo da aplicação
- Este frontend consome uma API desenvolvida em Laravel (repositório separado)

---

## 🔗 Repositório

https://github.com/EduardoSteigleder/catalogo-filmes-frontend
