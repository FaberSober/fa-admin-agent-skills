# WebSocket / Socket.IO

## 原生 WebSocket

项目 WebSocket 已由 `fa-admin-pages/layout/websocket` 管理连接、心跳和消息分发。业务代码用现有 `sendMessage`，不新建第二条连接：

```tsx
sendMessage({ type: 'TaskProgress', data: { taskId } });

useBus(['@@ws/RECEIVE/TaskProgress'], ({ payload }) => {
  if (payload.taskId === taskId) onTaskChange(payload);
}, [taskId]);
```

- 消息 `type` 必须与后端协议一致。
- 按 task/user/business ID 过滤消息。
- 组件卸载时停止业务订阅。

## Socket.IO

只有目标模块已使用 `useSocketIO` 或服务端明确要求时才用。不要与原生 WebSocket API 混用。
