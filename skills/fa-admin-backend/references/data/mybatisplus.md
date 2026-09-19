# MyBatis-Plus

## 批量写入提速

MySQL JDBC URL 加 `rewriteBatchedStatements=true`，`saveBatch` 从逐条发送变为批量：

```yaml
spring:
  datasource:
    url: jdbc:mysql://host/db?rewriteBatchedStatements=true
```

## JSON 字段

实体加 `autoResultMap = true`，字段用 `UniversalJsonTypeHandler`：

```java
@TableName(value = "demo_student", autoResultMap = true)
public class Student extends BaseDelEntity {
    @TableField(typeHandler = UniversalJsonTypeHandler.class)
    private Tag[] tags;
}
```

JSON array 用 `Clazz[]`，不用 `List<Clazz>`。

JSON 查询示例：

```java
// JSON array like
.apply("tags -> '$[*].name' LIKE CONCAT('%',{0},'%')", "新")
// JSON_CONTAINS
"WHERE JSON_CONTAINS(tags, JSON_OBJECT('name', ?))"
```

注意：`JSON_CONTAINS` 与多租户拦截器组合可能触发 JSqlParser 解析错误，以当前依赖版本测试为准。

## 动态表名

用 `BaseContextHandler.setTableSuffix` 设后缀，`try/finally` 清理。详见 [dynamic-data.md](dynamic-data.md)。

## 拦截器忽略

```java
public interface StudentMapper extends FaBaseMapper<Student> {
    @InterceptorIgnore(blockAttack = "true")
    int deleteAll();
}
```

绕过租户/全表删除保护属高风险，必须检查调用入口。
