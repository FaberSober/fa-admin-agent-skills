---
name: fa-admin-backend
description: >
  FA Admin 框架后端开发规范。在基于 FA Admin 新增或修改 Java/Spring Boot 后端模块、CRUD API、实体类、Mapper、Biz 业务类、Controller、MyBatis-Plus 代码、数据校验、枚举、字典字段、分页接口、Excel 导入/导出逻辑，或 MySQL/PostgreSQL DDL 及数据库版本脚本时使用。适用于所有以 fa-core/fa-base 为基座的 FA Admin 业务项目。
---

# FA Admin 后端

以 `fa-core`/`fa-base` 为基座的后端，统一遵循"基类继承 + 薄 Controller"：优先复用框架已有抽象，不自行发明 API 形态、响应结构或表命名。

## 执行顺序

1. **判任务类型**：普通 CRUD / 树形 CRUD / 自定义查询 / 纯 DDL / 集成与部署。
2. **查路由表**：只读对应 reference，不一次性加载全部。
3. **找相邻基线**：通用示例看 `fa-demo`，基类看 `fa-core`，风格看目标模块相邻代码；写 DDL 前先打开 `fa-base/src/main/resources/sql/fa-base/{mysql|postgre}/1.0.0_base_ddl.sql` 对表。
4. **动手**：新建模块按下方 Playbook；单模块改动直接按对应 reference。
5. **验证**：按文末清单最小检查，不跑全量构建。

## 技术基线

| 项 | 基线 |
| --- | --- |
| JDK | 17 |
| Servlet/校验包 | Jakarta EE（非 `javax.*`） |
| MySQL | 兼容 5.7 语法 |
| PostgreSQL | 18 |
| Spring Boot / MyBatis-Plus / EasyExcel | 版本以父 POM/BOM 锁定为准，不擅自升级 |
| Long 主键 | 序列化为字符串返回前端，前端 TS 用 `string` 承接 |

`fa-core/doc` 下的历史博客可能基于更旧版本，与基线或当前源码冲突时，一律以仓库源码和父 POM 为准。

## 硬性红线

违反任意一条即视为错误，必须改正：

- **升级 SQL** 禁止 `DROP TABLE`/`DROP SCHEMA`/`TRUNCATE`（执行器会拒绝）；已发布版本脚本不可改写。
- **破坏性运维**：物理 `DELETE`、清库、`TRUNCATE`、删 submodule、打包/镜像发布/远程部署/systemctl stop，必须用户明确要求并确认环境后才做。
- **双库一致**：变更表结构必须同时提供 `mysql` 与 `postgre` 等价脚本，禁止只写一种或回退到另一种方言。
- **不重写基类**：子 Controller 不重复实现 `BaseController`/`BaseTreeController` 已有端点；自定义逻辑放 Biz 层。
- **不发明契约**：响应只用 `Ret<T>`/`TableRet<T>`，路径用 `/api/大模块/业务/实体`，表/字段/审计列沿用框架命名。
- **凭证隔离**：密钥、密码、私钥、token 用环境变量/密钥管理，不写进代码、SQL、Skill 或日志。
- **类型对齐**：Java `Boolean` 在 MySQL 是 `tinyint(1)`、在 PG 是 `boolean`；关联外键列必须匹配被引用表真实主键类型。

## Reference 路由

| 任务 | 必读 reference |
| --- | --- |
| 新建模块/标准或树形 CRUD（Entity+Mapper+Biz+Controller） | [crud-api.md](references/crud-api.md)、[entity-enum-dict.md](references/entity-enum-dict.md)、[ddl.md](references/ddl.md) |
| 纯 DDL、版本升级 SQL、菜单初始化 | [ddl.md](references/ddl.md) |
| 自定义分页、联表查询、批量 upsert、JSON 字段、动态表/数据源、TDengine | [custom-logic.md](references/custom-logic.md) |
| 枚举、字典、字段校验、Jackson 序列化 | [entity-enum-dict.md](references/entity-enum-dict.md) |
| JetCache、Redis 分布式锁、线程池 | [cache-concurrency.md](references/cache-concurrency.md) |
| Excel 导入/导出 | [excel.md](references/excel.md)（批量 upsert 同时看 [custom-logic.md](references/custom-logic.md)） |
| Forest 外部 API、集合/Stream/反射、JWT | [java-integrations.md](references/java-integrations.md) |
| SSE、WebSocket、MQTT、Kafka、站内信 | [messaging-realtime.md](references/messaging-realtime.md) |
| 测试、代码生成器、Maven、打包、nginx、systemd/Windows 自启、运维 SQL | [testing-deployment.md](references/testing-deployment.md) |

## 新建模块 Playbook

从零加一张业务表时严格按序，每步先查对应 reference：

1. **定库类型、找基线**：`mysql` 还是 `postgre`，对 `1.0.0_base_ddl.sql` 相邻表定主键、审计列、索引。→ [ddl.md](references/ddl.md)
2. **写双份 DDL + 菜单**：`src/main/resources/sql/{模块编码}/{mysql|postgre}/{版本}*.sql` 各一份；菜单先按段位表选未占用 ID。→ [ddl.md](references/ddl.md)
3. **写 Entity**：普通逻辑删除表继承 `BaseDelEntity`，`@TableName`/`@TableId`，Java 类型与 DDL 逐字段对齐；树形表补树注解。→ [entity-enum-dict.md](references/entity-enum-dict.md)
4. **写 Mapper**：单表继承 `FaBaseMapper<Entity>`，不加方法；联表/聚合写 XML。→ [custom-logic.md](references/custom-logic.md)
5. **写 Biz**：普通表 `BaseBiz<Mapper,Entity>`，树形 `BaseTreeBiz<Mapper,Entity>`；事务/批量/联表/缓存放这层。
6. **写 Controller**：继承 `BaseController<Biz,Entity,Key>` 或 `BaseTreeController<...>`，类上 `@FaLogBiz`，尽量空类体。→ [crud-api.md](references/crud-api.md)
7. **验证**：按下方清单逐项核对。

> 单表标准 CRUD 可用 `fa-generator` 生成后逐文件人工合入；树形/复杂联表直接手写。

## 验证清单

- **DDL**：目标方言正确（MySQL 反引号/PG 双引号）、双份齐全、布尔/JSON/自增类型对、无 `DROP`/`TRUNCATE`、菜单 ID 已查重、审计列与 `deleted` 齐全。
- **Entity**：继承正确基类、`@TableName`/`@TableId` 齐全、泛型 `Key` 与主键 DDL 类型一致、枚举未退化成 `Integer`、JSON 字段带 `autoResultMap`。
- **Mapper/Biz/Controller**：基类正确、无重复基类端点、`@FaLogBiz`、请求路径 `/api/...` 规范、`Ret`/`TableRet` 返回类型正确。
- **编译**：目标模块编译通过，无未用 import；有相关测试则运行，否则不跑全量。
- **安全**：无硬编码凭证、日志不含 token/完整个人数据、`@InterceptorIgnore` 仅限确需绕过的单方法。
