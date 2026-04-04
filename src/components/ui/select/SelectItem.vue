<script setup lang="ts">
import { SelectItem as SelectItemPrimitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import SafeIcon from '@/components/common/SafeIcon.vue'

defineProps<{
  value: string
  class?: string
}>()
</script>

<template>
  <SelectItemPrimitive :value="value"
    :class="cn('relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', $attrs.class)">
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SafeIcon name="Check" :size="16" />
    </span>
    <slot />
  </SelectItemPrimitive>
</template>
