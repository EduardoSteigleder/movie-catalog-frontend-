<template>
  <section class="wrap">
    <h1 class="title">Favoritos</h1>

    <div class="toolbar">
      <select class="select" v-model="selectedGenre">
        <option value="">Todos</option>
        <option v-for="g in genreOptions" :key="g.id" :value="String(g.id)">
          {{ g.name }}
        </option>
      </select>

      <button class="btn" @click="applyFilter" :disabled="store.loading">Filtrar</button>
      <button class="btn" @click="clearFilter" :disabled="store.loading">Limpar</button>
    </div>

    <p v-if="store.error" class="error">{{ store.error }}</p>
    <div v-if="store.loading" class="muted">Carregando…</div>

    <div class="grid" v-if="filtered.length">
      <article v-for="m in filtered" :key="m.id" class="card">
        <img v-if="m.poster_path" class="poster" :src="posterUrl(m.poster_path)" :alt="m.title" />

        <div class="info">
          <div class="row">
            <h3 class="name">{{ m.title }}</h3>
            <span class="year">{{ year(m.release_date) }}</span>
          </div>

          <div class="meta">
            <span class="pill">TMDB: {{ m.tmdb_id }}</span>
            <span v-if="genreLabel(m)" class="pill">{{ genreLabel(m) }}</span>
          </div>

          <div class="actions">
            <button class="btn" @click="remove(m.id)" :disabled="removingId === m.id">Remover</button>
            <span v-if="msgById[m.id]" class="muted">{{ msgById[m.id] }}</span>
          </div>
        </div>
      </article>
    </div>

    <p v-else-if="loaded && !store.loading" class="muted">Nenhum favorito</p>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useFavoritesStore } from '../stores/favorites'

const store = useFavoritesStore()

const loaded = ref(false)
const removingId = ref(null)
const msgById = reactive({})

const selectedGenre = ref('')
const appliedGenre = ref('')

const GENRES = [
  { id: 28, name: 'Ação' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animação' },
  { id: 35, name: 'Comédia' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentário' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Família' },
  { id: 14, name: 'Fantasia' },
  { id: 36, name: 'História' },
  { id: 27, name: 'Terror' },
  { id: 10402, name: 'Música' },
  { id: 9648, name: 'Mistério' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ficção científica' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerra' },
  { id: 37, name: 'Faroeste' }
]

function posterUrl(path) {
  return `https://image.tmdb.org/t/p/w342${path}`
}

function year(dateStr) {
  if (!dateStr) return ''
  return String(dateStr).slice(0, 4)
}

function parseGenreIds(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  return String(value)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

function genreLabel(movie) {
  const ids = parseGenreIds(movie.genre_ids)
  if (!ids.length) return ''
  const names = ids
    .map(id => GENRES.find(g => String(g.id) === String(id))?.name)
    .filter(Boolean)
  return names.join(', ')
}

const genreOptions = computed(() => {
  const set = new Set()
  for (const m of store.items) {
    for (const id of parseGenreIds(m.genre_ids)) set.add(String(id))
  }

  return GENRES
    .filter(g => set.has(String(g.id)))
    .map(g => ({ id: g.id, name: g.name }))
})

const filtered = computed(() => {
  const g = appliedGenre.value
  if (!g) return store.items
  return store.items.filter(m => parseGenreIds(m.genre_ids).includes(String(g)))
})

function applyFilter() {
  appliedGenre.value = selectedGenre.value
}

function clearFilter() {
  selectedGenre.value = ''
  appliedGenre.value = ''
}

async function remove(id) {
  removingId.value = id
  msgById[id] = ''
  const r = await store.removeFavorite(id)
  msgById[id] = r.ok ? 'Removido com sucesso' : (r.message || 'Falhou')
  removingId.value = null
}

onMounted(async () => {
  await store.fetchFavorites()
  loaded.value = true
})
</script>

<style scoped>
.wrap { display: flex; flex-direction: column; gap: 12px; }
.title { font-size: 22px; margin: 0; }

.toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

.select {
  min-width: 180px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: inherit;
  outline: none;
}

.select option {
  background: #1f1f1f;
  color: #ffffff;
}

.btn {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: inherit;
  cursor: pointer;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.error { color: #ffb4b4; }
.muted { opacity: 0.75; }

.grid { display: flex; flex-direction: column; gap: 12px; }

.card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  overflow: hidden;
}

.poster { width: 120px; height: 180px; object-fit: cover; background: rgba(255,255,255,0.06); }

.info { padding: 10px 12px; display: flex; flex-direction: column; gap: 10px; }

.row { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }

.name { margin: 0; font-size: 16px; }
.year { opacity: 0.7; font-size: 13px; }

.meta { display: flex; gap: 8px; flex-wrap: wrap; }
.pill {
  padding: 5px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  font-size: 12px;
  opacity: 0.9;
}

.actions { display: flex; align-items: center; gap: 10px; }
</style>
