<script setup lang="ts">
import type { StatusTone } from '../types';
withDefaults(defineProps<{ tone?: StatusTone }>(), { tone: 'neutral' });
const classes = { neutral: 'b-mute', success: 'b-ok', warning: 'b-warn', danger: 'b-bad', primary: 'b-ion', brand: 'b-flux' };
</script>
<template><span class="badge ar-badge" :class="classes[tone]"><slot /></span></template>
