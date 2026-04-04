<script setup lang="ts">
/**
 * OnlineIndicator
 * 在线状态指示灯，在线时显示青绿色圆点并带有呼吸动画，离线时显示灰色静态圆点。
 */
interface Props {
  /** 是否在线 */
  online: boolean;
  /** 是否显示文字标签 */
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  online: false,
  showLabel: false
});

/**
 * 这里的样式使用了 global.css 中定义的:
 * .online-dot: 青绿色呼吸动画
 * .offline-dot: 灰色静态圆点
 */
</script>

<template>
  <div class="inline-flex items-center gap-2 select-none">
    <div :class="cn(
      'shrink-0 rounded-full transition-colors duration-300',
      props.online ? 'online-dot' : 'offline-dot'
    )" aria-hidden="true" />
    <span v-if="props.showLabel" :class="cn(
      'text-xs font-medium tracking-wide',
      props.online ? 'text-primary' : 'text-muted-foreground'
    )">
      {{ props.online ? '在线' : '离线' }}
    </span>
  </div>
</template>

<style scoped>
/* 
  注：online-dot 和 offline-dot 的具体样式已在 global.css 中定义：
  .online-dot { @apply w-2 h-2 rounded-full bg-primary; animation: breathe 2s ease-in-out infinite; }
  .offline-dot { @apply w-2 h-2 rounded-full bg-muted-foreground; }
*/
</style>
