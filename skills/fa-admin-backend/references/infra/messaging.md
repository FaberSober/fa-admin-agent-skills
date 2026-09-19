# 站内信与短信

## 消息模板

消息模板在应用配置的消息模板区域维护，真实 access key、secret、签名等通过环境配置注入，不写入源码或 skill。

定义业务消息 Bean 时：

- 继承当前 `MsgSendConfig`。
- 使用 `@PropKey` 关联模板 key，并按需开启短信。
- Bean 字段名必须和模板占位符 keys 一致。
- 设置稳定的 `buzzType`、`buzzId` 便于追踪业务对象。

## 发送

发送站内信优先使用 `MsgHelper`。需要以管理员身份发布时按现有调用使用 `BaseContextHandler.useAdmin()`，并确保调用结束后不会污染线程上下文。明确接收人、渠道、重复发送/重试和失败记录。
