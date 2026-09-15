<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
const props = withDefaults(defineProps<{
  modelValue: boolean; title: string; description?: string;
  size?: 'sm' | 'md' | 'lg'; closeLabel?: string; dismissible?: boolean;
}>(), { size: 'md', closeLabel: 'Close dialog', dismissible: true });
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const dialog = ref<HTMLDialogElement>();
const titleId = `ar-dialog-${useId()}`;
let opener: HTMLElement | null = null;
function requestClose() { if (props.dismissible) emit('update:modelValue', false); }
function backdrop(event: MouseEvent) {
  if (event.target !== dialog.value) return;
  const box = dialog.value.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) requestClose();
}
function containTab(event: KeyboardEvent) {
  if (event.key !== 'Tab' || event.defaultPrevented || !dialog.value) return;
  // Native dialog makes the page inert. Wrap the two boundaries as well so
  // Tab does not leave the document for the browser chrome.
  const controls = [...dialog.value.querySelectorAll<HTMLElement>(
    'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]',
  )].filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') &&
    !element.closest('[inert]') && element.getClientRects().length > 0 &&
    getComputedStyle(element).visibility !== 'hidden');
  const first = controls[0];
  const last = controls.at(-1);
  if (!first) { event.preventDefault(); dialog.value.focus(); return; }
  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.value)) {
    event.preventDefault(); last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
}
async function sync() {
  await nextTick();
  const element = dialog.value;
  if (!element?.isConnected) return;
  if (props.modelValue && !element.open) {
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    element.showModal();
  } else if (!props.modelValue && element.open) element.close();
}
function closed() {
  // Ignore a queued close event if the dialog has already been reopened.
  if (dialog.value?.open) return;
  emit('update:modelValue', false);
  if (opener?.isConnected) opener.focus();
}
watch(() => props.modelValue, sync);
onMounted(sync);
onBeforeUnmount(() => { if (dialog.value?.open) { dialog.value.close(); opener?.focus(); } });
</script>
<template>
  <dialog ref="dialog" class="modal ar-dialog" :class="`ar-dialog--${size}`" :aria-labelledby="titleId"
    :aria-describedby="description ? `${titleId}-description` : undefined" @keydown="containTab" @cancel.prevent="requestClose" @close="closed" @click="backdrop">
    <header class="modal-h ar-dialog__header"><h2 :id="titleId">{{ title }}</h2><button v-if="dismissible" class="iconbtn" type="button" :aria-label="closeLabel" @click="requestClose"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></header>
    <div class="modal-b"><p v-if="description" :id="`${titleId}-description`" class="ar-dialog__description">{{ description }}</p><slot /></div>
    <footer v-if="$slots.footer" class="ar-dialog__footer"><slot name="footer" /></footer>
  </dialog>
</template>
