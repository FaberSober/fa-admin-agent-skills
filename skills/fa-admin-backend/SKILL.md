---
name: fa-admin-backend
description: >
  FA Admin 框架（Java/Spring Boot + MyBatis-Plus）后端开发规范。在新增或修改业务模块、CRUD、Entity、Mapper、Biz、Controller、DDL、枚举、字典、校验、Excel、缓存、SSE/WebSocket、MQTT/Kafka、多数据源、测试部署时使用。适用于以 fa-core/fa-base 为基座的 FA Admin 业务项目。
---

# FA Admin 后端

## 常用场景：新增一张业务表 CRUD

1. 定库类型（mysql/postgre），写双份 DDL 和菜单 SQL。→ [references/data/ddl.md](references/data/ddl.md)
2. 写 Entity（继承 `BaseDelEntity`）。→ [references/crud/entity.md](references/crud/entity.md)
3. 写 Mapper（继承 `FaBaseMapper`）和 Biz（继承 `BaseBiz`/`BaseTreeBiz`）。→ [references/data/mapper-biz.md](references/data/mapper-biz.md)
4. 写 Controller（继承 `BaseController`/`BaseTreeController`，尽量空类体）。→ [references/crud/controller.md](references/crud/controller.md)
5. 编译目标模块，检查泛型 Key、路径、基类继承是否一致。

完整端到端步骤见 [references/crud/new-module.md](references/crud/new-module.md)。

## 参考文档

| 主题 | 文档 |
| --- | --- |
| 新建模块端到端步骤 | [crud/new-module.md](references/crud/new-module.md) |
| Controller、基类端点、响应、日志 | [crud/controller.md](references/crud/controller.md) |
| Entity、字段注解、树形注解 | [crud/entity.md](references/crud/entity.md) |
| DDL、版本升级 SQL | [data/ddl.md](references/data/ddl.md) |
| 菜单段位表 | [data/menu.md](references/data/menu.md) |
| 数据库初始化机制 | [data/dbinit.md](references/data/dbinit.md) |
| 枚举写法 | [data/enum.md](references/data/enum.md) |
| 字典 | [data/dict.md](references/data/dict.md) |
| 字段校验 | [data/validator.md](references/data/validator.md) |
| Mapper/Biz、自定义分页 | [data/mapper-biz.md](references/data/mapper-biz.md) |
| MyBatis-Plus（批量/JSON/拦截器） | [data/mybatisplus.md](references/data/mybatisplus.md) |
| 动态表名、动态数据源、TDengine | [data/dynamic-data.md](references/data/dynamic-data.md) |
| Excel 导入导出 | [excel/excel.md](references/excel/excel.md) |
| 缓存、Redis 锁 | [infra/cache-redis.md](references/infra/cache-redis.md) |
| 线程池、异步上下文 | [infra/thread.md](references/infra/thread.md) |
| Forest 外部 API | [infra/api-forest.md](references/infra/api-forest.md) |
| Jackson 序列化 | [infra/jackson.md](references/infra/jackson.md) |
| SSE 流式、AI 接口 | [infra/sse.md](references/infra/sse.md) |
| WebSocket、Socket.IO | [infra/websocket.md](references/infra/websocket.md) |
| MQTT 设备接入 | [infra/mqtt.md](references/infra/mqtt.md) |
| Kafka 消息队列 | [infra/kafka.md](references/infra/kafka.md) |
| 站内信、短信 | [infra/messaging.md](references/infra/messaging.md) |
| Spring/集合/反射/JWT 工具 | [infra/integrations.md](references/infra/integrations.md) |
| 测试 | [ops/test.md](references/ops/test.md) |
| 代码生成器 | [ops/generator.md](references/ops/generator.md) |
| Maven、Git、Docker、部署 | [ops/deploy.md](references/ops/deploy.md) |
| Nginx 配置 | [ops/nginx.md](references/ops/nginx.md) |

## 硬规则

- 双库脚本必须同时提供 `mysql` 和 `postgre`，不回退另一种方言。
- 不重写基类已有端点；自定义逻辑放 Biz。
- 不把密钥/密码/token 写进代码或仓库。
- `upd_time` 由 MyBatis-Plus 自动填充，DDL 不写 `ON UPDATE`、不建触发器。
