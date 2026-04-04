
<script setup lang="ts">
/**
 * DeviceStatusBadge
 * 设备工作状态徽章组件，根据 status 自动应用对应颜色和样式。
 * 工作中 (WORKING) 应用青绿色工业风格，空闲 (IDLE) 应用灰色风格。
 */
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import SafeIcon from '@/components/common/SafeIcon.vue';

interface Props {
  status: 'WORKING' | 'IDLE';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const statusConfig = computed(() => {
  if (props.status === 'WORKING') {
    return {
      label: '运行中',
      icon: 'Activity',
      class: 'status-working',
      dotClass: 'online-dot',
    };
  }
  return {
    label: '待机中',
    icon: 'PauseCircle',
    class: 'status-idle',
    dotClass: 'offline-dot',
  };
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-1.5 py-0.5 text-[10px] gap-1';
    case 'lg':
      return 'px-3 py-1.5 text-sm gap-2';
    case 'md':
    default:
      return 'px-2 py-1 text-xs gap-1.5';
  }
});

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 10;
    case 'lg':
      return 16;
    case 'md':
    default:
      return 14;
  }
});
</script>

<template>
  <div
    :class="cn(
      'status-indicator whitespace-nowrap shrink-0 transition-colors duration-200',
      statusConfig.class,
      sizeClasses
    )"
  >
    <!-- 呼吸灯指示点 -->
    <div :class="cn('shrink-0', statusConfig.dotClass, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')" />
    
    <!-- 状态图标 -->
    <SafeIcon 
      :name="statusConfig.icon" 
      :size="iconSize" 
      :stroke-width="2.5" 
      class="opacity-90"
    />
    
    <!-- 状态文本 -->
    <span class="font-bold tracking-wider uppercase">
      {{ statusConfig.label }}
    </span>
  </div>
</template>

<style scoped>
/* 额外样式确保在不同背景下清晰可见 */
.status-indicator {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
