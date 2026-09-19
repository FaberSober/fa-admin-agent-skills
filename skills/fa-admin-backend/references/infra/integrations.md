# Java 工具与外部集成


## Spring 请求与环境

只有无法通过 Controller 参数或依赖注入获取时，才从当前线程读取 request/response：

```java
ServletRequestAttributes attrs =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
HttpServletRequest request = attrs != null ? attrs.getRequest() : null;
HttpServletResponse response = attrs != null ? attrs.getResponse() : null;
```

调用方处理无 Web 请求上下文的情况；异步线程通常没有这些属性。当前 active profile 可使用 `SpringUtil.getActiveProfile()`，但业务逻辑不应大量依赖 profile 分支，环境差异优先放入配置。

Forest 外部 API 见 [api-forest.md](api-forest.md)；Jackson 序列化见 [jackson.md](jackson.md)。

## 集合与 Stream

- 排序优先 `Comparator.comparing(...)`，字段可能为 null 时显式使用 `nullsFirst/nullsLast`。
- 查找单个对象可使用 Hutool `CollUtil.findOne(...)`；批量匹配应先构造 Map，避免在 stream 中反复线性扫描。
- 分组使用 `Collectors.groupingBy(...)`；若输出顺序有要求，显式提供 `LinkedHashMap` supplier。
- `findFirst().orElse(...)` 仅在默认值符合业务语义时使用；必需数据缺失应抛出明确业务异常。
- 不在 stream 中隐藏数据库写入、远程调用等副作用。

## 泛型与反射

通过 `getGenericSuperclass()` 获取泛型参数只适用于实际父类仍保留 `ParameterizedType` 的场景。Spring 代理、多层继承、接口泛型和擦除都会让直接强转失败。优先复用 Spring `ResolvableType` 或仓库已有工具，并对无法解析给出明确异常。

不要用 `new ArrayList<T>().getClass().getGenericSuperclass()` 推导元素 `T`；运行时只会得到容器实现类的泛型父类信息。需要携带类型时使用显式 `Class<T>`、Jackson `TypeReference<T>` 或等价 type token。

JWT 调试只解码非敏感测试 token，线上 token 不写日志、不提交仓库。服务端必须校验签名和有效期。

## 外部资料使用原则

历史 `fa-core/doc/server` 中的博客和第三方链接仅作线索。实现前以仓库源码、锁定依赖版本和官方文档为准，不直接复制与当前 Jakarta/Spring Boot/MyBatis-Plus 版本不匹配的示例。
