<script setup lang="ts">
import { SelectScrollUpButton as SelectScrollUpButtonPrimitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import SafeIcon from '@/components/common/SafeIcon.vue'

defineProps<{
  class?: string
}>()
</script>

<template>
  <SelectScrollUpButtonPrimitive :class="cn('flex cursor-pointer items-center justify-center py-1', $attrs.class)">
    <SafeIcon name="ChevronUp" :size="16" />
  </SelectScrollUpButtonPrimitive>
</template>
