<script setup lang="ts">
import type { AlarmLogWithDeviceVO } from '@/data/AlarmLogService'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AlarmBadge from '@/components/common/AlarmBadge.vue'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { cn } from '@/lib/utils'

interface Props {
  logs: AlarmLogWithDeviceVO[]
}

const props = defineProps<Props>()

const getHandledIcon = (isHandled: boolean) => {
  return isHandled ? 'CheckCircle2' : 'Clock'
}

const getHandledColor = (isHandled: boolean) => {
  return isHandled ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--warning))]'
}

const formatDuration = (minutes: number) => {
  if (minutes < 1) return '< 1 分钟'
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}小时${mins}分钟`
}
</script>

<template>
  <div class="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow class="border-border/50 hover:bg-transparent">
          <TableHead class="w-32 text-xs uppercase tracking-wider">报警等级</TableHead>
          <TableHead class="w-32 text-xs uppercase tracking-wider">报警类型</TableHead>
          <TableHead class="w-40 text-xs uppercase tracking-wider">发生时间</TableHead>
          <TableHead class="w-24 text-xs uppercase tracking-wider">持续时长</TableHead>
          <TableHead class="w-20 text-xs uppercase tracking-wider">处理状态</TableHead>
          <TableHead class="text-xs uppercase tracking-wider">详情</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="log in logs" :key="log.id" class="border-border/30 hover:bg-muted/20 transition-colors">
          <TableCell>
            <AlarmBadge :alarm="log.severity" :pulsing="!log.isHandled && log.severity === 'ERROR'" />
          </TableCell>
          <TableCell class="text-xs font-medium text-foreground">
            {{ log.alarmType }}
          </TableCell>
          <TableCell class="text-xs text-muted-foreground font-mono">
            {{ new Date(log.occurredAt).toLocaleString('zh-CN', { hour12: false }) }}
          </TableCell>
          <TableCell class="text-xs text-foreground font-mono">
            {{ formatDuration(log.durationMinutes) }}
          </TableCell>
          <TableCell>
            <div class="flex items-center gap-1.5">
              <SafeIcon :name="getHandledIcon(log.isHandled)" :size="14" :class="getHandledColor(log.isHandled)" />
              <span class="text-xs font-bold" :class="getHandledColor(log.isHandled)">
                {{ log.isHandled ? '已处理' : '待处理' }}
              </span>
            </div>
          </TableCell>
          <TableCell class="text-xs text-muted-foreground">
            {{ log.message }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style scoped>
:deep(table) {
  @apply w-full text-sm;
}

:deep(th) {
  @apply bg-muted/30 border-b border-border/50 px-4 py-2 text-left font-semibold;
}

:deep(td) {
  @apply px-4 py-3 border-b border-border/20;
}

:deep(tbody tr:last-child td) {
  @apply border-b-0;
}
</style>
