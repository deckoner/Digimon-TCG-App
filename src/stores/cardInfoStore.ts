import { defineStore } from 'pinia';
import axios from 'axios';
import type { CardInfo } from '@types/cardsType';

// Cached card structure
interface CachedCard {
  card: CardInfo;
  timestamp: number;
}

// Time-to-live for cached cards (24 hours)
const CARD_TTL = 1000 * 60 * 60 * 24;
const API_URL = '/api/cards';

export const useCardInfoStore = defineStore('cardInfo', {
  state: () => ({
    cards: {} as Record<string, CachedCard>,
  }),

  actions: {
    // Fetch a card by its number, using cache if valid
    async fetchCard(cardNumber: string): Promise<CardInfo> {
      const now = Date.now();
      const cached = this.cards[cardNumber];

      // Return cached card if still valid
      if (cached && now - cached.timestamp < CARD_TTL) {
        return cached.card;
      }

      try {
        // Request card data from backend
        const res = await axios.get(`${API_URL}/${cardNumber}`);
        const data = res.data;

        // Ensure 'alternative' is boolean
        const card: CardInfo = {
          ...data,
          alternative: !!data.alternative,
        };

        // Store card in cache
        this.cards[cardNumber] = { card, timestamp: now };

        return card;
      } catch (error: any) {
        console.error(`Error fetching card ${cardNumber}:`, error.message);
        throw error;
      }
    },

    // Clear cache for a specific card or all cards
    clearCache(cardNumber?: string) {
      if (cardNumber) {
        delete this.cards[cardNumber];
      } else {
        this.cards = {};
      }
    },
  },
});
