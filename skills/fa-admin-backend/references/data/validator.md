# 校验

请求 VO 用 Jakarta Validation 注解。基类 CRUD 的创建/更新用项目分组：

- `Vg.Crud.C`：新增场景
- `Vg.Crud.U`：更新场景

```java
@Data
public class XxxReqVo {
    @NotEmpty
    private List<Integer> factoryIds;

    @NotNull
    private Date dateStart;
}
```

- 自定义接口是否加 `@Valid`/`@Validated` 跟随相邻 Controller。
- 必填、长度、范围、集合非空用注解表达，不用数据库异常代替输入校验。
- 包名是 `jakarta.validation.*`，不是 `javax.validation.*`。
