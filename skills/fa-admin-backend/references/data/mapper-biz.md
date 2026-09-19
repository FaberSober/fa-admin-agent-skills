# Mapper 与 Biz

## 基类

- `Mapper`：`extends FaBaseMapper<Entity>`。
- `Biz`：`@Service`，`extends BaseBiz<Mapper, Entity>`；树形用 `BaseTreeBiz<Mapper, Entity>`。
- 事务用 `@Transactional(rollbackFor = Exception.class)`，业务异常抛 `BuzzException`。

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

MySQL JDBC 批量配置、JSON 字段、拦截器忽略见 [mybatisplus.md](mybatisplus.md)。

## 动态表名、动态数据源、TDengine

见 [dynamic-data.md](dynamic-data.md)。
