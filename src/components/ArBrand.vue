<script setup lang="ts">
withDefaults(defineProps<{ name?: string; tagline?: string; logoSrc: string; layout?: 'inline' | 'stacked' }>(), {
  name: 'Arcadran', layout: 'inline',
});
</script>
<template>
  <div class="brand ar-brand" :class="`ar-brand--${layout}`">
    <img class="mark" :src="logoSrc" alt="" />
    <div class="ar-brand__text"><div class="wordmark">{{ name }}</div><div class="rule" aria-hidden="true" /><div v-if="tagline" class="tag">{{ tagline }}</div></div>
  </div>
</template>
