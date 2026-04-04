
export interface SystemMetricData {
  id: string
  connectionId: string
  metricName: string
  metricValue: number
  unit: string
  status: 'NORMAL' | 'WARN' | 'CRITICAL'
  recordedAt: string
}
