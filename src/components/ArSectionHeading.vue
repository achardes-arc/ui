<script setup lang="ts">
import type { HeadingLevel } from '../types';
withDefaults(defineProps<{
  title: string;
  kicker?: string;
  description?: string;
  titleId?: string;
  level?: HeadingLevel;
}>(), { level: 2 });
</script>
<template>
  <div class="ar-section-heading">
    <div v-if="kicker" class="kicker ruled ar-section-heading__kicker">{{ kicker }}</div>
    <component :is="`h${level}`" :id="titleId" class="ar-section-heading__title">{{ title }}</component>
    <p v-if="description" class="ar-section-heading__description">{{ description }}</p>
  </div>
</template>
