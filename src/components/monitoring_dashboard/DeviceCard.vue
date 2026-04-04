<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { InfusionDeviceVO } from '@/data/InfusionDeviceService'
import DeviceStatusBadge from '@/components/common/DeviceStatusBadge.vue'
import AlarmBadge from '@/components/common/AlarmBadge.vue'
import OnlineIndicator from '@/components/common/OnlineIndicator.vue'
import DigitalDisplay from '@/components/common/DigitalDisplay.vue'
import MiniTrendChart from '@/components/common/MiniTrendChart.vue'
import IndustryButton from '@/components/common/IndustryButton.vue'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  device: InfusionDeviceVO
  telemetry?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
  command: ['START' | 'STOP']
}>()

const dripRate = computed(() => props.telemetry?.dripRate ?? 0)
const trendPoints = computed(() => props.telemetry?.trendPoints ?? [])
const isOnline = computed(() => props.device.onlineStatus === 'ONLINE')
const isWorking = computed(() => props.device.status === 'WORKING')

const handleDetailClick = (e: Event) => {
  e.stopPropagation()
  emit('click')
}

const handleCommand = (command: 'START' | 'STOP', e: Event) => {
  e.stopPropagation()
  emit('command', command)
}
</script>

<template>
  <div
    class="device-card cursor-pointer group transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:scale-[1.02]"
    @click="handleDetailClick">
    <!-- 卡片头部：设备信息 -->
    <div class="flex items-start justify-between mb-4 pb-3 border-b border-border/50">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="text-item-title truncate">{{ device.deviceName }}</h3>
          <OnlineIndicator :online="isOnline" />
        </div>
        <p class="text-caption text-muted-foreground">
          {{ device.wardCode }} | {{ device.bedNumber }}
        </p>
      </div>

      <!-- 右上角：详情按钮 -->
      <button class="ml-2 p-1.5 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
        @click="handleDetailClick" title="查看详情">
        <SafeIcon name="ChevronRight" :size="18" class="text-muted-foreground" />
      </button>
    </div>

    <!-- 状态徽章行 -->
    <div class="flex items-center gap-2 mb-4 flex-wrap">
      <DeviceStatusBadge :status="device.status === 'WORKING' ? 'WORKING' : 'IDLE'" size="sm" />
      <AlarmBadge :alarm="device.alarmStatus !== 'NORMAL' ? device.alarmStatus : null" />
    </div>

    <!-- 中央：滴速仪表盘 -->
    <div class="flex flex-col items-center justify-center py-4 mb-4 bg-muted/20 rounded border border-border/50">
      <DigitalDisplay :value="dripRate" unit="滴/分" label="实时滴速" size="lg" />
    </div>

    <!-- 趋势图 -->
    <div class="mb-4">
      <p class="text-caption text-muted-foreground mb-2">滴速趋势 (近8分钟)</p>
      <MiniTrendChart :data="trendPoints" color="hsl(168, 65%, 48%)" :height="48" :show-grid="true" />
    </div>

    <!-- 设备指标行 -->
    <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
      <!-- 电池电量 -->
      <div class="flex items-center gap-2 p-2 bg-muted/20 rounded border border-border/50">
        <SafeIcon name="Battery" :size="14" class="text-muted-foreground" />
        <div class="flex-1 min-w-0">
          <p class="text-caption text-muted-foreground">电量</p>
          <p class="font-mono font-bold text-foreground">{{ device.batteryLevel }}%</p>
        </div>
      </div>

      <!-- 信号强度 -->
      <div class="flex items-center gap-2 p-2 bg-muted/20 rounded border border-border/50">
        <SafeIcon name="Signal" :size="14" class="text-muted-foreground" />
        <div class="flex-1 min-w-0">
          <p class="text-caption text-muted-foreground">信号</p>
          <p class="font-mono font-bold text-foreground">{{ telemetry?.signalStrength ?? 0 }}%</p>
        </div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="flex gap-2">
      <IndustryButton v-if="!isWorking" variant="success" size="sm" class="flex-1"
        @click="(e) => handleCommand('START', e)">
        <SafeIcon name="Play" :size="14" />
        启动
      </IndustryButton>

      <IndustryButton v-if="isWorking" variant="destructive" size="sm" class="flex-1"
        @click="(e) => handleCommand('STOP', e)">
        <SafeIcon name="Square" :size="14" />
        停止
      </IndustryButton>

      <IndustryButton variant="outline" size="sm" class="flex-1" @click="handleDetailClick">
        <SafeIcon name="MoreVertical" :size="14" />
      </IndustryButton>
    </div>
  </div>
</template>

<style scoped>
.device-card {
  /* 工业风格的卡片阴影和边框 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.device-card:hover {
  /* 悬停时增强阴影和亮度 */
  box-shadow: 0 8px 24px rgba(168, 65, 48, 0.2), 0 4px 12px rgba(0, 0, 0, 0.5);
}
</style>
