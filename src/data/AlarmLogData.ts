
export interface AlarmLogData {
  id: string
  deviceId: string
  severity: 'COMPLETE' | 'ERROR' | 'LOW' | 'FAST'
  alarmType: string
  occurredAt: string
  durationMinutes: number
  isHandled: boolean
  handledAt: string | null
  message: string
}
