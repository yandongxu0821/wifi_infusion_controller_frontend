
import type { AlarmLogData } from './AlarmLogData'
import { getById as getDeviceById } from './InfusionDeviceService'
import { apiClient, type ApiResponse, type PaginatedResponse } from '../lib/api'

export interface AlarmLogVO extends AlarmLogData {
  severityLabel: string
}

export interface AlarmLogWithDeviceVO extends AlarmLogVO {
  deviceName: string
  wardId: string
  bedNumber: string
}

export interface AlarmQueryParams {
  page?: number
  size?: number
  keyword?: string
  deviceId?: string
  severity?: string
  isHandled?: string
  startTime?: string
  endTime?: string
  sort?: string
}

export interface AlarmListResponse extends PaginatedResponse<AlarmLogData> {}

export interface HandleAlarmRequest {
  operatorName: string
  handledAt: string
  message: string
}

// Keep mock data for backward compatibility
export const alarmLogDataList: AlarmLogData[] = [
  {
    id: 'alarm-001',
    deviceId: 'dev-003',
    severity: 'FAST',
    alarmType: '滴速过快',
    occurredAt: '2026-04-03T07:48:00+08:00',
    durationMinutes: 12,
    isHandled: false,
    handledAt: null,
    message: '滴速持续高于阈值'
  },
  {
    id: 'alarm-002',
    deviceId: 'dev-004',
    severity: 'LOW',
    alarmType: '滴速过低',
    occurredAt: '2026-04-03T07:55:00+08:00',
    durationMinutes: 8,
    isHandled: true,
    handledAt: '2026-04-03T08:04:00+08:00',
    message: '已远程调整目标滴速'
  },
  {
    id: 'alarm-003',
    deviceId: 'dev-005',
    severity: 'ERROR',
    alarmType: '设备离线',
    occurredAt: '2026-04-03T07:58:00+08:00',
    durationMinutes: 25,
    isHandled: false,
    handledAt: null,
    message: 'MQTT 心跳中断'
  },
  {
    id: 'alarm-004',
    deviceId: 'dev-002',
    severity: 'COMPLETE',
    alarmType: '输液完成',
    occurredAt: '2026-04-03T08:05:00+08:00',
    durationMinutes: 0,
    isHandled: true,
    handledAt: '2026-04-03T08:05:20+08:00',
    message: '本次输液任务已结束'
  },
  {
    id: 'alarm-005',
    deviceId: 'dev-001',
    severity: 'FAST',
    alarmType: '波动预警',
    occurredAt: '2026-04-03T08:12:00+08:00',
    durationMinutes: 3,
    isHandled: true,
    handledAt: '2026-04-03T08:15:00+08:00',
    message: '短时波动已恢复'
  },
  {
    id: 'alarm-006',
    deviceId: 'dev-006',
    severity: 'LOW',
    alarmType: '压力偏低',
    occurredAt: '2026-04-03T08:18:00+08:00',
    durationMinutes: 5,
    isHandled: false,
    handledAt: null,
    message: '需关注管路状态'
  }
]

// API-based functions
export async function getAlarms(params: AlarmQueryParams = {}): Promise<ApiResponse<AlarmListResponse>> {
  const queryParams: Record<string, string> = {}
  if (params.page !== undefined) queryParams.page = params.page.toString()
  if (params.size !== undefined) queryParams.size = params.size.toString()
  if (params.keyword) queryParams.keyword = params.keyword
  if (params.deviceId) queryParams.deviceId = params.deviceId
  if (params.severity) queryParams.severity = params.severity
  if (params.isHandled) queryParams.isHandled = params.isHandled
  if (params.startTime) queryParams.startTime = params.startTime
  if (params.endTime) queryParams.endTime = params.endTime
  if (params.sort) queryParams.sort = params.sort

  return apiClient.get<AlarmListResponse>('/api/v1/alarms', queryParams)
}

export async function getAlarmById(id: string): Promise<ApiResponse<AlarmLogData>> {
  return apiClient.get<AlarmLogData>(`/api/v1/alarms/${id}`)
}

export async function handleAlarm(id: string, request: HandleAlarmRequest): Promise<ApiResponse<AlarmLogData>> {
  return apiClient.put<AlarmLogData>(`/api/v1/alarms/${id}/handle`, request)
}

export async function getUnhandledAlarmCount(): Promise<ApiResponse<{ count: number }>> {
  return apiClient.get<{ count: number }>('/api/v1/alarms/unhandled/count')
}

// Mock-based functions for backward compatibility
export function getAll(): AlarmLogData[] {
  return alarmLogDataList
}

export function getById(id: string): AlarmLogData | undefined {
  return alarmLogDataList.find(item => item.id === id)
}

export function query(params: {
  keyword?: string
  filter?: Partial<Record<'deviceId' | 'severity' | 'isHandled', string | string[]>>
  sortKey?: keyof AlarmLogData
  sortDirection?: 'asc' | 'desc'
}): AlarmLogData[] {
  const keyword = params.keyword?.trim().toLowerCase()
  const filter = params.filter ?? {}
  const list = alarmLogDataList.filter(item => {
    const matchKeyword = !keyword || [item.alarmType, item.message, item.severity].some(value => value.toLowerCase().includes(keyword))
    const matchFilter = Object.entries(filter).every(([key, val]) => {
      if (val === undefined) return true
      const itemVal = String((item as any)[key])
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

export function getByIdVO(id: string): AlarmLogVO | undefined {
  const item = getById(id)
  return item ? { ...item, severityLabel: item.severity } : undefined
}

export function getByDeviceIdVO(deviceId: string): AlarmLogWithDeviceVO[] {
  return alarmLogDataList
    .filter(item => item.deviceId === deviceId)
    .map(item => {
      const device = getDeviceById(item.deviceId)
      return {
        ...item,
        severityLabel: item.severity,
        deviceName: device?.deviceName ?? '',
        wardId: device?.wardId ?? '',
        bedNumber: device?.bedNumber ?? ''
      }
    })
}

export function queryVO(params: {
  keyword?: string
  filter?: Partial<Record<'deviceId' | 'severity' | 'isHandled', string | string[]>>
  sortKey?: keyof AlarmLogData
  sortDirection?: 'asc' | 'desc'
}): AlarmLogVO[] {
  return query(params).map(item => ({ ...item, severityLabel: item.severity }))
}
