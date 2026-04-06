
import type { SystemMetricData } from './SystemMetricData'
import { apiClient, type ApiResponse, type PaginatedResponse } from '../lib/api'

export interface SystemMetricVO extends SystemMetricData {
  displayValue: string
}

export interface MetricQueryParams {
  page?: number
  size?: number
  metricName?: string
  status?: string
  startTime?: string
  endTime?: string
}

export interface MetricListResponse extends PaginatedResponse<SystemMetricData> {}

export interface HealthResponse {
  status: string
}

// Keep mock data for backward compatibility
export const systemMetricDataList: SystemMetricData[] = [
  {
    id: 'metric-001',
    connectionId: 'sys-001',
    metricName: 'MQTT 延迟',
    metricValue: 28,
    unit: 'ms',
    status: 'NORMAL',
    recordedAt: '2026-04-03T08:21:00+08:00'
  },
  {
    id: 'metric-002',
    connectionId: 'sys-001',
    metricName: '活跃设备',
    metricValue: 5,
    unit: '台',
    status: 'NORMAL',
    recordedAt: '2026-04-03T08:21:00+08:00'
  },
  {
    id: 'metric-003',
    connectionId: 'sys-001',
    metricName: '离线设备',
    metricValue: 1,
    unit: '台',
    status: 'WARN',
    recordedAt: '2026-04-03T08:21:00+08:00'
  },
  {
    id: 'metric-004',
    connectionId: 'sys-001',
    metricName: 'API 响应时间',
    metricValue: 146,
    unit: 'ms',
    status: 'NORMAL',
    recordedAt: '2026-04-03T08:21:00+08:00'
  }
]

// API-based functions
export async function getSystemMetrics(params: MetricQueryParams = {}): Promise<ApiResponse<MetricListResponse>> {
  const queryParams: Record<string, string> = {}
  if (params.page !== undefined) queryParams.page = params.page.toString()
  if (params.size !== undefined) queryParams.size = params.size.toString()
  if (params.metricName) queryParams.metricName = params.metricName
  if (params.status) queryParams.status = params.status
  if (params.startTime) queryParams.startTime = params.startTime
  if (params.endTime) queryParams.endTime = params.endTime

  return apiClient.get<MetricListResponse>('/api/v1/system/metrics', queryParams)
}

export async function getSystemHealth(): Promise<ApiResponse<HealthResponse>> {
  return apiClient.get<HealthResponse>('/api/v1/system/health')
}

// Mock-based functions for backward compatibility
export function getAll(): SystemMetricData[] {
  return systemMetricDataList
}

export function getById(id: string): SystemMetricData | undefined {
  return systemMetricDataList.find(item => item.id === id)
}

export function query(params: {
  keyword?: string
  filter?: Partial<Record<'connectionId' | 'status', string | string[]>>
  sortKey?: keyof SystemMetricData
  sortDirection?: 'asc' | 'desc'
}): SystemMetricData[] {
  const keyword = params.keyword?.trim().toLowerCase()
  const filter = params.filter ?? {}
  const list = systemMetricDataList.filter(item => {
    const matchKeyword = !keyword || [item.metricName, item.status, item.unit].some(value => value.toLowerCase().includes(keyword))
    const matchFilter = Object.entries(filter).every(([key, val]) => {
      if (val === undefined) return true
      const itemVal = (item as any)[key]
      return Array.isArray(val) ? val.includes(itemVal) : itemVal === val
    })
    return matchKeyword && matchFilter
  })
  const sortKey = params.sortKey
  if (!sortKey) return list
  return [...list].sort((a, b) => {
    const av = String(a[sortKey] ?? '')
    const bv = String(b[sortKey] ?? '')
    return params.sortDirection === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv)
  })
}

export function getAllVO(): SystemMetricVO[] {
  return systemMetricDataList.map(item => ({ ...item, displayValue: `${item.metricValue}${item.unit}` }))
}

export function queryVO(params: {
  keyword?: string
  filter?: Partial<Record<'connectionId' | 'status', string | string[]>>
  sortKey?: keyof SystemMetricData
  sortDirection?: 'asc' | 'desc'
}): SystemMetricVO[] {
  return query(params).map(item => ({ ...item, displayValue: `${item.metricValue}${item.unit}` }))
}
