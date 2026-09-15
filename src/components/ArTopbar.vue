<script setup lang="ts">
import ArBrand from './ArBrand.vue';
import type { TopbarItem } from '../types';
withDefaults(defineProps<{
  appName?: string;
  brandName?: string;
  logoSrc?: string;
  homeHref?: string;
  homeLabel?: string;
  items?: readonly TopbarItem[];
  navigationLabel?: string;
  sticky?: boolean;
}>(), {
  brandName: 'Arcadran',
  homeLabel: 'Home',
  items: () => [],
  navigationLabel: 'Main navigation',
  sticky: true,
});
</script>
<template>
  <header class="topbar ar-topbar" :class="{ 'ar-topbar--static': !sticky }">
    <div v-if="$slots.brand || logoSrc" class="ar-topbar__brand">
      <slot name="brand">
        <component :is="homeHref ? 'a' : 'div'" :href="homeHref" :aria-label="homeHref ? homeLabel : undefined" class="ar-topbar__home">
          <ArBrand v-if="logoSrc" :logo-src="logoSrc" :name="brandName" :tagline="appName" />
        </component>
      </slot>
    </div>
    <nav v-if="$slots.navigation || items.length" class="tabs ar-topbar__navigation" :aria-label="navigationLabel">
      <slot name="navigation">
        <a v-for="item in items" :key="item.href" :href="item.href" class="chip" :class="{ on: item.current }" :aria-current="item.current ? 'page' : undefined">
          {{ item.label }}<span v-if="item.count !== undefined" class="n">{{ item.count }}</span>
        </a>
      </slot>
    </nav>
    <div v-if="$slots.context" class="ar-topbar__context"><slot name="context" /></div>
    <div v-if="$slots.actions || $slots.account" class="ar-topbar__end">
      <div v-if="$slots.actions" class="ar-topbar__actions"><slot name="actions" /></div>
      <div v-if="$slots.account" class="ar-topbar__account"><slot name="account" /></div>
    </div>
  </header>
</template>
