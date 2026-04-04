<script setup lang="ts">
import { SelectRoot as SelectPrimitive } from 'reka-ui'
</script>

<template>
  <SelectPrimitive v-slot="slotProps">
    <slot v-bind="slotProps" />
  </SelectPrimitive>
</template>
