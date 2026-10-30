# 数据库初始化机制

版本 SQL 由框架自动执行，入口是 `SystemUpdateLogBiz.initDb()`，按版本升序跑模块 `sql/{类型}/{版本}*.sql`。

模块登记参考 `FaDemoDbInit`。

## 主键选型

- `bigint` 自增 → Java `Long` → 前端 `string`；将来换 UUID 只需改后端，前端不动。
- `int` 自增 → Java `Integer`，多用于配置/字典/菜单/角色/日志表。
- `varchar(32)` → Java `String`，多用于用户/部门/文件表。

整型宽度：`bigint` 8 字节、`int` 4 字节、`smallint` 2 字节、`tinyint` 1 字节。

## 版本脚本文件

- 文件名以版本开头：`{版本}_{说明}.sql`，如 `1.0.1_maintenance_upload_info.sql`。
- 文件名版本与 `@@ver` 必须一致，`@@info` 是非空升级说明，按版本升序执行。
- 完整双分隔线文件头及解析验证要求见 [DDL 文件头规则](ddl.md#sql-文件头与验证)。
- 已发布脚本不可修改。
