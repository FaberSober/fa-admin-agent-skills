# Kafka

用于服务间高吞吐、可消费确认或事务消息。

## 接入要点

使用 `spring-kafka` 时先确认父 POM 和 Spring Boot 管理版本。

### 生产者

- `bootstrap-servers`、key/value serializer。
- `acks`、`retries`、batch/buffer。
- 是否真的需要事务；启用时设置唯一事务前缀，并只在正确事务边界发送。

### 消费者

- group ID、key/value deserializer 和可信包范围。
- 单条/批量模式、并发数、offset 提交方式。
- 重试、死信、幂等、顺序性和自定义错误处理。

## 安全

发送回调记录 topic/partition/offset 和必要业务标识，不记录完整敏感消息。配置中的 broker 地址、账号和证书均由环境注入。
