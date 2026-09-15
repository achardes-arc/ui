<script setup lang="ts">
import type { DescriptionItem } from '../types';
defineProps<{ items: readonly DescriptionItem[] }>();
</script>
<template>
  <dl v-if="items.length" class="ar-description-list">
    <div v-for="(item, index) in items" :key="index" class="ar-description-list__row">
      <dt class="ar-description-list__term">{{ item.term }}</dt>
      <dd class="ar-description-list__value"><slot name="value" :item="item" :index="index">{{ item.description }}</slot></dd>
    </div>
  </dl>
</template>
