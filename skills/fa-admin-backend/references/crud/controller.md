# Controller 与 API

## 开始前

1. 搜索相邻 Controller，复制其包路径、注解和路径风格。
2. 判断资源是普通 CRUD 还是树形 CRUD。
3. 打开基类确认当前端点，不凭记忆重写。

## 分层

- `mapper`：继承 `FaBaseMapper<Entity>`。
- `biz`：普通表 `BaseBiz<Mapper, Entity>`；树形 `BaseTreeBiz<Mapper, Entity>`。
- `rest`：普通表 `BaseController<Biz, Entity, Key>`；树形 `BaseTreeController<Biz, Entity, Key>`。

Controller 保持轻薄，自定义逻辑放 Biz，SQL 放 Mapper/XML。基类已有端点不重写。

最小形态：

```java
@FaLogBiz("业务名称")
@RestController
@RequestMapping("/api/module/biz/resource")
public class XxxController extends BaseController<XxxBiz, Xxx, Integer> {
}
```

树形资源换 `BaseTreeController<XxxBiz, Xxx, Key>`，Entity 配树注解（见 [entity.md](entity.md)）。`@RestController`/`@Controller` 跟随同模块先例。

## BaseController 端点

子类直接继承：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| save | POST `/save` | 新增（`Vg.Crud.C` 校验） |
| saveBatch | POST `/saveBatch` | 批量新增 |
| getById | GET `/getById/{id}` | ID 查询 |
| getDetail | GET `/getDetail/{id}` | ID 详情 |
| getByIds | POST `/getByIds` | 批量 ID 查询 |
| update | POST `/update` | 更新（`Vg.Crud.U` 校验） |
| updateBatch | POST `/updateBatch` | 批量更新 |
| saveOrUpdate | POST `/saveOrUpdate` | 新增或更新 |
| saveOrUpdateBatch | POST `/saveOrUpdateBatch` | 批量新增或更新 |
| remove | DELETE `/remove/{id}` | 逻辑删除 |
| removeBatchByIds | POST `/removeBatchByIds` | 批量逻辑删除 |
| removePer | DELETE `/removePer/{id}` | 物理永久删除 |
| removePerBatchByIds | POST `/removePerBatchByIds` | 批量物理删除 |
| removeByQuery | POST `/removeByQuery` | 按条件删除 |
| removeMine | DELETE `/removeMine` | 删当前用户数据 |
| all | GET `/all` | 全部列表 |
| list | POST `/list` | 条件列表 |
| listN | POST `/listN?topN=` | 前 N 条 |
| mineList | POST `/mineList` | 当前用户列表 |
| count | POST `/count` | 条件计数 |
| page | POST `/page` | 分页（`TableRet`） |
| minePage | POST `/minePage` | 当前用户分页 |
| exportExcel | POST `/exportExcel` | 导出 |
| exportTplExcel | POST `/exportTplExcel` | 下载导入模板 |
| importExcel | POST `/importExcel` | 导入 |

## BaseTreeController 额外端点

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| treePathLine | GET `/treePathLine/{id}` | 向上节点路径 |
| treeListLayer | GET `/treeListLayer/{parentId}` | 当前层级 |
| treeFindPath | GET `/treeFindPath/{id}` | 路径+层级树 |
| allTree | GET `/allTree?level=` | 全树（可限层级） |
| getTree | POST `/getTree` | 条件查树 |
| allTreeFromNode | GET `/allTreeFromNode/{id}` | 向下子树 |
| changePos | POST `/changePos` | 调整排序/父节点 |
| moveUp / moveDown | GET `/moveUp/{id}`、`/moveDown/{id}` | 上移/下移 |

## 响应与日志

- 路径 `/api/大模块/业务模块/实体`；自定义查询用 `QueryParams` 或 `BasePageQuery<ReqVo>`，返回 `Ret<T>`/`TableRet<T>`，用基类 `ok(...)`。
- 泛型 `Key`、Entity 主键 Java 类型、DDL 主键类型三者一致。
- 类上 `@FaLogBiz("业务名")`；基类未覆盖操作加 `@FaLogOpr(value="...", crud=LogCrudEnum.X)`；大响应查询加 `@LogNoRet`。
- 缓存见 [infra/cache-redis.md](../infra/cache-redis.md)；SSE 见 [infra/sse.md](../infra/sse.md)。
