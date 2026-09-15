<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Loading' });
</script>
<template><span class="ar-spinner" role="status"><span class="spinner" aria-hidden="true" /><span class="ar-sr-only">{{ label }}</span></span></template>
