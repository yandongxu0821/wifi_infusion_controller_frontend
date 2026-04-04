<script setup lang="ts">
import type { DeviceHistoryPointVO } from '@/data/DeviceHistoryPointService'
import { VisXYContainer, VisLine, VisAxis, VisTooltip } from '@unovis/vue'
import { Line } from '@unovis/ts'
import { computed, ref, onMounted } from 'vue'

interface Props {
  historyPoints: DeviceHistoryPointVO[]
}

const props = defineProps<Props>()

const chartData = computed(() => {
  return props.historyPoints.map((point, index) => ({
    x: index,
    y: point.dripRate,
    timestamp: point.timestamp,
    status: point.status,
    alarmStatus: point.alarmStatus
  }))
})

const lineConfig = ref<any>()
const isMounted = ref(false)

onMounted(() => {
  lineConfig.value = new Line({
    x: (d: any) => d.x,
    y: (d: any) => d.y,
    color: 'hsl(168, 65%, 48%)'
  })
  isMounted.value = true
})

const xTickFormat = (i: number) => {
  const point = chartData.value[i]
  if (!point) return ''
  const date = new Date(point.timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const tooltipTemplate = (d: any) => {
  return `
    <div class="bg-card border border-border rounded p-2 text-xs">
      <div class="font-mono font-bold text-primary">${d.y.toFixed(1)} 滴/秒</div>
      <div class="text-muted-foreground text-[10px]">${new Date(d.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}</div>
    </div>
  `
}
</script>

<template>
  <div class="w-full h-80 bg-muted/20 rounded border border-border/50 p-4">
    <VisXYContainer v-if="isMounted" :data="chartData" :margin="{ top: 20, bottom: 40, left: 60, right: 20 }"
      class="w-full h-full">
      <VisLine :config="lineConfig" />
      <VisAxis type="x" :tick-format="xTickFormat" label="时间" />
      <VisAxis type="y" label="滴速 (滴/秒)" />
      <VisTooltip :triggers="{ [Line.selectors.line]: tooltipTemplate }" />
    </VisXYContainer>
  </div>
</template>

<style scoped>
:deep(.vis-axis-label) {
  fill: hsl(210, 15%, 65%);
  font-size: 12px;
}

:deep(.vis-axis-tick) {
  stroke: hsl(220, 15%, 25%);
}

:deep(.vis-axis-tick-label) {
  fill: hsl(210, 15%, 65%);
  font-size: 11px;
}

:deep(.vis-line) {
  stroke-width: 2;
  filter: drop-shadow(0 0 4px hsl(168, 65%, 48%, 0.3));
}
</style>
