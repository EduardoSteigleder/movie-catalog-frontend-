import { defineStore } from 'pinia'
import { http } from '../api/http'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchFavorites() {
      this.loading = true
      this.error = null
      try {
        const res = await http.get('/favorites')
        this.items = res.data?.data ?? res.data ?? []
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao carregar favoritos'
      } finally {
        this.loading = false
      }
    },

    async addFavorite(movie) {
      this.error = null
      try {
        await http.post('/favorites', {
          tmdb_id: movie.tmdb_id,
          title: movie.title,
          poster_path: movie.poster_path ?? null,
          genre_ids: movie.genre_ids ?? null,
          release_date: movie.release_date ?? null
        })
        await this.fetchFavorites()
        return { ok: true }
      } catch (e) {
        const msg = e?.response?.data?.message || 'Erro ao adicionar favorito'
        return { ok: false, message: msg, status: e?.response?.status }
      }
    },

    async removeFavorite(id) {
      this.error = null
      try {
        await http.delete(`/favorites/${id}`)
        await this.fetchFavorites()
        return { ok: true }
      } catch (e) {
        const msg = e?.response?.data?.message || 'Erro ao remover favorito'
        return { ok: false, message: msg, status: e?.response?.status }
      }
    }
  }
})
