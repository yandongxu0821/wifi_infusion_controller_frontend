
import type { SystemConnectionData } from './SystemConnectionData'
import { apiClient, type ApiResponse } from '../lib/api'

export interface SystemConnectionVO extends SystemConnectionData {
  stateLabel: string
}

// Keep mock data for backward compatibility
export const systemConnectionDataList: SystemConnectionData[] = [
  {
    id: 'sys-001',
    connectionState: 'CONNECTED',
    apiState: 'HEALTHY',
    mqttState: 'HEALTHY',
    websocketState: 'HEALTHY',
    lastSyncAt: '2026-04-03T08:21:00+08:00',
    uptimeMinutes: 1280,
    activeDeviceCount: 5,
    offlineDeviceCount: 1,
    latencyMs: 28
  }
]

// API-based functions
export async function getSystemStatus(): Promise<ApiResponse<SystemConnectionData>> {
  return apiClient.get<SystemConnectionData>('/api/v1/system/status')
}

// Mock-based functions for backward compatibility
export function getAll(): SystemConnectionData[] {
  return systemConnectionDataList
}

export function getById(id: string): SystemConnectionData | undefined {
  return systemConnectionDataList.find(item => item.id === id)
}

export function query(params: {
  keyword?: string
  filter?: Partial<Record<'connectionState' | 'apiState' | 'mqttState' | 'websocketState', string | string[]>>
  sortKey?: keyof SystemConnectionData
  sortDirection?: 'asc' | 'desc'
}): SystemConnectionData[] {
  const keyword = params.keyword?.trim().toLowerCase()
  const filter = params.filter ?? {}
  const list = systemConnectionDataList.filter(item => {
    const matchKeyword = !keyword || [item.connectionState, item.apiState, item.mqttState, item.websocketState].some(value => value.toLowerCase().includes(keyword))
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

export function getAllVO(): SystemConnectionVO[] {
  return systemConnectionDataList.map(item => ({ ...item, stateLabel: item.connectionState }))
}

export function getByIdVO(id: string): SystemConnectionVO | undefined {
  const item = getById(id)
  return item ? { ...item, stateLabel: item.connectionState } : undefined
}

export function queryVO(params: {
  keyword?: string
  filter?: Partial<Record<'connectionState' | 'apiState' | 'mqttState' | 'websocketState', string | string[]>>
  sortKey?: keyof SystemConnectionData
  sortDirection?: 'asc' | 'desc'
}): SystemConnectionVO[] {
  return query(params).map(item => ({ ...item, stateLabel: item.connectionState }))
}
