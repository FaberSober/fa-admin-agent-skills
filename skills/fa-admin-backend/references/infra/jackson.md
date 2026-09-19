# Jackson 序列化

## 日期格式不生效

`spring.jackson.date-format` 不生效通常是因为 `WebMvcConfigurationSupport` 覆盖了自动配置。在该类中重写 `extendMessageConverters` 注册自定义 `MappingJackson2HttpMessageConverter`：

- Long 转字符串：`SimpleModule.addSerializer(Long.class, ToStringSerializer.instance)`。
- 日期格式和时区从配置读取。
- `FAIL_ON_UNKNOWN_PROPERTIES` 设为 false。

## 字段命名

连续大写字段（如 `nTenOrder`）序列化不符合契约时，用 `@JsonProperty("expectedName")`。

## 规则

- 优先复用仓库当前 ObjectMapper 配置，不照搬历史 `WebMvcConfigurationSupport` 示例。
- 全局策略只在确认影响后修改；局部需求用字段级注解或 DTO。
