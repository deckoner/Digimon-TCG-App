import { defineStore } from 'pinia';
import axios from 'axios';
import type { CardSimple } from '@types/cardsType';
import { getCache, setCache } from '@utils/useCache';

// Cache TTL for card list (1 hour)
const CARDS_TTL = 60 * 60;
const API_URL = '/api/cards/ids';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    cards: [] as CardSimple[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Fetch all cards, using cache if available
    async fetchCards() {
      this.loading = true;
      this.error = null;

      // Try to load from cache
      const cached = getCache<CardSimple[]>('cards-list');
      if (cached) {
        // Ensure 'alternative' is boolean
        this.cards = cached.map((card) => ({
          ...card,
          alternative: !!card.alternative,
        }));
        this.loading = false;
        return;
      }

      try {
        const res = await axios.get<CardSimple[]>(API_URL);

        // Ensure 'alternative' is boolean
        this.cards = res.data.map((card) => ({
          ...card,
          alternative: !!card.alternative,
        }));

        // Save in cache
        setCache('cards-list', this.cards, CARDS_TTL);
      } catch (err) {
        this.error = 'Error loading cards';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
