
export interface SystemConnectionData {
  id: string
  connectionState: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED'
  apiState: 'HEALTHY' | 'SLOW' | 'DOWN'
  mqttState: 'HEALTHY' | 'RECONNECTING' | 'DOWN'
  websocketState: 'HEALTHY' | 'RECONNECTING' | 'DOWN'
  lastSyncAt: string
  uptimeMinutes: number
  activeDeviceCount: number
  offlineDeviceCount: number
  latencyMs: number
}
