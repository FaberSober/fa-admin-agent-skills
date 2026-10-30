# 线程池

注入框架 `ThreadPoolConfig` 提供的 `Executor`，不临时创建无界线程池：

```java
@Resource
private Executor executor;

Map<String, Object> holdMap = BaseContextHandler.getHoldMap();
executor.execute(() -> {
    BaseContextHandler.setHoldMap(holdMap);
    // 异步任务
});
```

- 异步线程不会自动传播 `BaseContextHandler`、租户、用户、动态表名等 ThreadLocal，需显式捕获/恢复并在 `finally` 清理。
- 事务不跨线程传播。
- 异步任务必须考虑异常记录、拒绝策略和关闭行为。

定时任务中需要将子线程日志归入本次执行时，使用 `JobRunLogger.wrap(Runnable)`，并等待子任务完成后再结束父任务。该包装只传递日志上下文，用户、租户等上下文仍按上述规则恢复和清理，见 [定时任务执行日志](job.md#子线程日志)。
