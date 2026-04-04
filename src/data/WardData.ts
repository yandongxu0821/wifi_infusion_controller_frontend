
export interface WardData {
  id: string
  wardCode: string
  wardName: string
  buildingName: string
  floorLabel: string
  wardType: 'ICU' | 'General' | 'Surgery' | 'Emergency'
  managerName: string
  contactPhone: string
  status: 'ACTIVE' | 'MAINTENANCE'
}
