import { defineStore } from 'pinia';
import type { AuxData } from '@types/auxItems';
import { getCache, setCache } from '@utils/useCache';
import axios from 'axios';

// Time-to-live for cached auxiliary data (24 hours)
const AUX_TTL = 60 * 60 * 24;
const API_URL = '/api/aux';

export const useAuxStore = defineStore('auxStore', {
  state: () => ({
    data: {} as AuxData,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Fetch auxiliary data from API or cache
    async fetchAuxData() {
      const cacheKey = 'aux-data';
      const cached = getCache<AuxData>(cacheKey);

      if (cached) {
        this.data = cached;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        // Fetch all auxiliary endpoints in parallel
        const [bts, colors, cardTypes, rarities, stages, attributes, types] = await Promise.all([
          axios.get(`${API_URL}/bts`).then((res) => res.data),
          axios.get(`${API_URL}/colors`).then((res) => res.data),
          axios.get(`${API_URL}/card-types`).then((res) => res.data),
          axios.get(`${API_URL}/rarities`).then((res) => res.data),
          axios.get(`${API_URL}/stages`).then((res) => res.data),
          axios.get(`${API_URL}/attributes`).then((res) => res.data),
          axios.get(`${API_URL}/types`).then((res) => res.data),
        ]);

        // Assign fetched data to the store
        this.data = {
          bts,
          colors,
          cardTypes,
          rarities,
          stages,
          attributes,
          types,
        };

        // Cache the data for future use
        setCache(cacheKey, this.data, AUX_TTL);
      } catch (e) {
        console.error('Error loading auxiliary data:', e);
        this.error = 'Failed to load auxiliary data';
      } finally {
        this.loading = false;
      }
    },
  },
});
