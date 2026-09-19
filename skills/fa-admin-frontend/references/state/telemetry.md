# 遥测与异常上报

`fa-telemetry` 用于客户端事件统计和异常聚合。SDK 在 `@features/fa-admin-pages/telemetry`，由宿主入口初始化一次，业务页面不重复 init。

## 初始化

在应用入口执行一次：

```ts
telemetry.init({
  appKey: 'your-app-key',
  clientType: 'WEB',
  environment: 'development',
  release: '1.0.0',
});
```

- `appKey` 必须对应后端"系统设置 → Telemetry → 应用管理"已启用的应用。
- 环境变量：`VITE_APP_TELEMETRY_APP_KEY`、`VITE_APP_TELEMETRY_ENV`。
- 未配 appKey 不初始化；每次 `init()` 会重置 sessionId 和用户身份，不要当刷新用。

## 用户身份

登录后设置，退出时清理：

```ts
telemetry.identify({ userId: 'user-123', tenantId: 'tenant-456' });
telemetry.clearUser();
```

## 事件上报

```ts
telemetry.track('order.submit', {
  eventType: 'BUSINESS',
  module: 'order',
  bizType: 'ORDER',
  bizId: 'order-123',
  result: 'SUCCESS',
  duration: 250,
  properties: { itemCount: 2 },
});
```

- `eventCode` 用稳定编码，不拼订单号等动态值。
- 页面浏览用 `telemetry.page()`，Router 里挂一次 observer，不要每页重复。
- 不要向 properties 传循环引用、BigInt、DOM 节点或敏感数据。

## 异常上报

```ts
try { ... } catch (e) {
  telemetry.captureException(e, { module: 'order' });
}
```

- SDK 自动捕获 `window.onerror` 和 `unhandledrejection`；业务 catch 过的异常要手动上报。
- React 组件树异常用 `TelemetryErrorBoundary` 包裹业务区域。
- 优先传 Error 对象保留堆栈。

## 注意

- `track`/`page`/`captureException` 返回 void，不能 await 判断成功。
- 无队列、无重试、无采样；fetch + keepalive 发送，忽略网络错误。
- 管理后台：应用 `/admin/system/telemetry/app`、异常 Issue `/admin/system/telemetry/issue`。
