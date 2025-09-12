import { defineStore } from 'pinia'
import axios from 'axios'

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    cards: [],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchCards(page = 1) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`http://localhost:3001/api/cards?page=${page}`)
        this.cards = res.data
      } catch (err) {
        this.error = 'Error al cargar las cartas'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
})
