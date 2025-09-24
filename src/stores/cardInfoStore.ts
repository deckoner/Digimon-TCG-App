// src/stores/cardInfoStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import type { CardInfo } from '@types/cardsType';

interface CachedCard {
  card: CardInfo;
  timestamp: number;
}

export const useCardInfoStore = defineStore('cardInfo', {
  state: () => ({
    cards: {} as Record<string, CachedCard>,
    cacheDuration: 1000 * 60 * 60 * 24, // 1 día
  }),

  actions: {
    async fetchCard(card_number: string): Promise<CardInfo> {
      const now = Date.now();
      const cached = this.cards[card_number];

      // Retornar de cache si sigue vigente
      if (cached && now - cached.timestamp < this.cacheDuration) {
        return cached.card;
      }

      try {
        // Petición al backend local
        const res = await axios.get(`/api/cards/${card_number}`);
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
