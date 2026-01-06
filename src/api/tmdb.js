import { http } from './http'

export async function searchMovies(query) {
  const res = await http.get('/tmdb/search', {
    params: { query }
  })
  return res.data
}
