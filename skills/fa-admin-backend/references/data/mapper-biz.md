# Mapper 与 Biz

## 自定义分页

基类 `/page` 不满足联表、聚合或 VO 查询时，用 `BasePageQuery<ReqVo>` + PageHelper + Mapper：

Controller 转发：

```java
@FaLogOpr(value = "检索文件分页", crud = LogCrudEnum.R)
@LogNoRet
@PostMapping("/queryFilePage")
public TableRet<StoreFile> queryFilePage(@RequestBody BasePageQuery<StoreFileQueryVo> params) {
    return baseBiz.queryFilePage(params);
}
```

Biz 启动分页：

```java
public TableRet<StoreFile> queryFilePage(BasePageQuery<StoreFileQueryVo> query) {
    PageInfo<StoreFile> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
            .doSelectPageInfo(() -> baseMapper.queryFile(query.getQuery(), query.getSorter()));
    return new TableRet<>(info);
}
```

- `PageHelper.startPage(...)` 必须紧邻实际查询。
- 排序参数用项目 sorter 解析，不拼接未校验的前端字段。

## 批量写入与 Upsert

1. 校验并规范化输入，空集合直接结束。
2. 按业务 key 一次性查已有数据，构造 `Map<Key, Entity>`。
3. 拆成新增和更新集合；更新时保留主键和不应覆盖字段。
4. 分别 `saveBatch(...)` 和 `updateBatchById(...)`，按数据量分块。
5. 需要原子性时在 Biz 方法加项目事务注解。

批量插入慢时检查 MySQL JDBC URL 的 `rewriteBatchedStatements=true`，不要在每个 Mapper 重复写批量 SQL。Excel 导入见 [../excel/excel.md](../excel/excel.md)。

## MyBatis-Plus JSON 字段

`@TableName` 加 `autoResultMap = true`，字段用 `UniversalJsonTypeHandler`：

```java
@TableName(value = "demo_student", autoResultMap = true)
public class Student extends BaseDelEntity {
    @TableField(typeHandler = UniversalJsonTypeHandler.class)
    private Tag[] tags;
}
```

## 强制更新 null

默认 MyBatis-Plus 忽略 null。只有业务明确要求清空列时：

```java
@TableField(updateStrategy = FieldStrategy.ALWAYS)
private Date planProdDate;
```

先评估对所有更新入口的影响；只影响单次更新时优先用显式 UpdateWrapper。

## 拦截器忽略

确需绕过保护时才用 `@InterceptorIgnore`，并精确指定单项：

```java
public interface StudentMapper extends FaBaseMapper<Student> {
    @InterceptorIgnore(blockAttack = "true")
    int deleteAll();
}
```

绕过租户、全表更新/删除属于高风险，必须检查调用入口和数据范围。

## 动态表名、动态数据源、TDengine

见 [dynamic-data.md](dynamic-data.md)。
