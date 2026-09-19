# 新建模块端到端步骤

从零加一张业务表时按序执行，每步只看对应文档：

1. **定库类型、找基线**：确认 `mysql` 还是 `postgre`，打开 `fa-base/src/main/resources/sql/fa-base/{类型}/1.0.0_base_ddl.sql`，按相邻表定主键、审计列、索引。见 [data/ddl.md](../data/ddl.md)。
2. **写双份 DDL + 菜单**：在 `src/main/resources/sql/{模块编码}/{mysql|postgre}/{版本}*.sql` 各写一份；需要菜单时同文件写菜单 INSERT。见 [data/ddl.md](../data/ddl.md)。
3. **写 Entity**：继承 `BaseDelEntity`，配 `@TableName`/`@TableId`，Java 类型与 DDL 逐字段对齐。见 [crud/entity.md](entity.md)。
4. **写 Mapper**：继承 `FaBaseMapper<Entity>`，不加方法；联表 SQL 写 XML。见 [data/mapper-biz.md](../data/mapper-biz.md)。
5. **写 Biz**：普通表 `BaseBiz<Mapper,Entity>`，树形 `BaseTreeBiz<Mapper,Entity>`；事务/批量/联表放这层。见 [data/mapper-biz.md](../data/mapper-biz.md)。
6. **写 Controller**：继承 `BaseController<Biz,Entity,Key>` 或 `BaseTreeController<...>`，类上 `@FaLogBiz`，尽量空类体。见 [crud/controller.md](controller.md)。
7. **验证**：见 SKILL.md 验证清单。

> 单表标准 CRUD 可用 `fa-generator` 生成后逐文件合入；树形/复杂联表直接手写。
