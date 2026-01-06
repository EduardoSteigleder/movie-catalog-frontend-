import { defineStore } from 'pinia'
import { http } from '../api/http'
import { useToast } from '../lib/toast'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    genre: ''
  }),

  getters: {
    hasTmdb(state) {
      const set = new Set((state.items || []).map(i => i.tmdb_id))
      return (tmdbId) => set.has(tmdbId)
    }
  },

  actions: {
    async fetchFavorites() {
      this.loading = true
      this.error = null
      try {
        const params = {}
        if (this.genre) params.genre = this.genre
        const res = await http.get('/favorites', { params })
        this.items = res.data?.data ?? res.data ?? []
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao carregar favoritos'
        const { toast } = useToast()
        toast(this.error, 'error')
      } finally {
        this.loading = false
      }
    },

    async addFavorite(movie) {
      this.error = null
      const { toast } = useToast()

      try {
        await http.post('/favorites', {
          tmdb_id: movie.tmdb_id,
          title: movie.title,
          poster_path: movie.poster_path ?? null,
          genre_ids: movie.genre_ids ?? [],
          release_date: movie.release_date ?? null
        })

        await this.fetchFavorites()
        toast('Filme favoritado com sucesso', 'success')
        return { ok: true }
      } catch (e) {
        const msg = e?.response?.data?.message || 'Erro ao adicionar favorito'
        toast(msg, 'error')
        return { ok: false, message: msg, status: e?.response?.status }
      }
    },

    async removeFavorite(id) {
      this.error = null
      const { toast } = useToast()

      try {
        await http.delete(`/favorites/${id}`)
        await this.fetchFavorites()
        toast('Filme removido com sucesso', 'success')
        return { ok: true }
      } catch (e) {
        const msg = e?.response?.data?.message || 'Erro ao remover favorito'
        toast(msg, 'error')
        return { ok: false, message: msg, status: e?.response?.status }
      }
    },

    setGenre(value) {
      this.genre = value
    }
  }
})
