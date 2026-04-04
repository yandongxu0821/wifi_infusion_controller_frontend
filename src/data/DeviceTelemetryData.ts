
export interface DeviceTelemetryData {
  id: string
  deviceId: string
  dripRate: number
  status: 'WORKING' | 'IDLE' | 'OFFLINE' | 'ERROR'
  alarmStatus: 'COMPLETE' | 'ERROR' | 'LOW' | 'FAST' | 'NORMAL'
  signalStrength: number
  temperature: number
  timestamp: string
}
