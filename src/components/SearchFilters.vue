<template>
  <div class="search-filters">
    <!-- Search by name -->
    <input
      type="text"
      v-model="queryInternal.name"
      placeholder="Search by name"
      @input="onInput"
      aria-label="Search by name"
      class="search-input"
    />

    <!-- Filters section, shown once auxiliary data is loaded -->
    <div class="filters" v-if="auxLoaded">
      <!-- Card type -->
      <select v-model="queryInternal.card_type" @change="onInput">
        <option :value="null">Card Type</option>
        <option v-for="ct in auxStore.data.cardTypes" :key="ct.id" :value="ct.id">
          {{ ct.name }}
        </option>
      </select>

      <!-- Rarity -->
      <select v-model="queryInternal.rarity" @change="onInput">
        <option :value="null">Rarity</option>
        <option v-for="r in auxStore.data.rarities" :key="r.id" :value="r.id">
          {{ r.name }}
        </option>
      </select>

      <!-- Colors -->
      <select v-model="queryInternal.color_one" @change="onInput">
        <option :value="null">Color 1</option>
        <option v-for="c in filteredColors('color_one')" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>

      <select v-model="queryInternal.color_two" @change="onInput">
        <option :value="null">Color 2</option>
        <option v-for="c in filteredColors('color_two')" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>

      <select v-model="queryInternal.color_three" @change="onInput">
        <option :value="null">Color 3</option>
        <option v-for="c in filteredColors('color_three')" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>

      <!-- Cost -->
      <input
        type="number"
        min="1"
        max="20"
        v-model.number="queryInternal.cost"
        placeholder="Cost"
        @input="onInput"
      />

      <!-- Stage -->
      <select v-model="queryInternal.stage" @change="onInput">
        <option :value="null">Stage</option>
        <option v-for="s in auxStore.data.stages" :key="s.id" :value="s.id">
          {{ s.name }}
        </option>
      </select>

      <!-- Attribute -->
      <select v-model="queryInternal.attribute" @change="onInput">
        <option :value="null">Attribute</option>
        <option v-for="a in auxStore.data.attributes" :key="a.id" :value="a.id">
          {{ a.name }}
        </option>
      </select>

      <!-- Types -->
      <select v-model="queryInternal.type_one" @change="onInput">
        <option :value="null">Type 1</option>
        <option v-for="t in auxStore.data.types" :key="t.id" :value="t.id">
          {{ t.name }}
        </option>
      </select>

      <select v-model="queryInternal.type_two" @change="onInput">
        <option :value="null">Type 2</option>
        <option v-for="t in auxStore.data.types" :key="t.id" :value="t.id">
          {{ t.name }}
        </option>
      </select>

      <!-- BT -->
      <select v-model="queryInternal.bt_abbreviation" @change="onInput">
        <option :value="null">BT</option>
        <option v-for="bt in auxStore.data.bts" :key="bt.id" :value="bt.id">
          {{ bt.abbreviation }}
        </option>
      </select>

      <!-- Alternative checkbox -->
      <label class="alternative-label">
        <input type="checkbox" v-model="queryInternal.alternative" @change="onInput" />
        Alternative
      </label>

      <slot name="filters"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import { useAuxStore } from '@stores/auxStore';

// Auxiliary store for types, rarities, colors, etc.
const auxStore = useAuxStore();
const auxLoaded = ref(false);

// Props for external v-model binding
const props = defineProps<{
  modelValue: Partial<{
    name: string;
    card_type: number | null;
    rarity: number | null;
    color_one: number | null;
    color_two?: number | null;
    color_three?: number | null;
    cost?: number | null;
    stage?: number | null;
    attribute?: number | null;
    type_one: number | null;
    type_two?: number | null;
    bt_abbreviation: number | null;
    alternative: boolean | null;
  }>;
}>();

// Emits events for two-way binding and search
const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void;
  (e: 'search', value: typeof props.modelValue): void;
}>();

// Internal reactive query state
const queryInternal = ref({
  name: props.modelValue?.name || '',
  card_type: props.modelValue?.card_type ?? null,
  rarity: props.modelValue?.rarity ?? null,
  color_one: props.modelValue?.color_one ?? null,
  color_two: props.modelValue?.color_two ?? null,
  color_three: props.modelValue?.color_three ?? null,
  cost: props.modelValue?.cost ?? null,
  stage: props.modelValue?.stage ?? null,
  attribute: props.modelValue?.attribute ?? null,
  type_one: props.modelValue?.type_one ?? null,
  type_two: props.modelValue?.type_two ?? null,
  bt_abbreviation: props.modelValue?.bt_abbreviation ?? null,
  alternative: props.modelValue?.alternative ?? null,
});

// Sync internal state with external modelValue
watch(() => props.modelValue, (val) => {
  queryInternal.value = {
    name: val?.name || '',
    card_type: val?.card_type ?? null,
    rarity: val?.rarity ?? null,
    color_one: val?.color_one ?? null,
    color_two: val?.color_two ?? null,
    color_three: val?.color_three ?? null,
    cost: val?.cost ?? null,
    stage: val?.stage ?? null,
    attribute: val?.attribute ?? null,
    type_one: val?.type_one ?? null,
    type_two: val?.type_two ?? null,
    bt_abbreviation: val?.bt_abbreviation ?? null,
    alternative: val?.alternative ?? null,
  };
});

// Load auxiliary data on mount
onMounted(async () => {
  await auxStore.fetchAuxData();
  auxLoaded.value = true;
});

// Filter colors to avoid duplicates
function filteredColors(current: 'color_one' | 'color_two' | 'color_three') {
  const used = [
    current !== 'color_one' ? queryInternal.value.color_one : null,
    current !== 'color_two' ? queryInternal.value.color_two : null,
    current !== 'color_three' ? queryInternal.value.color_three : null,
  ].filter(Boolean);

  return auxStore.data.colors.filter((c) => !used.includes(c.id));
}

// Emit changes to parent
function onInput() {
  emit('update:modelValue', queryInternal.value);
  emit('search', queryInternal.value);
}
</script>

<style scoped>
.search-filters {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.search-input {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #646cff;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  background-color: var(--color-bg-card);
  color: var(--color-text);
  transition: border-color 0.2s, background-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-bg-nav-active);
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.filters select,
.filters input[type='number'] {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #646cff;
  background-color: var(--color-bg-card);
  color: var(--color-text);
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.filters select:hover,
.filters input[type='number']:hover {
  border-color: var(--color-text-hover);
  background-color: var(--color-button-hover);
  color: var(--color-text);
}

.filters select:focus,
.filters input:focus {
  outline: none;
  border-color: var(--color-bg-nav-active);
  background-color: var(--color-bg-card);
  color: var(--color-text);
}

.alternative-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  background-color: var(--color-bg-card);
  border: 1px solid #646cff;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.alternative-label:hover {
  border-color: var(--color-text-hover);
  background-color: var(--color-button-hover);
}

.alternative-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--color-text-hover);
  cursor: pointer;
}

.filters input[type='number'] {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #646cff;
  background-color: var(--color-bg-card);
  color: var(--color-text);
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.filters input[type='number']:hover {
  border-color: var(--color-text-hover);
  background-color: var(--color-button-hover);
  color: var(--color-text);
}

.filters input[type='number']:focus {
  outline: none;
  border-color: var(--color-bg-nav-active);
  background-color: var(--color-bg-card);
  color: var(--color-text);
}
</style>
