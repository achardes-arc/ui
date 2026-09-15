<script setup lang="ts">
import { computed, useId } from 'vue';
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{
  modelValue?: string; label: string; id?: string; hint?: string; error?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel';
  disabled?: boolean; required?: boolean; describedBy?: string;
}>(), { modelValue: '', type: 'text' });
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const generatedId = useId();
const fieldId = computed(() => props.id || `ar-field-${generatedId}`);
const description = computed(() => [props.describedBy, props.hint && `${fieldId.value}-hint`, props.error && `${fieldId.value}-error`].filter(Boolean).join(' ') || undefined);
</script>
<template>
  <div class="field ar-field">
    <label class="mlab" :for="fieldId">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <input v-bind="$attrs" :id="fieldId" class="input" :type="type" :value="modelValue" :required="required" :disabled="disabled"
      :aria-describedby="description" :aria-invalid="error ? 'true' : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <div v-if="hint" :id="`${fieldId}-hint`" class="ar-field__hint">{{ hint }}</div>
    <div v-if="error" :id="`${fieldId}-error`" class="ar-field__error" role="alert">{{ error }}</div>
  </div>
</template>
