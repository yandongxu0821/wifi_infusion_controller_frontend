<script setup lang="ts">
import { TooltipProvider as TooltipProviderPrimitive } from 'reka-ui'
</script>

<template>
  <TooltipProviderPrimitive>
    <slot />
  </TooltipProviderPrimitive>
</template>
