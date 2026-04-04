<script setup lang="ts">
import { SelectLabel as SelectLabelPrimitive } from 'reka-ui'
import { cn } from '@/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <SelectLabelPrimitive :class="cn('py-1.5 pl-8 pr-2 text-sm font-semibold', $attrs.class)">
    <slot />
  </SelectLabelPrimitive>
</template>
