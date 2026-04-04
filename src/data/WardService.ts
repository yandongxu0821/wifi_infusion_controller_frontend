
import type { WardData } from './WardData'

export const wardDataList: WardData[] = [
  {
    id: 'ward-icu-01',
    wardCode: 'ICU-01',
    wardName: '重症监护一科',
    buildingName: '住院楼A座',
    floorLabel: '12F',
    wardType: 'ICU',
    managerName: '李敏',
    contactPhone: '021-58761234',
    status: 'ACTIVE'
  },
  {
    id: 'ward-icu-02',
    wardCode: 'ICU-02',
    wardName: '重症监护二科',
    buildingName: '住院楼A座',
    floorLabel: '11F',
    wardType: 'ICU',
    managerName: '周航',
    contactPhone: '021-58761235',
    status: 'ACTIVE'
  },
  {
    id: 'ward-med-01',
    wardCode: 'MED-01',
    wardName: '内科一病区',
    buildingName: '住院楼B座',
    floorLabel: '8F',
    wardType: 'General',
    managerName: '王芳',
    contactPhone: '021-66991120',
    status: 'ACTIVE'
  },
  {
    id: 'ward-surg-01',
    wardCode: 'SUR-01',
    wardName: '外科术后观察区',
    buildingName: '住院楼B座',
    floorLabel: '6F',
    wardType: 'Surgery',
    managerName: '陈杰',
    contactPhone: '021-66991121',
    status: 'ACTIVE'
  },
  {
    id: 'ward-er-01',
    wardCode: 'ER-01',
    wardName: '急诊留观区',
    buildingName: '急诊楼',
    floorLabel: '3F',
    wardType: 'Emergency',
    managerName: '赵琳',
    contactPhone: '021-55008821',
    status: 'MAINTENANCE'
  }
]

export function getAll(): WardData[] {
  return wardDataList
}

export function getById(id: string): WardData | undefined {
  return wardDataList.find(item => item.id === id)
}

export function query(params: {
  keyword?: string
  filter?: Partial<Record<'wardType' | 'status' | 'buildingName', string | string[]>>
  sortKey?: keyof WardData
  sortDirection?: 'asc' | 'desc'
}): WardData[] {
  const keyword = params.keyword?.trim().toLowerCase()
  const filter = params.filter ?? {}
  const list = wardDataList.filter(item => {
    const matchKeyword = !keyword || [item.wardCode, item.wardName, item.buildingName, item.managerName].some(value => value.toLowerCase().includes(keyword))
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
