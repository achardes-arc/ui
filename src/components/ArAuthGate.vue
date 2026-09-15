<script setup lang="ts">
import { useId } from 'vue';
import ArBrand from './ArBrand.vue';
import ArButton from './ArButton.vue';
import ArBanner from './ArBanner.vue';
import ArSpinner from './ArSpinner.vue';
withDefaults(defineProps<{
  appName: string; description: string; logoSrc: string; brandName?: string;
  accessLabel?: string; signInHref?: string; signInLabel?: string;
  error?: string; busy?: boolean; busyLabel?: string;
}>(), { brandName: 'Arcadran', accessLabel: 'Restricted access', signInLabel: 'Sign in with GitHub', busyLabel: 'Preparing sign-in' });
const headingId = `ar-auth-${useId()}`;
</script>
<template>
  <section class="gate ar-auth-gate" :aria-labelledby="headingId">
    <div class="gate-card ar-auth-gate__card">
      <ArBrand :logo-src="logoSrc" :name="brandName" :tagline="`${appName} · ${accessLabel}`" layout="stacked" />
      <h1 :id="headingId" class="ar-sr-only">{{ appName }} — {{ accessLabel }}</h1>
      <p class="ar-auth-gate__description">{{ description }}</p>
      <div class="ar-auth-gate__actions">
        <slot name="actions">
          <ArButton v-if="signInHref" :href="signInHref" :loading="busy" :loading-label="busyLabel" block>
            <template #icon><svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg></template>
            {{ signInLabel }}
          </ArButton>
          <ArSpinner v-else-if="busy" :label="busyLabel" />
        </slot>
      </div>
      <ArBanner v-if="error" tone="danger">{{ error }}</ArBanner>
      <div v-if="$slots.footer" class="ar-auth-gate__footer"><slot name="footer" /></div>
    </div>
  </section>
</template>
