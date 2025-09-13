<template>
  <section>
    <SearchFilters
      v-model="searchQuery"
      @search="onSearch"
      placeholder="Buscar cartas..."
    />

    <div v-if="cardStore.loading" aria-busy="true">Cargando...</div>
    <div v-if="cardStore.error" role="alert">{{ cardStore.error }}</div>

    <CardGrid v-if="!cardStore.loading && !cardStore.error" :cards="filteredCards" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCardStore } from '@stores/cards'
import SearchFilters from '@components/SearchFilters.vue'
import CardGrid from '@components/CardGrid.vue'

const cardStore = useCardStore()
const searchQuery = ref('')

onMounted(async () => {
  await cardStore.fetchCards(1)
})

const filteredCards = computed(() => {
  if (!searchQuery.value) return cardStore.cards
  return cardStore.cards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function onSearch(query: string) {
  console.log('Buscar:', query)
}
</script>
