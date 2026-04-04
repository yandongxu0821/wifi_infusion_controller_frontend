<script setup lang="ts">
import { computed } from 'vue'
import DigitalDisplay from '@/components/common/DigitalDisplay.vue'

interface Props {
  dripRate: number
  targetRate: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const gaugeSize = computed(() => {
  switch (props.size) {
    case 'sm': return 120
    case 'lg': return 240
    default: return 180
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

const drawGauge = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const size = gaugeSize.value
  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 20

  ctx.clearRect(0, 0, size, size)

  // 绘制背景圆形
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = 'hsl(220, 20%, 10%)'
  ctx.fill()
  ctx.strokeStyle = 'hsl(168, 65%, 48%)'
  ctx.lineWidth = 2
  ctx.stroke()

  // 绘制刻度
  ctx.strokeStyle = 'hsl(210, 15%, 65%)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 10; i++) {
    const angle = (Math.PI / 10) * i - Math.PI / 2
    const x1 = centerX + Math.cos(angle) * (radius - 10)
    const y1 = centerY + Math.sin(angle) * (radius - 10)
    const x2 = centerX + Math.cos(angle) * (radius - 20)
    const y2 = centerY + Math.sin(angle) * (radius - 20)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    // 刻度标签
    ctx.fillStyle = 'hsl(210, 15%, 65%)'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const labelX = centerX + Math.cos(angle) * (radius - 35)
    const labelY = centerY + Math.sin(angle) * (radius - 35)
    ctx.fillText(String(i * 3), labelX, labelY)
  }

  // 绘制指针
  const maxRate = 30
  const normalizedRate = Math.min(props.dripRate / maxRate, 1)
  const needleAngle = (Math.PI / 10) * normalizedRate * 10 - Math.PI / 2

  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(
    centerX + Math.cos(needleAngle) * (radius - 30),
    centerY + Math.sin(needleAngle) * (radius - 30)
  )
  ctx.strokeStyle = 'hsl(168, 65%, 48%)'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.stroke()

  // 中心圆点
  ctx.beginPath()
  ctx.arc(centerX, centerY, 6, 0, Math.PI * 2)
  ctx.fillStyle = 'hsl(168, 65%, 48%)'
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  ctx.stroke()
}

onMounted(() => {
  drawGauge()
})

watch([() => props.dripRate, () => props.targetRate], () => {
  if (canvasRef.value) {
    drawGauge()
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-col items-center gap-4">
      <canvas ref="canvasRef" :width="gaugeSize" :height="gaugeSize" class="drop-shadow-lg" />

      <DigitalDisplay :value="dripRate" unit="滴/秒" label="实时滴速" size="lg" />
    </div>

    <div class="text-center space-y-1">
      <p class="text-sm text-muted-foreground">目标滴速</p>
      <p class="text-2xl font-mono font-bold text-primary">{{ targetRate }} 滴/秒</p>
    </div>
  </div>
</template>
