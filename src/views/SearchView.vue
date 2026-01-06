<template>
  <section class="wrap">
    <h1 class="title">Buscar filmes</h1>

    <form class="search" @submit.prevent="onSearch">
      <input class="input" v-model.trim="query" placeholder="Digite o nome do filme" />
      <button class="btn" :disabled="loading || query.length < 2">Pesquisar</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="loading" class="muted">Carregando…</div>

    <div class="grid" v-if="results.length">
      <article v-for="m in results" :key="m.id" class="card">
        <img v-if="m.poster_path" class="poster" :src="posterUrl(m.poster_path)" :alt="m.title" />
        <div class="info">
          <div class="row">
            <h3 class="name">{{ m.title }}</h3>
            <span class="year">{{ year(m.release_date) }}</span>
          </div>

          <p class="overview">{{ m.overview }}</p>

          <div class="actions">
            <template v-if="store.hasTmdb(m.id)">
              <span class="muted">Já está nos favoritos ⭐</span>
            </template>

            <template v-else>
              <button class="btn" @click="fav(m)" :disabled="favLoading">Favoritar</button>
              <span v-if="msgById[m.id]" class="muted">{{ msgById[m.id] }}</span>
            </template>
          </div>
        </div>
      </article>
    </div>

    <p v-else-if="searched && !loading" class="muted">Nenhum resultado</p>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { http } from '../api/http'
import { useFavoritesStore } from '../stores/favorites'

const store = useFavoritesStore()

const query = ref('')
const results = ref([])
const loading = ref(false)
const error = ref(null)
const searched = ref(false)
const favLoading = ref(false)
const msgById = reactive({})

onMounted(async () => {
  await store.fetchFavorites()
})

function posterUrl(path) {
  return `https://image.tmdb.org/t/p/w342${path}`
}

function year(dateStr) {
  if (!dateStr) return ''
  return String(dateStr).slice(0, 4)
}

async function onSearch() {
  error.value = null
  results.value = []
  searched.value = true
  loading.value = true

  try {
    const res = await http.get('/tmdb/search', { params: { query: query.value } })
    results.value = res.data?.results ?? []
  } catch (e) {
    error.value = e?.response?.data?.message || 'Erro ao pesquisar'
  } finally {
    loading.value = false
  }
}

async function fav(movie) {
  if (store.hasTmdb(movie.id)) {
    msgById[movie.id] = 'Já está nos favoritos'
    return
  }

  favLoading.value = true
  msgById[movie.id] = ''

  const genreIdsStr = Array.isArray(movie.genre_ids) && movie.genre_ids.length
    ? movie.genre_ids.join(',')
    : null

  const r = await store.addFavorite({
    tmdb_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    genre_ids: genreIdsStr,
    release_date: movie.release_date ?? null
  })

  msgById[movie.id] = r.ok ? 'Adicionado' : (r.message || 'Falhou')
  favLoading.value = false
}
</script>

<style scoped>
.wrap { display: flex; flex-direction: column; gap: 12px; }
.title { font-size: 22px; margin: 0; }
.search { display: flex; gap: 10px; align-items: center; }
.input { flex: 1; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: transparent; color: inherit; }
.btn { padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.06); color: inherit; cursor: pointer; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.error { color: #ffb4b4; }
.muted { opacity: 0.75; }
.grid { display: flex; flex-direction: column; gap: 12px; }
.card { display: grid; grid-template-columns: 120px 1fr; gap: 12px; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; overflow: hidden; }
.poster { width: 120px; height: 180px; object-fit: cover; background: rgba(255,255,255,0.06); }
.info { padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
.row { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
.name { margin: 0; font-size: 16px; }
.year { opacity: 0.7; font-size: 13px; }
.overview { margin: 0; opacity: 0.8; font-size: 13px; line-height: 1.35; max-height: 3.9em; overflow: hidden; }
.actions { display: flex; align-items: center; gap: 10px; }
</style>

