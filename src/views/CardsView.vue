<template>
  <section>
    <SearchFilters
      v-model="searchQuery"
      @search="onSearch"
      placeholder="Search cards..."
    />

    <div v-if="cardStore.loading" aria-busy="true">Loading...</div>
    <div v-if="cardStore.error" role="alert">{{ cardStore.error }}</div>

    <CardGrid
      v-if="!cardStore.loading && !cardStore.error"
      :cards="filteredCards"
      :clickable="true"
    />
  </section>
</template>

<script setup lang="ts">
// Imports
import { ref, computed, onMounted } from 'vue';
import { useCardStore } from '@stores/cardsStore';
import SearchFilters from '@components/SearchFilters.vue';
import CardGrid from '@components/CardGrid.vue';

// Define the type for search filters
interface FilterQuery {
  name: string;
  card_type: number | null;
  rarity: number | null;
  color_one: number | null;
  color_two: number | null;
  color_three: number | null;
  cost: number | null;
  stage: number | null;
  attribute: number | null;
  type_one: number | null;
  type_two: number | null;
  bt_abbreviation: number | null;
  alternative: boolean;
}

// Access the card store
const cardStore = useCardStore();

// Reactive search filter object
const searchQuery = ref<FilterQuery>({
  name: '',
  card_type: null,
  rarity: null,
  color_one: null,
  color_two: null,
  color_three: null,
  cost: null,
  stage: null,
  attribute: null,
  type_one: null,
  type_two: null,
  bt_abbreviation: null,
  alternative: false,
});

// Fetch cards when component mounts
onMounted(async () => {
  await cardStore.fetchCards();
});

// Computed list of cards filtered by searchQuery
const filteredCards = computed(() => {
  const selectedColors = [
    searchQuery.value.color_one,
    searchQuery.value.color_two,
    searchQuery.value.color_three,
  ].filter(Boolean);

  return cardStore.cards.filter((card) => {
    // Name filter
    const nameMatch = card.name.toLowerCase().includes(searchQuery.value.name.toLowerCase());

    // Colors filter: card must contain all selected colors
    const cardColors = [card.color_one, card.color_two, card.color_three].filter(Boolean);
    const colorsMatch = selectedColors.every((color) => cardColors.includes(color));

    // Other filters
    const cardTypeMatch = searchQuery.value.card_type ? card.card_type === searchQuery.value.card_type : true;
    const rarityMatch = searchQuery.value.rarity ? card.rarity === searchQuery.value.rarity : true;
    const costMatch = searchQuery.value.cost !== null ? card.cost === searchQuery.value.cost : true;
    const stageMatch = searchQuery.value.stage ? card.stage === searchQuery.value.stage : true;
    const attributeMatch = searchQuery.value.attribute ? card.attribute === searchQuery.value.attribute : true;
    const typeOneMatch = searchQuery.value.type_one ? card.type_one === searchQuery.value.type_one : true;
    const typeTwoMatch = searchQuery.value.type_two ? card.type_two === searchQuery.value.type_two : true;
    const btMatch = searchQuery.value.bt_abbreviation ? card.bt_abbreviation === searchQuery.value.bt_abbreviation : true;
    const altMatch = searchQuery.value.alternative === false ? card.alternative === false : true;

    // Return true only if all filters match
    return (
      nameMatch &&
      colorsMatch &&
      cardTypeMatch &&
      rarityMatch &&
      costMatch &&
      stageMatch &&
      attributeMatch &&
      typeOneMatch &&
      typeTwoMatch &&
      btMatch &&
      altMatch
    );
  });
});

// Handle search events emitted from SearchFilters
function onSearch(query: FilterQuery) {
  console.log('Applied filters:', query);
}
</script>
