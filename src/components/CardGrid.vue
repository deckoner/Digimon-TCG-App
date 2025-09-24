<template>
  <section class="cards-container">
    <article
      v-for="card in props.cards"
      :key="card.id"
      class="card"
      :class="{ clickable: props.clickable }"
      @click="props.clickable && goToCardDetail(card.card_number)"
    >
      <div v-if="card.alternative" class="alternative-badge">Alt</div>
      <img
        :src="lazySrc(card.image_url)"
        :data-src="card.image_url"
        :alt="card.name"
        class="lazy"
      />
      <p>{{ card.name }}</p>
      <p>({{ card.card_number }})</p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import LazyCard from '@/assets/LazyCard.webp';
import type { Card } from '@types/cards';

const props = defineProps<{ cards: Card[]; clickable?: boolean }>();
const router = useRouter();

const lazySrc = (src: string) => LazyCard;

function goToCardDetail(cardNumber: string) {
  // Si tiene un "_", quitar todo desde el "_" hacia el final
  const baseCardNumber = cardNumber.includes('_') ? cardNumber.split('_')[0] : cardNumber;

  router.push(`/card/${baseCardNumber}`);
}

function initLazyLoad() {
  const images = document.querySelectorAll('img.lazy') as NodeListOf<HTMLImageElement>;
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) img.src = img.dataset.src;
          img.classList.remove('lazy');
          obs.unobserve(img);
        }
      });
    },
    { rootMargin: '50px', threshold: 0.1 },
  );

  images.forEach((img) => observer.observe(img));
}

onMounted(() => nextTick(initLazyLoad));
watch(
  () => props.cards,
  () => nextTick(initLazyLoad),
);
</script>

<style scoped>
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
  justify-content: center;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-bg-card);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  flex: 1 1 calc(20% - 1rem);
  max-width: 250px;
  min-width: 190px;
  aspect-ratio: 2 / 3;
  padding: 0.5rem;
  padding-top: 0.7rem;
  overflow: hidden;
  position: relative;
}

.card.clickable {
  cursor: pointer;
}
.card.clickable:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
}

.card img {
  width: 100%;
  height: 80%;
  object-fit: contain;
  border-radius: 6px;
  flex-grow: 1;
}

.card p {
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: clamp(0.9rem, 1vw, 1.1rem);
  text-align: center;
  line-height: 1.2;
  flex-shrink: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
}

.card p:nth-of-type(2) {
  font-size: 0.8rem;
  color: var(--color-sub-text);
}

.alternative-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--color-card-alt);
  color: var(--color-bg-card);
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 10;
}
</style>
