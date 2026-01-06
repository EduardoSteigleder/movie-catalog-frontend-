<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div>Catálogo de Filmes</div>
        <span class="khtag">Teste Técnico</span>
      </div>

      <nav class="nav">
        <RouterLink to="/">Buscar</RouterLink>
        <RouterLink to="/favorites">Favoritos</RouterLink>
      </nav>
    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>

  <div v-if="toastState.visible" class="toast" :class="toastState.type">
    {{ toastState.message }}
  </div>
</template>

<script setup>
import { useToast } from './lib/toast'

const { state: toastState } = useToast()
</script>

<style scoped>
.toast{
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(10px);
  color: rgba(255,255,255,.92);
  font-weight: 700;
  z-index: 9999;
  box-shadow: 0 18px 40px rgba(0,0,0,.35);
  max-width: min(720px, 92vw);
  text-align: center;
}

.toast.success{
  border-color: rgba(34,197,94,.35);
  background: rgba(34,197,94,.14);
}

.toast.error{
  border-color: rgba(239,68,68,.35);
  background: rgba(239,68,68,.14);
}
</style>
