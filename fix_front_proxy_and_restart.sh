#!/usr/bin/env bash
set -e

# Rode na pasta do FRONTEND (onde está o Dockerfile do front)

FRONT_CONTAINER="${FRONT_CONTAINER:-catalogo-filmes-frontend}"
FRONT_IMAGE="${FRONT_IMAGE:-catalogo-filmes-frontend}"
NETWORK_NAME="${NETWORK_NAME:-backend_default}"

echo "== 0) Containers atuais =="
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"

echo
echo "== 1) Ajuste obrigatório no proxy do Vite =="
echo "Abra vite.config.(js|ts) e deixe o target assim:"
cat <<'CFG'
proxy: {
  "/api": {
    target: "http://catalogo-filmes-backend:8000",
    changeOrigin: true,
  },
},
CFG

echo
echo "== 2) Rebuild da imagem do front =="
docker build -t "$FRONT_IMAGE" .

echo
echo "== 3) Remover container antigo (se existir) =="
docker rm -f "$FRONT_CONTAINER" >/dev/null 2>&1 || true

echo
echo "== 4) Subir front na rede do backend =="
docker run -d --name "$FRONT_CONTAINER" --network "$NETWORK_NAME" -p 5173:5173 "$FRONT_IMAGE"

echo
echo "== 5) Logs do front (últimas 50 linhas) =="
docker logs --tail=50 "$FRONT_CONTAINER" || true

echo
echo "Pronto:"
echo "- Front: http://localhost:5173"
echo "- Back:  http://localhost:8000"
