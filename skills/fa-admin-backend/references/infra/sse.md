# SSE 与流式响应

用于单请求、服务端持续输出的场景，例如 AI 大模型流式对话、长任务进度推送。

## 必须绕过响应包装过滤器

返回 `SseEmitter` 或 `produces = MediaType.TEXT_EVENT_STREAM_VALUE` 的接口，必须同时在类和方法上标注 `@NoFilter`。`RequestAgainFilter` 默认包装并缓存响应，等待请求完成后统一写回，会破坏实时输出。

当前 `FilterInitRunner` 先扫描带 `@NoFilter` 的类，再注册类中同样带 `@NoFilter` 的方法，因此类和流式方法必须同时标注：

```java
@NoFilter
@FaLogBiz("大模型")
@RestController
@RequestMapping("/api/ai/llm/chat")
public class AiChatController {

    @NoFilter
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@RequestBody ChatReqVo req) {
        return chatBiz.stream(req);
    }
}
```

- 导入 `com.faber.core.config.annotation.NoFilter`。
- 类必须有 `@RequestMapping`；`FilterInitRunner` 用类路径和方法路径拼接 skip URL。
- 方法显式声明 `TEXT_EVENT_STREAM_VALUE`。
- 处理超时、完成、错误和客户端断开，及时清理后台任务/订阅。
- 不把 token、完整提示词、隐私数据或超大响应写入日志。
- 变更映射注解形式后检查 `FilterInitRunner` 当前支持情况；它当前只解析 `@RequestMapping`、`@GetMapping`、`@PostMapping`。

## 技术选择

单请求持续输出用 SSE；浏览器双向长连接用 [websocket.md](websocket.md)；既有客户端用 Socket.IO 也见该文件；设备主题用 [mqtt.md](mqtt.md)；高吞吐事务消息用 [kafka.md](kafka.md)；站内通知用 [messaging.md](messaging.md)。不要仅因"实时"同时引入多套机制。
