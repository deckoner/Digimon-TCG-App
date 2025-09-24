import { defineStore } from 'pinia';
import type { AuxData } from '@types/auxItems';
import { getCache, setCache } from '@utils/useCache';
import axios from 'axios';

// 1 día en segundos
const AUX_TTL = 60 * 60 * 24;
const API_URL = 'http://localhost:3001/api/aux';

export const useAuxStore = defineStore('auxStore', {
  state: () => ({
    data: {} as AuxData,
    loading: false,
    error: null as string | null,
  }),
  actions: {
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
        const [bts, colors, cardTypes, rarities, stages, attributes, types] = await Promise.all([
          axios.get(`${API_URL}/bts`).then((res) => res.data),
          axios.get(`${API_URL}/colors`).then((res) => res.data),
          axios.get(`${API_URL}/card-types`).then((res) => res.data),
          axios.get(`${API_URL}/rarities`).then((res) => res.data),
          axios.get(`${API_URL}/stages`).then((res) => res.data),
          axios.get(`${API_URL}/attributes`).then((res) => res.data),
          axios.get(`${API_URL}/types`).then((res) => res.data),
        ]);

        this.data = {
          bts,
          colors,
          cardTypes,
          rarities,
          stages,
          attributes,
          types,
        };
        setCache(cacheKey, this.data, AUX_TTL);
      } catch (e) {
        console.error('Error cargando datos auxiliares:', e);
        this.error = 'Error al cargar datos auxiliares';
      } finally {
        this.loading = false;
      }
    },
  },
});
