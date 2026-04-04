
<script setup lang="ts">
/**
 * ConnectionStatusBar.vue
 * 系统连接状态栏，显示MQTT连接状态、API状态、在线设备数和未处理报警数。
 */
import { computed } from 'vue';
import SafeIcon from '@/components/common/SafeIcon.vue';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  mqttConnected?: boolean;
  apiStatus?: 'online' | 'offline' | 'error';
  deviceCount?: number;
  alarmCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  mqttConnected: false,
  apiStatus: 'offline',
  deviceCount: 0,
  alarmCount: 0,
});

// 状态文字映射
const apiStatusLabel = computed(() => {
  switch (props.apiStatus) {
    case 'online': return '服务在线';
    case 'error': return '服务异常';
    case 'offline':
    default: return '服务离线';
  }
});

const apiStatusClass = computed(() => {
  switch (props.apiStatus) {
    case 'online': return 'text-primary';
    case 'error': return 'text-destructive';
    case 'offline':
    default: return 'text-muted-foreground';
  }
});

const alarmSeverityClass = computed(() => {
  if (props.alarmCount > 0) return 'alarm-error';
  return 'status-idle';
});

// 导航处理
const handleAlarmClick = () => {
  window.location.href = './alarm-logs-center.html';
};
</script>

<template>
  <div class="flex items-center justify-between w-full h-10 px-4 bg-card/80 backdrop-blur-md border-b border-border shadow-soft">
    <!-- 左侧：系统通信状态 -->
    <div class="flex items-center gap-6">
      <TooltipProvider>
        <!-- MQTT 状态 -->
        <Tooltip>
          <TooltipTrigger as-child>
            <div class="flex items-center gap-2 cursor-help">
              <div :class="cn(mqttConnected ? 'online-dot' : 'offline-dot')" />
              <span class="text-xs font-medium uppercase tracking-wider">MQTT 通信</span>
              <span :class="cn('text-[10px] px-1.5 py-0.5 rounded border', mqttConnected ? 'border-primary/30 text-primary bg-primary/10' : 'border-muted-foreground/30 text-muted-foreground bg-muted/20')">
                {{ mqttConnected ? '已连接' : '未连接' }}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>实时数据同步协议 (MQTT 5.0)</p>
          </TooltipContent>
        </Tooltip>

        <!-- API 状态 -->
        <Tooltip>
          <TooltipTrigger as-child>
            <div class="flex items-center gap-2 cursor-help border-l border-border pl-6">
              <SafeIcon 
                name="Server" 
                :size="14" 
                :class="apiStatusClass" 
              />
              <span class="text-xs font-medium uppercase tracking-wider">API 网关</span>
              <span :class="cn('text-[10px]', apiStatusClass)">{{ apiStatusLabel }}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>后端业务接口服务状态</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- 右侧：统计概览 -->
    <div class="flex items-center gap-4">
      <!-- 在线设备 -->
      <div class="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded border border-border/50">
        <SafeIcon name="Activity" :size="14" class="text-primary" />
        <span class="text-xs text-muted-foreground">在线设备:</span>
        <span class="text-sm font-mono font-bold text-foreground">{{ deviceCount }}</span>
      </div>

      <!-- 待处理报警 -->
      <button 
        @click="handleAlarmClick"
        :class="cn(
          'flex items-center gap-2 px-3 py-1 rounded border transition-all hover:brightness-110',
          alarmCount > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/30 border-border/50'
        )"
      >
        <SafeIcon 
          name="BellRing" 
          :size="14" 
          :class="alarmCount > 0 ? 'text-destructive animate-pulse' : 'text-muted-foreground'" 
        />
        <span class="text-xs text-muted-foreground">待处理报警:</span>
        <span :class="cn('text-sm font-mono font-bold', alarmCount > 0 ? 'text-destructive' : 'text-foreground')">
          {{ alarmCount }}
        </span>
        <Badge 
          v-if="alarmCount > 0" 
          variant="destructive" 
          class="h-4 min-w-[1rem] px-1 text-[10px] flex items-center justify-center"
        >
          NEW
        </Badge>
      </button>

      <!-- 时间显示 (仅作为装饰性的工业界面元素) -->
      <div class="hidden md:flex items-center gap-2 ml-2 pl-4 border-l border-border/50">
        <SafeIcon name="Clock" :size="14" class="text-muted-foreground" />
        <span class="text-xs font-mono text-muted-foreground">
          {{ new Date().toLocaleTimeString('zh-CN', { hour12: false }) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 确保数字列宽一致，防止由于数字宽度不同导致的抖动 */
.font-mono {
  font-variant-numeric: tabular-nums;
}
</style>
