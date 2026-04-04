<script setup lang="ts">
import { SelectScrollDownButton as SelectScrollDownButtonPrimitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import SafeIcon from '@/components/common/SafeIcon.vue'

defineProps<{
  class?: string
}>()
</script>

<template>
  <SelectScrollDownButtonPrimitive :class="cn('flex cursor-pointer items-center justify-center py-1', $attrs.class)">
    <SafeIcon name="ChevronDown" :size="16" />
  </SelectScrollDownButtonPrimitive>
</template>
