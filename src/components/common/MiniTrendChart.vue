<script setup lang="ts">
/**
 * MiniTrendChart
 * 微型趋势折线图,用于卡片中显示滴速波动。
 * 使用Canvas绘制,支持自定义颜色和网格显示。
 * 数据点超过30个时自动滚动。
 */

interface Props {
  data: number[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  color: 'hsl(168, 65%, 48%)', // Default to --primary
  height: 64,
  showGrid: true,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

const drawChart = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size based on container to handle responsiveness
  const rect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = props.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = props.height;
  const padding = 4;

  // Clear
  ctx.clearRect(0, 0, width, height);

  const points = props.data || [];
  if (points.length < 2) return;

  // Limit points to last 30 for "scrolling" effect as per spec
  const displayPoints = points.slice(-30);

  const min = Math.min(...displayPoints) * 0.9;
  const max = Math.max(...displayPoints) * 1.1 || 1;
  const range = max - min;

  const stepX = (width - padding * 2) / (displayPoints.length - 1);

  // Draw Grid
  if (props.showGrid) {
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal grid lines (3 levels)
    for (let i = 0; i <= 2; i++) {
      const y = padding + (height - padding * 2) * (i / 2);
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw Area Gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, props.color.replace(')', ', 0.2)').replace('hsl', 'hsla'));
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.beginPath();
  ctx.moveTo(padding, height);
  displayPoints.forEach((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    ctx.lineTo(x, y);
  });
  ctx.lineTo(padding + (displayPoints.length - 1) * stepX, height);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw Line
  ctx.beginPath();
  ctx.strokeStyle = props.color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  displayPoints.forEach((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw latest point dot
  const lastVal = displayPoints[displayPoints.length - 1];
  const lastX = padding + (displayPoints.length - 1) * stepX;
  const lastY = height - padding - ((lastVal - min) / range) * (height - padding * 2);

  ctx.beginPath();
  ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
  ctx.fillStyle = props.color;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.stroke();
};

const handleResize = () => {
  drawChart();
};

onMounted(() => {
  drawChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Watch for data changes to re-draw
watch(() => props.data, () => {
  drawChart();
}, { deep: true });
</script>

<template>
  <div ref="containerRef" class="trend-chart-container relative overflow-hidden" :style="{ height: `${height}px` }">
    <canvas ref="canvasRef" class="block w-full h-full"></canvas>
  </div>
</template>

<style scoped>
.trend-chart-container {
  /* Using global.css theme variable for background alpha */
  background-color: hsla(220, 12%, 22%, 0.2);
}
</style>
