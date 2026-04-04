<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'
import type { InfusionDeviceVO } from '@/data/InfusionDeviceService'
import * as InfusionDeviceService from '@/data/InfusionDeviceService'
import * as DeviceTelemetryService from '@/data/DeviceTelemetryService'
import * as AlarmLogService from '@/data/AlarmLogService'
import * as SystemConnectionService from '@/data/SystemConnectionService'
import ConnectionStatusBar from '@/components/common/ConnectionStatusBar.vue'
import FilterBar from '@/components/monitoring_dashboard/FilterBar.vue'
import DeviceCard from '@/components/monitoring_dashboard/DeviceCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const isClient = ref(true)
const devices = ref<InfusionDeviceVO[]>(InfusionDeviceService.getAllVO())
const telemetryMap = ref<Record<string, any>>({})
const systemStatus = ref<any>(SystemConnectionService.getAllVO()[0] || {})
const activeStatus = ref<string>('all')
const sortBy = ref<string>('status')

const unhandledAlarmCount = computed(() => {
  return AlarmLogService.queryVO({
    filter: { isHandled: 'false' }
  }).length
})

const filteredAndSortedDevices = computed(() => {
  let result = [...devices.value]

  if (activeStatus.value !== 'all') {
    result = result.filter(d => d.status === activeStatus.value)
  }

  if (sortBy.value === 'dripRate') {
    result.sort((a, b) => {
      const aTelemetry = telemetryMap.value[a.id]
      const bTelemetry = telemetryMap.value[b.id]
      const aRate = aTelemetry?.dripRate ?? 0
      const bRate = bTelemetry?.dripRate ?? 0
      return bRate - aRate
    })
  } else if (sortBy.value === 'battery') {
    result.sort((a, b) => a.batteryLevel - b.batteryLevel)
  } else {
    result.sort((a, b) => {
      const statusOrder = { 'WORKING': 0, 'IDLE': 1, 'ERROR': 2, 'OFFLINE': 3 }
      return (statusOrder[a.status as keyof typeof statusOrder] ?? 99) - (statusOrder[b.status as keyof typeof statusOrder] ?? 99)
    })
  }

  return result
})

const handleStatusChange = (status: string) => {
  activeStatus.value = status
}

const handleSortChange = (sort: string) => {
  sortBy.value = sort
}

const handleDeviceCommand = (deviceId: string, command: 'START' | 'STOP') => {
  const device = devices.value.find(d => d.id === deviceId)
  if (!device) return

  const newStatus = command === 'START' ? 'WORKING' : 'IDLE'
  device.status = newStatus

  toast.success(`设备 ${device.deviceName} 已${command === 'START' ? '启动' : '停止'}`)
}

const handleDeviceClick = (deviceId: string) => {
  window.location.href = `./device-detail-view.html?deviceId=${deviceId}`
}

onMounted(() => {
  isClient.value = false

  const telemetryList = DeviceTelemetryService.queryVO({})
  telemetryList.forEach(t => {
    telemetryMap.value[t.deviceId] = t
  })

  requestAnimationFrame(() => {
    isClient.value = true
  })
})
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col bg-background">
    <!-- 系统连接状态栏 -->
    <ConnectionStatusBar :mqtt-connected="systemStatus.mqttState === 'HEALTHY'"
      :api-status="systemStatus.apiState === 'HEALTHY' ? 'online' : 'offline'"
      :device-count="devices.filter(d => d.onlineStatus === 'ONLINE').length" :alarm-count="unhandledAlarmCount" />

    <!-- 主内容区 -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <div class="page-body space-y-6">
        <!-- 过滤和排序栏 -->
        <FilterBar :active-status="activeStatus" :sort-by="sortBy" @status-change="handleStatusChange"
          @sort-change="handleSortChange" />

        <!-- 设备卡片网格 -->
        <div v-if="filteredAndSortedDevices.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          <DeviceCard v-for="device in filteredAndSortedDevices" :key="device.id" :device="device"
            :telemetry="telemetryMap[device.id]" @click="handleDeviceClick(device.id)"
            @command="handleDeviceCommand(device.id, $event)" />
        </div>

        <!-- 空状态 -->
        <EmptyState v-else icon="Inbox" message="暂无设备" description="当前筛选条件下没有找到任何设备，请调整过滤条件。" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 确保网格在不同屏幕尺寸下的响应式布局 */
@media (max-width: 1024px) {
  :deep(.grid) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  :deep(.grid) {
    grid-template-columns: 1fr;
  }
}
</style>
