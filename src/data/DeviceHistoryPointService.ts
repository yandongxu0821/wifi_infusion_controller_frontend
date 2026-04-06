
import type { DeviceHistoryPointData } from './DeviceHistoryPointData'
import { apiClient, type ApiResponse } from '../lib/api'

export interface DeviceHistoryPointVO extends DeviceHistoryPointData {
  seqLabel: string
}

export interface HistoryQueryParams {
  startTime: string
  endTime: string
  interval?: string
}

// Keep mock data for backward compatibility
export const deviceHistoryPointDataList: DeviceHistoryPointData[] = [
  { id: 'hist-001', deviceId: 'dev-001', timestamp: '2026-04-03T07:30:00+08:00', dripRate: 16, status: 'WORKING', alarmStatus: 'NORMAL' },
  { id: 'hist-002', deviceId: 'dev-001', timestamp: '2026-04-03T07:40:00+08:00', dripRate: 17, status: 'WORKING', alarmStatus: 'NORMAL' },
  { id: 'hist-003', deviceId: 'dev-001', timestamp: '2026-04-03T07:50:00+08:00', dripRate: 18, status: 'WORKING', alarmStatus: 'NORMAL' },
  { id: 'hist-004', deviceId: 'dev-001', timestamp: '2026-04-03T08:00:00+08:00', dripRate: 19, status: 'WORKING', alarmStatus: 'NORMAL' },
  { id: 'hist-005', deviceId: 'dev-001', timestamp: '2026-04-03T08:10:00+08:00', dripRate: 18, status: 'WORKING', alarmStatus: 'NORMAL' },
  { id: 'hist-006', deviceId: 'dev-001', timestamp: '2026-04-03T08:20:00+08:00', dripRate: 18, status: 'WORKING', alarmStatus: 'NORMAL' },
  { id: 'hist-007', deviceId: 'dev-003', timestamp: '2026-04-03T07:30:00+08:00', dripRate: 20, status: 'WORKING', alarmStatus: 'FAST' },
  { id: 'hist-008', deviceId: 'dev-003', timestamp: '2026-04-03T07:40:00+08:00', dripRate: 22, status: 'WORKING', alarmStatus: 'FAST' },
  { id: 'hist-009', deviceId: 'dev-003', timestamp: '2026-04-03T07:50:00+08:00', dripRate: 23, status: 'WORKING', alarmStatus: 'FAST' },
  { id: 'hist-010', deviceId: 'dev-003', timestamp: '2026-04-03T08:00:00+08:00', dripRate: 24, status: 'WORKING', alarmStatus: 'FAST' },
  { id: 'hist-011', deviceId: 'dev-003', timestamp: '2026-04-03T08:10:00+08:00', dripRate: 25, status: 'WORKING', alarmStatus: 'FAST' },
  { id: 'hist-012', deviceId: 'dev-003', timestamp: '2026-04-03T08:20:00+08:00', dripRate: 24, status: 'WORKING', alarmStatus: 'FAST' }
]

// API-based functions
export async function getDeviceHistory(deviceId: string, params: HistoryQueryParams): Promise<ApiResponse<DeviceHistoryPointData[]>> {
  const queryParams: Record<string, string> = {
    startTime: params.startTime,
    endTime: params.endTime,
  }
  if (params.interval) queryParams.interval = params.interval

  return apiClient.get<DeviceHistoryPointData[]>(`/api/v1/devices/${deviceId}/history`, queryParams)
}

// Mock-based functions for backward compatibility
export function getAll(): DeviceHistoryPointData[] {
  return deviceHistoryPointDataList
}

export function getById(id: string): DeviceHistoryPointData | undefined {
  return deviceHistoryPointDataList.find(item => item.id === id)
}

export function query(params: {
  keyword?: string
  filter?: Partial<Record<'deviceId' | 'status' | 'alarmStatus', string | string[]>>
  sortKey?: keyof DeviceHistoryPointData
  sortDirection?: 'asc' | 'desc'
}): DeviceHistoryPointData[] {
  const filter = params.filter ?? {}
  const keyword = params.keyword?.trim().toLowerCase()
  const list = deviceHistoryPointDataList.filter(item => {
    const matchKeyword = !keyword || item.deviceId.toLowerCase().includes(keyword)
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

export function getByDeviceIdVO(deviceId: string): DeviceHistoryPointVO[] {
  return deviceHistoryPointDataList
    .filter(item => item.deviceId === deviceId)
    .map((item, index) => ({ ...item, seqLabel: `#${index + 1}` }))
}

export function queryVO(params: {
  keyword?: string
  filter?: Partial<Record<'deviceId' | 'status' | 'alarmStatus', string | string[]>>
  sortKey?: keyof DeviceHistoryPointData
  sortDirection?: 'asc' | 'desc'
}): DeviceHistoryPointVO[] {
  return query(params).map((item, index) => ({ ...item, seqLabel: `#${index + 1}` }))
}
