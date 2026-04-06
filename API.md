# API 文档

## 统一响应格式

所有 REST API 返回统一结构，HTTP 状态码配合 body 中的 `code` 字段。

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

分页列表返回：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [ ... ],
    "pageable": {
      "page": 1,
      "size": 20,
      "totalElements": 100,
      "totalPages": 5
    }
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

错误返回示例：

```json
{
  "code": 400,
  "message": "Invalid request parameters",
  "errors": ["status must be one of: WORKING, IDLE, ERROR, OFFLINE"],
  "timestamp": "2026-04-06T10:30:00Z"
}
```

---

## 1. 设备管理

### 1.1 获取设备列表

- URL：`GET /api/v1/devices`
- 说明：获取设备列表，支持分页、过滤、排序和关键词搜索。
- 请求参数（Query）：
  - `page` (整数，可选，默认 `1`)
  - `size` (整数，可选，默认 `20`)
  - `keyword` (字符串，可选)
  - `status` (字符串，可选，枚举：`WORKING`、`IDLE`、`ERROR`、`OFFLINE`)
  - `alarmStatus` (字符串，可选，枚举：`COMPLETE`、`ERROR`、`LOW`、`FAST`、`NORMAL`)
  - `onlineStatus` (字符串，可选，枚举：`ONLINE`、`OFFLINE`)
  - `wardId` (字符串，可选)
  - `sort` (字符串，可选，如 `createdAt:desc`、`batteryLevel:asc`)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": "dev-001",
        "deviceId": "INF-240001",
        "wardId": "ward-icu-01",
        "bedNumber": "A-01",
        "deviceName": "输液泵-01",
        "modelName": "MedFlow X8",
        "status": "WORKING",
        "alarmStatus": "NORMAL",
        "onlineStatus": "ONLINE",
        "batteryLevel": 86,
        "targetDripRate": 18,
        "lastSeenAt": "2026-04-03T08:21:00+08:00",
        "createdAt": "2026-03-28T09:10:00+08:00"
      }
    ],
    "pageable": {
      "page": 1,
      "size": 20,
      "totalElements": 6,
      "totalPages": 1
    }
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 1.2 获取单个设备详情 

**UNUSED**

- URL：`GET /api/v1/devices/{id}`
- 说明：按设备内部 `id` 查询设备详情。
- 路径参数：
  - `id` (字符串，必填)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "dev-001",
    "deviceId": "INF-240001",
    "wardId": "ward-icu-01",
    "bedNumber": "A-01",
    "deviceName": "输液泵-01",
    "modelName": "MedFlow X8",
    "status": "WORKING",
    "alarmStatus": "NORMAL",
    "onlineStatus": "ONLINE",
    "batteryLevel": 86,
    "targetDripRate": 18,
    "lastSeenAt": "2026-04-03T08:21:00+08:00",
    "createdAt": "2026-03-28T09:10:00+08:00"
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 1.3 发送设备命令

- URL：`POST /api/v1/devices/{id}/commands`
- 说明：向设备发送启动或停止指令。
- 路径参数：
  - `id` (字符串，必填)
- 请求体：
```json
{
  "commandType": "START",
  "operatorName": "张三",
  "message": "远程启动"
}
```
- 说明：`commandType` 枚举：`START`、`STOP`。

- 返回示例：
```json
{
  "code": 200,
  "message": "command sent",
  "data": {
    "id": "cmd-001",
    "deviceId": "dev-001",
    "commandType": "START",
    "commandStatus": "PENDING",
    "executedAt": "2026-04-06T10:30:00+08:00",
    "operatorName": "张三",
    "message": "远程启动"
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 1.4 获取设备最新遥测数据

- URL：`GET /api/v1/devices/{id}/telemetry`
- 说明：获取设备当前或最近一次遥测数据。
- 路径参数：
  - `id` (字符串，必填)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "telemetry-001",
    "deviceId": "dev-001",
    "dripRate": 18,
    "status": "WORKING",
    "alarmStatus": "NORMAL",
    "signalStrength": 94,
    "temperature": 36.8,
    "timestamp": "2026-04-03T08:21:00+08:00"
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 1.5 获取设备历史数据

- URL：`GET /api/v1/devices/{id}/history`
- 说明：获取设备历史趋势点。
- 路径参数：
  - `id` (字符串，必填)
- 请求参数（Query）：
  - `startTime` (字符串，必填，ISO 8601)
  - `endTime` (字符串，必填，ISO 8601)
  - `interval` (字符串，可选，如 `1m`, `5m`, `1h`)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "history-001",
      "deviceId": "dev-001",
      "timestamp": "2026-04-06T08:00:00+08:00",
      "dripRate": 16,
      "status": "WORKING",
      "alarmStatus": "NORMAL"
    }
  ],
  "timestamp": "2026-04-06T10:30:00Z"
}
```

---

## 2. 报警管理

### 2.1 获取报警列表

- URL：`GET /api/v1/alarms`
- 说明：获取报警日志列表，可按条件过滤。
- 请求参数（Query）：
  - `page` (整数，可选，默认 `1`)
  - `size` (整数，可选，默认 `20`)
  - `keyword` (字符串，可选)
  - `deviceId` (字符串，可选)
  - `severity` (字符串，可选，枚举：`COMPLETE`、`ERROR`、`LOW`、`FAST`)
  - `isHandled` (字符串，可选，`true` 或 `false`)
  - `startTime` (字符串，可选，ISO 8601)
  - `endTime` (字符串，可选，ISO 8601)
  - `sort` (字符串，可选，如 `occurredAt:desc`)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": "alarm-001",
        "deviceId": "dev-005",
        "severity": "ERROR",
        "alarmType": "堵塞",
        "occurredAt": "2026-04-06T09:15:00+08:00",
        "durationMinutes": 5,
        "isHandled": false,
        "handledAt": null,
        "message": "输液管路堵塞"
      }
    ],
    "pageable": {
      "page": 1,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1
    }
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 2.2 获取单个报警详情

- URL：`GET /api/v1/alarms/{id}`
- 说明：获取单条报警记录详情。
- 路径参数：
  - `id` (字符串，必填)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "alarm-001",
    "deviceId": "dev-005",
    "severity": "ERROR",
    "alarmType": "堵塞",
    "occurredAt": "2026-04-06T09:15:00+08:00",
    "durationMinutes": 5,
    "isHandled": false,
    "handledAt": null,
    "message": "输液管路堵塞"
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 2.3 标记报警为已处理

- URL：`PUT /api/v1/alarms/{id}/handle`
- 说明：将报警标记为已处理。
- 路径参数：
  - `id` (字符串，必填)
- 请求体：
```json
{
  "operatorName": "李四",
  "handledAt": "2026-04-06T10:35:00+08:00",
  "message": "已确认并处理"
}
```

- 返回示例：
```json
{
  "code": 200,
  "message": "handled",
  "data": {
    "id": "alarm-001",
    "deviceId": "dev-005",
    "severity": "ERROR",
    "alarmType": "堵塞",
    "occurredAt": "2026-04-06T09:15:00+08:00",
    "durationMinutes": 5,
    "isHandled": true,
    "handledAt": "2026-04-06T10:35:00+08:00",
    "message": "已确认并处理"
  },
  "timestamp": "2026-04-06T10:35:00Z"
}
```

### 2.4 获取未处理报警数量

- URL：`GET /api/v1/alarms/unhandled/count`
- 说明：获取当前系统中未处理报警总数。

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "count": 3
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

---

## 3. 命令日志

### 3.1 获取命令日志列表

- URL：`GET /api/v1/commands`
- 说明：获取设备命令执行历史。
- 请求参数（Query）：
  - `page` (整数，可选，默认 `1`)
  - `size` (整数，可选，默认 `20`)
  - `deviceId` (字符串，可选)
  - `commandType` (字符串，可选，枚举：`START`、`STOP`)
  - `commandStatus` (字符串，可选，枚举：`SUCCESS`、`FAILED`、`PENDING`)
  - `startTime` (字符串，可选，ISO 8601)
  - `endTime` (字符串，可选，ISO 8601)
  - `sort` (字符串，可选，如 `executedAt:desc`)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": "cmd-001",
        "deviceId": "dev-001",
        "commandType": "START",
        "commandStatus": "SUCCESS",
        "executedAt": "2026-04-06T10:30:00+08:00",
        "operatorName": "张三",
        "message": "远程启动"
      }
    ],
    "pageable": {
      "page": 1,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1
    }
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 3.2 获取单个命令详情

- URL：`GET /api/v1/commands/{id}`
- 说明：获取单个命令执行详情。
- 路径参数：
  - `id` (字符串，必填)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "cmd-001",
    "deviceId": "dev-001",
    "commandType": "START",
    "commandStatus": "SUCCESS",
    "executedAt": "2026-04-06T10:30:00+08:00",
    "operatorName": "张三",
    "message": "远程启动"
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

---

## 4. 系统监控

### 4.1 获取系统连接状态

- URL：`GET /api/v1/system/status`
- 说明：获取系统当前连接与服务健康状态。
- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "system-001",
    "connectionState": "CONNECTED",
    "apiState": "HEALTHY",
    "mqttState": "HEALTHY",
    "websocketState": "HEALTHY",
    "lastSyncAt": "2026-04-06T10:30:00+08:00",
    "uptimeMinutes": 12345,
    "activeDeviceCount": 42,
    "offlineDeviceCount": 4,
    "latencyMs": 38
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 4.2 获取系统指标

- URL：`GET /api/v1/system/metrics`
- 说明：获取系统指标列表。
- 请求参数（Query）：
  - `page` (整数，可选，默认 `1`)
  - `size` (整数，可选，默认 `20`)
  - `metricName` (字符串，可选)
  - `status` (字符串，可选，枚举：`NORMAL`、`WARN`、`CRITICAL`)
  - `startTime` (字符串，可选，ISO 8601)
  - `endTime` (字符串，可选，ISO 8601)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": "metric-001",
        "connectionId": "system-001",
        "metricName": "cpu_usage",
        "metricValue": 65,
        "unit": "%",
        "status": "NORMAL",
        "recordedAt": "2026-04-06T10:28:00+08:00"
      }
    ],
    "pageable": {
      "page": 1,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1
    }
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 4.3 系统健康检查

- URL：`GET /api/v1/system/health`
- 说明：系统轻量健康检查接口。
- 返回示例：
```json
{
  "code": 200,
  "message": "healthy",
  "data": {
    "status": "UP"
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

---

## 5. 病房管理

**UNUSED**

### 5.1 获取病房列表

**UNUSED**

- URL：`GET /api/v1/wards`
- 说明：获取病房列表，用于设备所属病房选择。
- 请求参数（Query）：
  - `page` (整数，可选，默认 `1`)
  - `size` (整数，可选，默认 `20`)
  - `wardType` (字符串，可选，枚举：`ICU`、`General`、`Surgery`、`Emergency`)
  - `status` (字符串，可选，枚举：`ACTIVE`、`MAINTENANCE`)
  - `keyword` (字符串，可选，病房名称或代码搜索)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": "ward-icu-01",
        "wardCode": "ICU-01",
        "wardName": "重症监护室1",
        "buildingName": "A栋",
        "floorLabel": "3F",
        "wardType": "ICU",
        "managerName": "王护士",
        "contactPhone": "13800000000",
        "status": "ACTIVE"
      }
    ],
    "pageable": {
      "page": 1,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1
    }
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

### 5.2 获取单个病房详情

**UNUSED**

- URL：`GET /api/v1/wards/{id}`
- 说明：按病房ID获取详情。
- 路径参数：
  - `id` (字符串，必填)

- 返回示例：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "ward-icu-01",
    "wardCode": "ICU-01",
    "wardName": "重症监护室1",
    "buildingName": "A栋",
    "floorLabel": "3F",
    "wardType": "ICU",
    "managerName": "王护士",
    "contactPhone": "13800000000",
    "status": "ACTIVE"
  },
  "timestamp": "2026-04-06T10:30:00Z"
}
```

---

## 6. WebSocket 实时推送

### 6.1 WebSocket 连接

- 地址：`ws://{host}/api/v1/ws`
- 说明：用于实时推送设备状态、遥测和报警变化。

### 6.2 消息结构

```json
{
  "type": "TELEMETRY_UPDATE",
  "deviceId": "dev-001",
  "data": {
    "dripRate": 18.5,
    "status": "WORKING",
    "alarmStatus": "NORMAL",
    "signalStrength": 94,
    "temperature": 36.8,
    "timestamp": "2026-04-06T10:30:00+08:00"
  }
}
```

### 6.3 建议消息类型

- `TELEMETRY_UPDATE`：设备遥测数据更新
- `DEVICE_STATUS_UPDATE`：设备状态/在线状态变化
- `ALARM_NEW`：新报警触发
- `SYSTEM_STATUS_UPDATE`：系统连接或服务状态变化

---

## 7. 统一约定

- 所有时间字段使用 ISO 8601 格式。
- 所有分页接口返回 `content` + `pageable`。
- 所有枚举字段应严格校验。
- 所有写入操作使用 JSON 请求体。
- 可加入 `Authorization: Bearer <token>` 认证头。
