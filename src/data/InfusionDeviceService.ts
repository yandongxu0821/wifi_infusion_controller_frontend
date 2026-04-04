
import type { InfusionDeviceData } from './InfusionDeviceData'
import { getById as getWardById } from './WardService'

export interface InfusionDeviceVO extends InfusionDeviceData {
  wardName: string
  wardCode: string
  wardType: string
  buildingName: string
}

export const infusionDeviceDataList: InfusionDeviceData[] = [
  {
    id: 'dev-001',
    deviceId: 'INF-240001',
    wardId: 'ward-icu-01',
    bedNumber: 'A-01',
    deviceName: '输液泵-01',
    modelName: 'MedFlow X8',
    status: 'WORKING',
    alarmStatus: 'NORMAL',
    onlineStatus: 'ONLINE',
    batteryLevel: 86,
    targetDripRate: 18,
    lastSeenAt: '2026-04-03T08:21:00+08:00',
    createdAt: '2026-03-28T09:10:00+08:00'
  },
  {
    id: 'dev-002',
    deviceId: 'INF-240002',
    wardId: 'ward-icu-01',
    bedNumber: 'A-02',
    deviceName: '输液泵-02',
    modelName: 'MedFlow X8',
    status: 'IDLE',
    alarmStatus: 'COMPLETE',
    onlineStatus: 'ONLINE',
    batteryLevel: 91,
    targetDripRate: 0,
    lastSeenAt: '2026-04-03T08:20:20+08:00',
    createdAt: '2026-03-28T09:12:00+08:00'
  },
  {
    id: 'dev-003',
    deviceId: 'INF-240003',
    wardId: 'ward-icu-02',
    bedNumber: 'B-11',
    deviceName: '输液泵-03',
    modelName: 'MedFlow X6',
    status: 'WORKING',
    alarmStatus: 'FAST',
    onlineStatus: 'ONLINE',
    batteryLevel: 74,
    targetDripRate: 24,
    lastSeenAt: '2026-04-03T08:21:10+08:00',
    createdAt: '2026-03-29T10:05:00+08:00'
  },
  {
    id: 'dev-004',
    deviceId: 'INF-240004',
    wardId: 'ward-med-01',
    bedNumber: 'C-08',
    deviceName: '输液泵-04',
    modelName: 'MedFlow Pro',
    status: 'WORKING',
    alarmStatus: 'LOW',
    onlineStatus: 'ONLINE',
    batteryLevel: 62,
    targetDripRate: 12,
    lastSeenAt: '2026-04-03T08:19:40+08:00',
    createdAt: '2026-03-30T14:30:00+08:00'
  },
  {
    id: 'dev-005',
    deviceId: 'INF-240005',
    wardId: 'ward-surg-01',
    bedNumber: 'D-03',
    deviceName: '输液泵-05',
    modelName: 'MedFlow Pro',
    status: 'ERROR',
    alarmStatus: 'ERROR',
    onlineStatus: 'OFFLINE',
    batteryLevel: 18,
    targetDripRate: 0,
    lastSeenAt: '2026-04-03T07:58:12+08:00',
    createdAt: '2026-03-31T08:20:00+08:00'
  },
  {
    id: 'dev-006',
    deviceId: 'INF-240006',
    wardId: 'ward-er-01',
    bedNumber: 'E-02',
    deviceName: '输液泵-06',
    modelName: 'MedFlow X6',
    status: 'IDLE',
    alarmStatus: 'NORMAL',
    onlineStatus: 'ONLINE',
    batteryLevel: 79,
    targetDripRate: 0,
    lastSeenAt: '2026-04-03T08:20:50+08:00',
    createdAt: '2026-04-01T11:00:00+08:00'
  }
]

export function getAll(): InfusionDeviceData[] {
  return infusionDeviceDataList
}

export function getById(id: string): InfusionDeviceData | undefined {
  return infusionDeviceDataList.find(item => item.id === id)
}

export function query(params: {
  keyword?: string
  filter?: Partial<Record<'status' | 'alarmStatus' | 'onlineStatus' | 'wardId', string | string[]>>
  sortKey?: keyof InfusionDeviceData
  sortDirection?: 'asc' | 'desc'
}): InfusionDeviceData[] {
  const keyword = params.keyword?.trim().toLowerCase()
  const filter = params.filter ?? {}
  const list = infusionDeviceDataList.filter(item => {
    const matchKeyword = !keyword || [item.deviceId, item.deviceName, item.modelName, item.bedNumber].some(value => value.toLowerCase().includes(keyword))
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

function toVO(item: InfusionDeviceData): InfusionDeviceVO {
  const ward = getWardById(item.wardId)
  return {
    ...item,
    wardName: ward?.wardName ?? '',
    wardCode: ward?.wardCode ?? '',
    wardType: ward?.wardType ?? '',
    buildingName: ward?.buildingName ?? ''
  }
}

export function getAllVO(): InfusionDeviceVO[] {
  return infusionDeviceDataList.map(toVO)
}

export function getByIdVO(id: string): InfusionDeviceVO | undefined {
  const item = getById(id)
  return item ? toVO(item) : undefined
}

export function queryVO(params: {
  keyword?: string
  filter?: Partial<Record<'status' | 'alarmStatus' | 'onlineStatus' | 'wardId', string | string[]>>
  sortKey?: keyof InfusionDeviceData
  sortDirection?: 'asc' | 'desc'
}): InfusionDeviceVO[] {
  return query(params).map(toVO)
}
