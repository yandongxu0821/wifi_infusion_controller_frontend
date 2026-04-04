
<script setup lang="ts">
/**
 * DigitalDisplay.vue
 * 电子数字管风格显示组件，用于展示滴速等实时数值。
 * 具有深色背景、青绿色数字、内发光效果以及数值平滑过渡动画。
 */

interface DigitalDisplayProps {
  value: number;
  unit: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<DigitalDisplayProps>(), {
  size: 'md',
  label: ''
});

// 使用补零逻辑确保数字管风格的一致性
const formattedValue = computed(() => {
  const val = props.value ?? 0;
  // 保持一位小数并根据大小决定是否填充前导零
  return val.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: false
  });
});

// 计算尺寸相关的类名
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xl py-1 px-2 min-w-[80px]';
    case 'lg':
      return 'text-4xl py-4 px-6 min-w-[160px] tracking-widest';
    case 'md':
    default:
      return 'text-2xl py-2 px-4 min-w-[120px] tracking-wider';
  }
});

const labelSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-[10px]';
    case 'lg': return 'text-sm';
    default: return 'text-xs';
  }
});

const unitSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-[10px] ml-1';
    case 'lg': return 'text-lg ml-3';
    default: return 'text-xs ml-2';
  }
});
</script>

<template>
  <div class="flex flex-col gap-1.5 items-center w-fit">
    <!-- 顶部标签 -->
    <span 
      v-if="label" 
      :class="cn('text-label text-muted-foreground transition-colors duration-300', labelSizeClasses)"
    >
      {{ label }}
    </span>

    <!-- 数字管主体 -->
    <div 
      :class="cn(
        'digital-display flex items-baseline justify-center transition-all duration-500 ease-out select-none',
        sizeClasses
      )"
    >
      <!-- 数值部分，使用 tabular-nums 确保数字宽度一致防止抖动 -->
      <span class="font-mono tabular-nums drop-shadow-[0_0_8px_rgba(168,230,207,0.6)]">
        {{ formattedValue }}
      </span>
      
      <!-- 单位部分 -->
      <span 
        :class="cn(
          'font-sans uppercase font-medium opacity-70 italic tracking-normal',
          unitSizeClasses
        )"
      >
        {{ unit }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.digital-display {
  /* 强化内发光与工业管感 */
  background: linear-gradient(180deg, hsl(220 20% 8%) 0%, hsl(220 20% 12%) 100%);
  text-shadow: 0 0 12px hsla(168, 65%, 48%, 0.5);
  position: relative;
  overflow: hidden;
}

/* 模拟玻璃表面的微弱高光 */
.digital-display::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
  pointer-events: none;
}

/* 数值平滑过渡：当父级传入的 value 改变时，视觉上保持平滑 */
.digital-display span {
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
