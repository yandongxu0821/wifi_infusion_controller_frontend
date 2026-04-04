<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon.vue'

interface Props {
  activeStatus: string
  sortBy: string
}

const emit = defineEmits<{
  statusChange: [status: string]
  sortChange: [sort: string]
}>()

const statusOptions = [
  { value: 'all', label: '全部设备' },
  { value: 'WORKING', label: '运行中' },
  { value: 'IDLE', label: '待机中' },
  { value: 'ERROR', label: '故障' },
  { value: 'OFFLINE', label: '离线' },
]

const sortOptions = [
  { value: 'status', label: '按状态排序' },
  { value: 'dripRate', label: '按滴速排序' },
  { value: 'battery', label: '按电量排序' },
]

const handleStatusChange = (value: string) => {
  emit('statusChange', value)
}

const handleSortChange = (value: string) => {
  emit('sortChange', value)
}
</script>

<template>
  <div class="filter-bar">
    <!-- 状态过滤 -->
    <div class="flex items-center gap-2">
      <SafeIcon name="Filter" :size="16" class="text-muted-foreground" />
      <span class="text-label text-muted-foreground">设备状态:</span>
      <Select :model-value="activeStatus" @update:model-value="handleStatusChange">
        <SelectTrigger class="w-40 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- 排序选项 -->
    <div class="flex items-center gap-2">
      <SafeIcon name="ArrowUpDown" :size="16" class="text-muted-foreground" />
      <span class="text-label text-muted-foreground">排序:</span>
      <Select :model-value="sortBy" @update:model-value="handleSortChange">
        <SelectTrigger class="w-40 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- 刷新按钮 -->
    <button
      class="ml-auto px-3 py-1.5 rounded border border-border bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-medium flex items-center gap-2"
      @click="() => window.location.reload()">
      <SafeIcon name="RotateCw" :size="14" />
      刷新
    </button>
  </div>
</template>

<style scoped>
/* 确保过滤栏在窄屏幕上能够自适应换行 */
@media (max-width: 768px) {
  :deep(.filter-bar) {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
