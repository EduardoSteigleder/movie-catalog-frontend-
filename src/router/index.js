import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import FavoritesView from '../views/FavoritesView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'search', component: SearchView },
    { path: '/favorites', name: 'favorites', component: FavoritesView }
  ]
})
