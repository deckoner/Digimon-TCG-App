import { defineStore } from "pinia";
import axios from "axios";
import type { CardSimple } from "@types/cardsTypes";
import { getCache, setCache } from "@utils/useCache";

// 1 hora en el cache
const CARDS_TTL = 60 * 60;

export const useCardStore = defineStore("cardStore", {
	state: () => ({
		cards: [] as CardSimple[],
		loading: false,
		error: null as string | null,
	}),
	actions: {
		async fetchCards() {
			this.loading = true;
			this.error = null;

			// Intentar cargar desde cache
			const cached = getCache<CardSimple[]>("cards-list");
			if (cached) {
				this.cards = cached;
				this.loading = false;
				return;
			}

			try {
				const res = await axios.get<CardSimple[]>(
					"http://localhost:3001/api/cards/ids",
				);
				this.cards = res.data;
				setCache("cards-list", this.cards, CARDS_TTL);
			} catch (err) {
				this.error = "Error al cargar las cartas";
				console.error(err);
			} finally {
				this.loading = false;
			}
		},
	},
});
