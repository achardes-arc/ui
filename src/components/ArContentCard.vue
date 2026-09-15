<script setup lang="ts">
import { useId } from 'vue';
import type { HeadingLevel } from '../types';
withDefaults(defineProps<{
  title: string;
  kicker?: string;
  description?: string;
  accent?: 'primary' | 'brand';
  level?: HeadingLevel;
}>(), { accent: 'primary', level: 3 });
const titleId = `ar-content-card-${useId()}`;
</script>
<template>
  <article class="card ar-content-card" :class="`ar-content-card--${accent}`" :aria-labelledby="titleId">
    <div class="ar-content-card__header">
      <span v-if="$slots.icon" class="ar-content-card__icon" aria-hidden="true"><slot name="icon" /></span>
      <div class="ar-content-card__heading">
        <div v-if="kicker" class="ar-content-card__kicker">{{ kicker }}</div>
        <component :is="`h${level}`" :id="titleId" class="ar-content-card__title">{{ title }}</component>
      </div>
    </div>
    <p v-if="description" class="ar-content-card__description">{{ description }}</p>
    <div v-if="$slots.default" class="ar-content-card__body"><slot /></div>
    <div v-if="$slots.footer" class="ar-content-card__footer"><slot name="footer" /></div>
  </article>
</template>
