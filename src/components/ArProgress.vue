<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(defineProps<{ value?: number; max?: number; label: string }>(), { max: 100 });
const maximum = computed(() => Number.isFinite(props.max) && props.max > 0 ? props.max : 100);
const current = computed(() => props.value === undefined || !Number.isFinite(props.value) ? undefined : Math.max(0, Math.min(maximum.value, props.value)));
</script>
<template><progress class="ar-progress" :aria-label="label" :value="current" :max="maximum" /></template>
