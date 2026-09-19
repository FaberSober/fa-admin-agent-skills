# WebSocket 与 Socket.IO

## 项目 WebSocket

服务端发送前设置业务频道，再发布统一类型消息：

```java
WsHolder.setChannel("PullNewData");
WsHolder.sendMessage(WsTypeEnum.PLAIN_TEXT, "开始处理...");
```

项目 WebSocket 消息统一使用 JSON。请求和响应至少保持业务 `type` 与 `data`，响应还使用项目当前的 `code`、`msg`：

```json
{
  "code": 0,
  "type": "request",
  "msg": "success",
  "data": {}
}
```

- 频道名和 `type` 是前后端契约，先搜索前端订阅事件再修改。
- 大量发送优先异步 remote；需要严格同步完成的小消息才考虑 basic remote。
- 处理断线、心跳、并发发送、消息大小和鉴权。

## Socket.IO

只有现有客户端依赖 Socket.IO 协议时，实现项目的 `SocketIOService` 并在 `addListener(SocketIOServer server)` 注册事件：

```java
@Service
public class DemoSocketImpl implements SocketIOService {
    @Override
    public void addListener(SocketIOServer server) {
        server.addEventListener("chatEvent", ChatObject.class, (client, data, ack) -> {
            client.sendEvent("chatEvent", data);
        });
    }
}
```

依赖版本必须与客户端 Socket.IO 协议版本兼容，以父 POM 和已锁定依赖为准。校验事件输入并避免记录敏感载荷。

前端接收见 fa-admin-frontend skill 的 navigation/websocket 文档。
