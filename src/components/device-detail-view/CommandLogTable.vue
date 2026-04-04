<script setup lang="ts">
import type { DeviceCommandLogVO } from '@/data/DeviceCommandLogService'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { cn } from '@/lib/utils'

interface Props {
  logs: DeviceCommandLogVO[]
}

const props = defineProps<Props>()

const getCommandIcon = (commandType: string) => {
  return commandType === 'START' ? 'Play' : 'Square'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SUCCESS': return 'text-[hsl(var(--success))]'
    case 'FAILED': return 'text-destructive'
    case 'PENDING': return 'text-[hsl(var(--warning))]'
    default: return 'text-muted-foreground'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'SUCCESS': return '成功'
    case 'FAILED': return '失败'
    case 'PENDING': return '待确认'
    default: return status
  }
}
</script>

<template>
  <div class="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow class="border-border/50 hover:bg-transparent">
          <TableHead class="w-24 text-xs uppercase tracking-wider">指令类型</TableHead>
          <TableHead class="w-20 text-xs uppercase tracking-wider">状态</TableHead>
          <TableHead class="w-32 text-xs uppercase tracking-wider">执行时间</TableHead>
          <TableHead class="w-40 text-xs uppercase tracking-wider">操作员</TableHead>
          <TableHead class="text-xs uppercase tracking-wider">备注</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="log in logs" :key="log.id" class="border-border/30 hover:bg-muted/20 transition-colors">
          <TableCell class="font-mono font-bold">
            <div class="flex items-center gap-2">
              <SafeIcon :name="getCommandIcon(log.commandType)" :size="14" class="text-primary" />
              <span>{{ log.commandType }}</span>
            </div>
          </TableCell>
          <TableCell>
            <span :class="cn('text-xs font-bold uppercase', getStatusColor(log.commandStatus))">
              {{ getStatusLabel(log.commandStatus) }}
            </span>
          </TableCell>
          <TableCell class="text-xs text-muted-foreground font-mono">
            {{ new Date(log.executedAt).toLocaleString('zh-CN', { hour12: false }) }}
          </TableCell>
          <TableCell class="text-xs text-foreground">
            {{ log.operatorName }}
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
