<template>
  <div class="search-filters">
    <input
      type="text"
      v-model="queryInternal"
      :placeholder="placeholder"
      @input="onInput"
      aria-label="Buscar"
    />

    <div class="filters">
      <slot name="filters"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const queryInternal = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (val) => {
    queryInternal.value = val
  }
)

function onInput() {
  emit('update:modelValue', queryInternal.value)
  emit('search', queryInternal.value)
}
</script>

<style scoped>
.search-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-filters input[type="text"] {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #646cff;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  background-color: var(--color-bg-card);
  color: var(--color-text);
}

.search-filters input:focus {
  outline: 2px solid var(--color-bg-nav-active);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
