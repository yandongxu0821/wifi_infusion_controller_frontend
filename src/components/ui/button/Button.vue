<script setup lang="ts">
import { cn } from '@/lib/utils'
import { buttonVariants } from './button'
import type { ButtonVariants } from './button'

interface ButtonProps extends /* @vue-ignore */ ButtonVariants {
  class?: string
}

withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'default',
})
</script>

<template>
  <button :class="cn(
    buttonVariants({ variant: $props.variant, size: $props.size }),
    $props.class
  )">
    <slot />
  </button>
</template>
