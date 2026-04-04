
export interface InfusionDeviceData {
  id: string
  deviceId: string
  wardId: string
  bedNumber: string
  deviceName: string
  modelName: string
  status: 'WORKING' | 'IDLE' | 'OFFLINE' | 'ERROR'
  alarmStatus: 'COMPLETE' | 'ERROR' | 'LOW' | 'FAST' | 'NORMAL'
  onlineStatus: 'ONLINE' | 'OFFLINE'
  batteryLevel: number
  targetDripRate: number
  lastSeenAt: string
  createdAt: string
}
