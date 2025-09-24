<template>
  <section v-if="card" class="card-detail">
    <div class="card-image">
      <img :src="card.image_url" :alt="card.name" />
    </div>
    <div class="card-info">
      <h2>{{ card.name }} ({{ card.card_number }})</h2>
      <ul>
        <li><strong>DP:</strong> {{ card.dp ?? 'N/A' }}</li>
        <li><strong>Tipo de carta:</strong> {{ card.card_type }}</li>
        <li><strong>Rareza:</strong> {{ card.rarity }}</li>
        <li>
          <strong>Colores:</strong>
          {{ card.color_one }}
          <span v-if="card.color_two">, {{ card.color_two }}</span>
          <span v-if="card.color_three">, {{ card.color_three }}</span>
        </li>
        <li><strong>Coste:</strong> {{ card.cost ?? 'N/A' }}</li>
        <li><strong>Etapa:</strong> {{ card.stage ?? 'N/A' }}</li>
        <li><strong>Atributo:</strong> {{ card.attribute ?? 'N/A' }}</li>
        <li>
          <strong>Tipos:</strong> {{ card.type_one }}
          <span v-if="card.type_two">, {{ card.type_two }}</span>
        </li>
        <li><strong>Efecto:</strong> {{ card.effect ?? 'N/A' }}</li>
        <li><strong>Efecto de evolución:</strong> {{ card.evolution_effect ?? 'N/A' }}</li>
        <li><strong>Efecto de seguridad:</strong> {{ card.security_effect ?? 'N/A' }}</li>
        <li><strong>BT:</strong> {{ card.bt_abbreviation }}</li>
        <li><strong>Alternativa:</strong> {{ card.alternative ? 'Sí' : 'No' }}</li>
      </ul>
    </div>
  </section>

  <p v-else>Cargando carta...</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCardInfoStore } from '@/stores/cardInfoStore';
import type { CardInfo } from '@/types/cardsType';

const route = useRoute();
const cardNumber = route.params.cardnumber as string;
const store = useCardInfoStore();

const card = ref<CardInfo | null>(null);

onMounted(async () => {
  try {
    card.value = await store.fetchCard(cardNumber);
  } catch (error) {
    console.error('No se pudo cargar la carta:', error);
  }
});
</script>

<style scoped>
.card-detail {
  display: flex;
  gap: 2rem;
  background-color: var(--color-bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.card-image img {
  max-width: 300px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.card-info {
  flex: 1;
  min-width: 250px;
}

.card-info h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card-info ul {
  list-style: none;
  padding: 0;
}

.card-info li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
}

.card-info li strong {
  color: var(--color-text-alt);
}

/* Media query para pantallas estrechas */
@media (max-width: 768px) {
  .card-detail {
    flex-direction: column;
    align-items: center;
  }

  .card-image img {
    max-width: 100%;
  }

  .card-info {
    width: 100%;
    min-width: unset;
    margin-top: 1rem;
  }
}
</style>
