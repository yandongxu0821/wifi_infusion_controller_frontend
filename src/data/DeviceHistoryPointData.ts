
export interface DeviceHistoryPointData {
  id: string
  deviceId: string
  timestamp: string
  dripRate: number
  status: 'WORKING' | 'IDLE' | 'OFFLINE' | 'ERROR'
  alarmStatus: 'COMPLETE' | 'ERROR' | 'LOW' | 'FAST' | 'NORMAL'
}
