<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { ButtonVariant } from '../types';
import ArSpinner from './ArSpinner.vue';
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{
  variant?: ButtonVariant; size?: 'sm' | 'md'; href?: string;
  type?: 'button' | 'submit' | 'reset'; disabled?: boolean; loading?: boolean;
  loadingLabel?: string; block?: boolean;
}>(), { variant: 'neutral', size: 'md', type: 'button', loadingLabel: 'Loading' });
const emit = defineEmits<{ click: [event: MouseEvent] }>();
const attrs = useAttrs();
const unavailable = computed(() => props.disabled || props.loading);
function click(event: MouseEvent) {
  if (unavailable.value) { event.preventDefault(); event.stopImmediatePropagation(); return; }
  emit('click', event);
}
</script>
<template>
  <component :is="href !== undefined ? 'a' : 'button'" v-bind="attrs"
    class="btn ar-button" :class="[{ 'btn-sm': size === 'sm', 'ar-button--block': block }, variant !== 'neutral' && `btn-${variant}`]"
    :href="unavailable ? undefined : href" :role="href !== undefined && unavailable ? 'link' : undefined"
    :type="href === undefined ? type : undefined" :disabled="href === undefined ? unavailable : undefined"
    :aria-disabled="unavailable ? 'true' : undefined" :aria-busy="loading ? 'true' : undefined"
    :tabindex="href !== undefined && unavailable ? -1 : attrs.tabindex" @click="click">
    <ArSpinner v-if="loading" :label="loadingLabel" /><slot v-else name="icon" /><slot />
  </component>
</template>
