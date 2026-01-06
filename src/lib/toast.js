import { reactive } from 'vue'

const state = reactive({
  visible: false,
  message: '',
  type: 'success',
  _t: null
})

function toast(message, type = 'success', ms = 2200) {
  state.message = message
  state.type = type
  state.visible = true

  if (state._t) clearTimeout(state._t)
  state._t = setTimeout(() => {
    state.visible = false
  }, ms)
}

export function useToast() {
  return { state, toast }
}
