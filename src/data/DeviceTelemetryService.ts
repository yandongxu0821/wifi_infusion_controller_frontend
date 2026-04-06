
import type { DeviceTelemetryData } from './DeviceTelemetryData'
import { apiClient, type ApiResponse } from '../lib/api'

export interface DeviceTelemetryVO extends DeviceTelemetryData {
  trendPoints: number[]
}

export interface DeviceHistoryParams {
  startTime: string
  endTime: string
  interval?: string
}

// Keep mock data for backward compatibility
export const deviceTelemetryDataList: DeviceTelemetryData[] = [
  {
    id: 'telemetry-001',
    deviceId: 'dev-001',
    dripRate: 18,
    status: 'WORKING',
    alarmStatus: 'NORMAL',
    signalStrength: 94,
    temperature: 36.8,
    timestamp: '2026-04-03T08:21:00+08:00'
  },
  {
    id: 'telemetry-002',
    deviceId: 'dev-002',
    dripRate: 0,
    status: 'IDLE',
    alarmStatus: 'COMPLETE',
    signalStrength: 96,
    temperature: 36.6,
    timestamp: '2026-04-03T08:20:20+08:00'
  },
  {
    id: 'telemetry-003',
    deviceId: 'dev-003',
    dripRate: 24,
    status: 'WORKING',
    alarmStatus: 'FAST',
    signalStrength: 88,
    temperature: 37.1,
    timestamp: '2026-04-03T08:21:10+08:00'
  },
  {
    id: 'telemetry-004',
    deviceId: 'dev-004',
    dripRate: 12,
    status: 'WORKING',
    alarmStatus: 'LOW',
    signalStrength: 81,
    temperature: 36.9,
    timestamp: '2026-04-03T08:19:40+08:00'
  },
  {
    id: 'telemetry-005',
    deviceId: 'dev-005',
    dripRate: 0,
    status: 'ERROR',
    alarmStatus: 'ERROR',
    signalStrength: 22,
    temperature: 38.2,
    timestamp: '2026-04-03T07:58:12+08:00'
  },
  {
    id: 'telemetry-006',
    deviceId: 'dev-006',
    dripRate: 0,
    status: 'IDLE',
    alarmStatus: 'NORMAL',
    signalStrength: 90,
    temperature: 36.7,
    timestamp: '2026-04-03T08:20:50+08:00'
  }
]

// API-based functions
export async function getDeviceTelemetry(deviceId: string): Promise<ApiResponse<DeviceTelemetryData>> {
  return apiClient.get<DeviceTelemetryData>(`/api/v1/devices/${deviceId}/telemetry`)
}

export async function getDeviceHistory(deviceId: string, params: DeviceHistoryParams): Promise<ApiResponse<DeviceTelemetryData[]>> {
  const queryParams: Record<string, string> = {
    startTime: params.startTime,
    endTime: params.endTime,
  }
  if (params.interval) queryParams.interval = params.interval

  return apiClient.get<DeviceTelemetryData[]>(`/api/v1/devices/${deviceId}/history`, queryParams)
}

// Mock-based functions for backward compatibility
export function getAll(): DeviceTelemetryData[] {
  return deviceTelemetryDataList
}

export function getById(id: string): DeviceTelemetryData | undefined {
  return deviceTelemetryDataList.find(item => item.id === id)
}

export function query(params: {
  keyword?: string
  filter?: Partial<Record<'deviceId' | 'status' | 'alarmStatus', string | string[]>>
  sortKey?: keyof DeviceTelemetryData
  sortDirection?: 'asc' | 'desc'
}): DeviceTelemetryData[] {
  const keyword = params.keyword?.trim().toLowerCase()
  const filter = params.filter ?? {}
  const list = deviceTelemetryDataList.filter(item => {
    const matchKeyword = !keyword || [item.deviceId, item.status, item.alarmStatus].some(value => value.toLowerCase().includes(keyword))
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

export function getByDeviceIdVO(deviceId: string): DeviceTelemetryVO | undefined {
  const item = deviceTelemetryDataList.find(row => row.deviceId === deviceId)
  return item ? { ...item, trendPoints: [8, 10, 12, 11, 13, 14, 16, 18] } : undefined
}

export function queryVO(params: {
  keyword?: string
  filter?: Partial<Record<'deviceId' | 'status' | 'alarmStatus', string | string[]>>
  sortKey?: keyof DeviceTelemetryData
  sortDirection?: 'asc' | 'desc'
}): DeviceTelemetryVO[] {
  return query(params).map(item => ({ ...item, trendPoints: [8, 10, 12, 11, 13, 14, 16, 18] }))
}
