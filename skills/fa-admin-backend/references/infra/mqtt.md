# MQTT

用于设备/物联网主题发布订阅。

## 接入要点

使用 MQTT 时通常包含：配置属性、连接 Service、`MqttCallbackExtended` 回调、Spring 初始化配置。

- broker、用户名、密码使用环境变量/密钥管理；示例中只写 `${MQTT_HOST}` 等占位符。
- client ID 必须在部署实例间唯一，可使用应用/实例标识加随机后缀。
- 明确 QoS、clean session、retained、自动重连、连接超时、keepalive 和订阅主题。
- `connectComplete` 重连后恢复必要订阅；`messageArrived` 做幂等、异常隔离和耗时任务转交。
- 主题遵循项目命名空间，避免订阅过宽的通配符。

不要仅依据历史文档重新实现一套客户端；先搜索仓库当前 MQTT 配置和封装。
