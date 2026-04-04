<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import type { InfusionDeviceVO } from '@/data/InfusionDeviceService'
import type { DeviceTelemetryVO } from '@/data/DeviceTelemetryService'
import type { DeviceHistoryPointVO } from '@/data/DeviceHistoryPointService'
import type { DeviceCommandLogVO } from '@/data/DeviceCommandLogService'
import type { AlarmLogWithDeviceVO } from '@/data/AlarmLogService'
import { getByIdVO as getDeviceByIdVO, getAllVO as getAllDevicesVO } from '@/data/InfusionDeviceService'
import { getByDeviceIdVO as getTelemetryByDeviceIdVO } from '@/data/DeviceTelemetryService'
import { getByDeviceIdVO as getHistoryByDeviceIdVO } from '@/data/DeviceHistoryPointService'
import { getByDeviceIdVO as getCommandLogByDeviceIdVO } from '@/data/DeviceCommandLogService'
import { getByDeviceIdVO as getAlarmLogByDeviceIdVO } from '@/data/AlarmLogService'
import DripRateGauge from '@/components/device-detail-view/DripRateGauge.vue'
import HistoryChart from '@/components/device-detail-view/HistoryChart.vue'
import CommandLogTable from '@/components/device-detail-view/CommandLogTable.vue'
import AlarmLogTable from '@/components/device-detail-view/AlarmLogTable.vue'
import DeviceStatusBadge from '@/components/common/DeviceStatusBadge.vue'
import AlarmBadge from '@/components/common/AlarmBadge.vue'
import OnlineIndicator from '@/components/common/OnlineIndicator.vue'
import IndustryButton from '@/components/common/IndustryButton.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon.vue'
import { cn } from '@/lib/utils'

const isClient = ref(true)

const allDevices = getAllDevicesVO()
const defaultDevice = allDevices[0]

const currentDeviceId = ref(defaultDevice?.id ?? '')
const device = ref<InfusionDeviceVO | undefined>(defaultDevice)
const telemetry = ref<DeviceTelemetryVO | undefined>(getTelemetryByDeviceIdVO(defaultDevice?.deviceId ?? ''))
const historyPoints = ref<DeviceHistoryPointVO[]>(getHistoryByDeviceIdVO(defaultDevice?.deviceId ?? ''))
const commandLogs = ref<DeviceCommandLogVO[]>(getCommandLogByDeviceIdVO(defaultDevice?.deviceId ?? ''))
const alarmLogs = ref<AlarmLogWithDeviceVO[]>(getAlarmLogByDeviceIdVO(defaultDevice?.deviceId ?? ''))

const isLoading = ref(false)
const isStarting = ref(false)
const isStopping = ref(false)

const canStart = computed(() => device.value?.status === 'IDLE' || device.value?.status === 'OFFLINE')
const canStop = computed(() => device.value?.status === 'WORKING')

const handleStart = async () => {
  if (!device.value || isStarting.value) return

  isStarting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    device.value.status = 'WORKING'
    toast.success(`设备 ${device.value.deviceName} 启动指令已发送`)
  } catch (error) {
    toast.error('启动指令发送失败')
  } finally {
    isStarting.value = false
  }
}

const handleStop = async () => {
  if (!device.value || isStopping.value) return

  isStopping.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    device.value.status = 'IDLE'
    toast.success(`设备 ${device.value.deviceName} 停止指令已发送`)
  } catch (error) {
    toast.error('停止指令发送失败')
  } finally {
    isStopping.value = false
  }
}

onMounted(() => {
  isClient.value = false
  requestAnimationFrame(() => {
    const params = new URLSearchParams(window.location.search)
    const urlDeviceId = params.get('deviceId')

    if (urlDeviceId) {
      const foundDevice = allDevices.find(d => d.id === urlDeviceId)
      if (foundDevice) {
        currentDeviceId.value = urlDeviceId
        device.value = foundDevice
        telemetry.value = getTelemetryByDeviceIdVO(foundDevice.deviceId)
        historyPoints.value = getHistoryByDeviceIdVO(foundDevice.deviceId)
        commandLogs.value = getCommandLogByDeviceIdVO(foundDevice.deviceId)
        alarmLogs.value = getAlarmLogByDeviceIdVO(foundDevice.deviceId)
      }
    }

    isClient.value = true
  })
})
</script>

<template>
  <div v-if="isClient && device" class="space-y-6 pb-8">
    <!-- 设备基本信息卡片 -->
    <Card class="device-card">
      <CardHeader class="pb-4">
        <div class="flex items-start justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <CardTitle class="text-2xl">{{ device.deviceName }}</CardTitle>
              <DeviceStatusBadge :status="device.status" size="md" />
              <AlarmBadge :alarm="device.alarmStatus" :pulsing="device.alarmStatus === 'ERROR'" />
            </div>
            <CardDescription class="text-sm space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">设备ID:</span>
                <span class="font-mono text-foreground">{{ device.deviceId }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">型号:</span>
                <span class="text-foreground">{{ device.modelName }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">位置:</span>
                <span class="text-foreground">{{ device.wardName }} - {{ device.bedNumber }}床</span>
              </div>
            </CardDescription>
          </div>

          <!-- 在线状态和电池 -->
          <div class="flex flex-col items-end gap-4">
            <div class="flex flex-col items-end gap-2">
              <OnlineIndicator :online="device.onlineStatus === 'ONLINE'" :showLabel="true" />
              <div class="text-sm text-muted-foreground">
                <span>电池:</span>
                <span class="font-mono font-bold text-foreground">{{ device.batteryLevel }}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- 大型滴速仪表盘 -->
        <div class="flex justify-center py-6 bg-muted/20 rounded-lg border border-border/50">
          <DripRateGauge :dripRate="telemetry?.dripRate ?? 0" :targetRate="device.targetDripRate" size="lg" />
        </div>

        <!-- 控制按钮组 -->
        <div class="flex gap-3 justify-center pt-4">
          <IndustryButton variant="success" size="md" :disabled="!canStart || device.onlineStatus === 'OFFLINE'"
            :loading="isStarting" icon="Play" @click="handleStart">
            启动
          </IndustryButton>
          <IndustryButton variant="destructive" size="md" :disabled="!canStop || device.onlineStatus === 'OFFLINE'"
            :loading="isStopping" icon="Square" @click="handleStop">
            停止
          </IndustryButton>
        </div>

        <!-- 实时数据面板 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border">
          <div class="flex flex-col items-center gap-1 p-3 bg-muted/20 rounded">
            <span class="text-xs text-muted-foreground uppercase tracking-wide">信号强度</span>
            <span class="text-lg font-mono font-bold text-primary">{{ telemetry?.signalStrength ?? 0 }}%</span>
          </div>
          <div class="flex flex-col items-center gap-1 p-3 bg-muted/20 rounded">
            <span class="text-xs text-muted-foreground uppercase tracking-wide">温度</span>
            <span class="text-lg font-mono font-bold text-foreground">{{ telemetry?.temperature ?? 0 }}°C</span>
          </div>
          <div class="flex flex-col items-center gap-1 p-3 bg-muted/20 rounded">
            <span class="text-xs text-muted-foreground uppercase tracking-wide">目标滴速</span>
            <span class="text-lg font-mono font-bold text-foreground">{{ device.targetDripRate }}/s</span>
          </div>
          <div class="flex flex-col items-center gap-1 p-3 bg-muted/20 rounded">
            <span class="text-xs text-muted-foreground uppercase tracking-wide">最后更新</span>
            <span class="text-xs font-mono text-muted-foreground">{{ new
              Date(device.lastSeenAt).toLocaleTimeString('zh-CN', { hour12: false }) }}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 历史数据曲线图 -->
    <Card class="device-card">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <SafeIcon name="TrendingUp" :size="20" />
          历史数据曲线
        </CardTitle>
        <CardDescription>过去2小时内的滴速变化趋势</CardDescription>
      </CardHeader>
      <CardContent>
        <HistoryChart :historyPoints="historyPoints" />
      </CardContent>
    </Card>

    <!-- 命令日志表 -->
    <Card class="device-card">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <SafeIcon name="Zap" :size="20" />
          远程指令日志
        </CardTitle>
        <CardDescription>最近的控制指令执行记录</CardDescription>
      </CardHeader>
      <CardContent>
        <CommandLogTable :logs="commandLogs" />
      </CardContent>
    </Card>

    <!-- 报警日志表 -->
    <Card class="device-card">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <SafeIcon name="AlertTriangle" :size="20" />
          报警历史
        </CardTitle>
        <CardDescription>该设备的报警事件记录</CardDescription>
      </CardHeader>
      <CardContent>
        <AlarmLogTable :logs="alarmLogs" />
      </CardContent>
    </Card>
  </div>
</template>
