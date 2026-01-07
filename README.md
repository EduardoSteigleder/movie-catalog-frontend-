# Catálogo de Filmes Frontend

Frontend do projeto **Catálogo de Filmes**, desenvolvido em **Vue.js** com **Vite**, consumindo a API do backend via proxy.

Este serviço é responsável pela interface de busca de filmes e gerenciamento de favoritos.

---

## 🚀 Executar o Frontend

> Antes de iniciar o frontend, certifique-se de que o **Backend já esteja rodando**.

Na raiz do projeto, execute os comandos abaixo:

```
bash
docker build -t catalogo-filmes-frontend .
docker run -d --name catalogo-filmes-frontend --network backend_default -p 5173:5173 catalogo-filmes-frontend
```
Aplicação frontend desenvolvida como SPA (Single Page Application), responsável pela interface do usuário e consumo da API do backend.

## Tecnologias utilizadas

- Vue.js 3
- JavaScript
- Vite
- Axios
- Vue Router
- Pinia

## Estrutura do projeto
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
└── vite.config.js
```
## Funcionalidades

- Interface para busca de filmes
- Listagem de resultados
- Exibição de informações básicas
- Gerenciamento visual de favoritos
- Comunicação com backend via API REST

## Como executar

1. Acesse a pasta frontend
2. Execute npm install
3. Execute npm run dev

O frontend ficará disponível em http://127.0.0.1:5173

O backend deve estar em execução para funcionamento completo da aplicação.
