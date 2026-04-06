
import type { DeviceCommandLogData } from './DeviceCommandLogData'
import { apiClient, type ApiResponse, type PaginatedResponse } from '../lib/api'

export interface DeviceCommandLogVO extends DeviceCommandLogData {
  commandLabel: string
}

export interface CommandQueryParams {
  page?: number
  size?: number
  deviceId?: string
  commandType?: string
  commandStatus?: string
  startTime?: string
  endTime?: string
  sort?: string
}

export interface CommandListResponse extends PaginatedResponse<DeviceCommandLogData> {}

// Keep mock data for backward compatibility
export const deviceCommandLogDataList: DeviceCommandLogData[] = [
  {
    id: 'cmd-001',
    deviceId: 'dev-001',
    commandType: 'START',
    commandStatus: 'SUCCESS',
    executedAt: '2026-04-03T07:18:00+08:00',
    operatorName: '护士站A-张婷',
    message: '已启动输液任务'
  },
  {
    id: 'cmd-002',
    deviceId: 'dev-003',
    commandType: 'START',
    commandStatus: 'SUCCESS',
    executedAt: '2026-04-03T07:25:10+08:00',
    operatorName: '护士站B-刘洋',
    message: '远程启动成功'
  },
  {
    id: 'cmd-003',
    deviceId: 'dev-005',
    commandType: 'STOP',
    commandStatus: 'FAILED',
    executedAt: '2026-04-03T07:58:20+08:00',
    operatorName: '护士站A-张婷',
    message: '设备离线，停止指令未送达'
  },
  {
    id: 'cmd-004',
    deviceId: 'dev-004',
    commandType: 'START',
    commandStatus: 'PENDING',
    executedAt: '2026-04-03T08:00:00+08:00',
    operatorName: '医生站-王磊',
    message: '等待设备确认'
  },
  {
    id: 'cmd-005',
    deviceId: 'dev-002',
    commandType: 'STOP',
    commandStatus: 'SUCCESS',
    executedAt: '2026-04-03T08:05:00+08:00',
    operatorName: '护士站C-孙悦',
    message: '输液完成后自动停止'
  },
  {
    id: 'cmd-006',
    deviceId: 'dev-006',
    commandType: 'START',
    commandStatus: 'SUCCESS',
    executedAt: '2026-04-03T08:10:30+08:00',
    operatorName: '护士站D-陈晨',
    message: '已恢复运行'
  }
]

// API-based functions
export async function getCommands(params: CommandQueryParams = {}): Promise<ApiResponse<CommandListResponse>> {
  const queryParams: Record<string, string> = {}
  if (params.page !== undefined) queryParams.page = params.page.toString()
  if (params.size !== undefined) queryParams.size = params.size.toString()
  if (params.deviceId) queryParams.deviceId = params.deviceId
  if (params.commandType) queryParams.commandType = params.commandType
  if (params.commandStatus) queryParams.commandStatus = params.commandStatus
  if (params.startTime) queryParams.startTime = params.startTime
  if (params.endTime) queryParams.endTime = params.endTime
  if (params.sort) queryParams.sort = params.sort

  return apiClient.get<CommandListResponse>('/api/v1/commands', queryParams)
}

export async function getCommandById(id: string): Promise<ApiResponse<DeviceCommandLogData>> {
  return apiClient.get<DeviceCommandLogData>(`/api/v1/commands/${id}`)
}

// Mock-based functions for backward compatibility
export function getAll(): DeviceCommandLogData[] {
  return deviceCommandLogDataList
}

export function getById(id: string): DeviceCommandLogData | undefined {
  return deviceCommandLogDataList.find(item => item.id === id)
}

export function query(params: {
  keyword?: string
  filter?: Partial<Record<'deviceId' | 'commandType' | 'commandStatus', string | string[]>>
  sortKey?: keyof DeviceCommandLogData
  sortDirection?: 'asc' | 'desc'
}): DeviceCommandLogData[] {
  const keyword = params.keyword?.trim().toLowerCase()
  const filter = params.filter ?? {}
  const list = deviceCommandLogDataList.filter(item => {
    const matchKeyword = !keyword || [item.operatorName, item.message, item.commandType, item.commandStatus].some(value => value.toLowerCase().includes(keyword))
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

export function getByDeviceIdVO(deviceId: string): DeviceCommandLogVO[] {
  return deviceCommandLogDataList
    .filter(item => item.deviceId === deviceId)
    .map(item => ({ ...item, commandLabel: `${item.commandType} / ${item.commandStatus}` }))
}

export function queryVO(params: {
  keyword?: string
  filter?: Partial<Record<'deviceId' | 'commandType' | 'commandStatus', string | string[]>>
  sortKey?: keyof DeviceCommandLogData
  sortDirection?: 'asc' | 'desc'
}): DeviceCommandLogVO[] {
  return query(params).map(item => ({ ...item, commandLabel: `${item.commandType} / ${item.commandStatus}` }))
}
