<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'info' | 'warning' | 'danger' | 'brand'; live?: boolean }>(), { tone: 'info', live: true });
const classes = { info: '', warning: 'banner-warn', danger: 'banner-bad', brand: 'banner-flux' };
</script>
<template><div class="banner ar-banner" :class="classes[tone]" :role="live ? (tone === 'danger' ? 'alert' : 'status') : undefined"><slot name="icon" /><div class="ar-banner__content"><slot /></div></div></template>
