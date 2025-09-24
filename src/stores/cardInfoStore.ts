import { defineStore } from 'pinia';
import axios from 'axios';
import type { CardInfo } from '@types/cardsType';

interface CachedCard {
  card: CardInfo;
  timestamp: number;
}

const CARD_TTL = 1000 * 60 * 60 * 24; // 1 día
const API_URL = '/api/cards';

export const useCardInfoStore = defineStore('cardInfo', {
  state: () => ({
    cards: {} as Record<string, CachedCard>,
  }),

  actions: {
    async fetchCard(card_number: string): Promise<CardInfo> {
      const now = Date.now();
      const cached = this.cards[card_number];

      // Retornar de cache si sigue vigente
      if (cached && now - cached.timestamp < CARD_TTL) {
        return cached.card;
      }

      try {
        // Petición al backend local
        const res = await axios.get(`${API_URL}/${card_number}`);
        const data = res.data;

        // Convertir alternative a boolean
        const card: CardInfo = {
          ...data,
          alternative: !!data.alternative,
        };

        // Guardar en cache
        this.cards[card_number] = { card, timestamp: now };

        return card;
      } catch (error: any) {
        console.error(`Error al obtener carta ${card_number}:`, error.message);
        throw error;
      }
    },

    clearCache(card_number?: string) {
      if (card_number) {
        delete this.cards[card_number];
      } else {
        this.cards = {};
      }
    },
  },
});
