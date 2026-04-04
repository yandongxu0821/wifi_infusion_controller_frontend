
<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import SafeIcon from '@/components/common/SafeIcon.vue';

interface Props {
  alarm: 'COMPLETE' | 'ERROR' | 'LOW' | 'FAST' | null;
  pulsing?: boolean;
}

const props = defineProps<Props>();

const alarmConfig = computed(() => {
  if (!props.alarm) return null;

  switch (props.alarm) {
    case 'COMPLETE':
      return {
        label: '输液完成',
        icon: 'CheckCircle2',
        className: 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border-[hsl(var(--success))]/40',
        dotClass: 'bg-[hsl(var(--success))]'
      };
    case 'ERROR':
      return {
        label: '设备故障',
        icon: 'AlertOctagon',
        className: 'bg-destructive/20 text-destructive border-destructive/40',
        dotClass: 'bg-destructive'
      };
    case 'LOW':
      return {
        label: '流速过低',
        icon: 'ArrowDownNarrowWide',
        className: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/40',
        dotClass: 'bg-[hsl(var(--warning))]'
      };
    case 'FAST':
      return {
        label: '流速过快',
        icon: 'ArrowUpNarrowWide',
        className: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/40',
        dotClass: 'bg-[hsl(var(--warning))]'
      };
    default:
      return null;
  }
});

const isPulsing = computed(() => {
  if (props.pulsing !== undefined) return props.pulsing;
  return props.alarm === 'ERROR';
});
</script>

<template>
  <div
    v-if="alarmConfig"
    :class="cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-all duration-300',
      alarmConfig.className,
      isPulsing && 'animate-[pulse-alarm_2s_cubic-bezier(0.4,0,0.6,1)_infinite]'
    )"
  >
    <SafeIcon 
      :name="alarmConfig.icon" 
      :size="14" 
      :stroke-width="2.5" 
      class="shrink-0"
    />
    <span>{{ alarmConfig.label }}</span>
    
    <!-- 状态指示点 -->
    <span 
      v-if="isPulsing"
      :class="cn(
        'relative flex h-2 w-2 ml-0.5',
      )"
    >
      <span :class="cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', alarmConfig.dotClass)"></span>
      <span :class="cn('relative inline-flex rounded-full h-2 w-2', alarmConfig.dotClass)"></span>
    </span>
  </div>
</template>

<style scoped>
@keyframes pulse-alarm {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.8; 
    transform: scale(0.98);
  }
}
</style>
