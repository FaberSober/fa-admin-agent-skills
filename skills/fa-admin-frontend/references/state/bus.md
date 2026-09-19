# 事件总线

跨层级、松耦合的全局事件用 `use-bus`；直接父子或明确共享状态优先 props/context。

```tsx
// 接收
useBus(['@@biz/ITEM_CHANGED'], ({ payload }) => refresh(payload), [refresh]);

// 发送
dispatch({ type: '@@biz/ITEM_CHANGED', payload: { id } });
```

- 优先复用现有事件常量，如树刷新用 `Fa.Constant.TREE_REFRESH_BUS_KEY`。
- 事件名包含业务命名空间，payload 有稳定类型。
- 依赖数组包含回调读取的最新值，避免闭包陈旧。
- 不用 bus 构造难以追踪的请求/响应流程。
