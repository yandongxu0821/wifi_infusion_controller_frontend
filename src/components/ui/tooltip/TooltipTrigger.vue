<script setup lang="ts">
import { TooltipTrigger as TooltipTriggerPrimitive } from 'reka-ui'

defineProps<{
  asChild?: boolean
}>()
</script>

<template>
  <TooltipTriggerPrimitive :as-child="asChild">
    <slot />
  </TooltipTriggerPrimitive>
</template>
