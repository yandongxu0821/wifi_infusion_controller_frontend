
export interface DeviceCommandLogData {
  id: string
  deviceId: string
  commandType: 'START' | 'STOP'
  commandStatus: 'SUCCESS' | 'FAILED' | 'PENDING'
  executedAt: string
  operatorName: string
  message: string
}
