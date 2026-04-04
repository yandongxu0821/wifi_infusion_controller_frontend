<script setup lang="ts">
import { cn } from '@/lib/utils'
import { badgeVariants } from './badge'
import type { BadgeVariants } from './badge'

interface BadgeProps extends /* @vue-ignore */ BadgeVariants {
  class?: string
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default'
})
</script>

<template>
  <div :class="cn(badgeVariants({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
