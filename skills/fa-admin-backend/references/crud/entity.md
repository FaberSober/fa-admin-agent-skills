# Entity 实体

## 基类选择

- 普通逻辑删除业务表继承 `BaseDelEntity`（含 `crt_*`/`upd_*` 审计列 + `deleted`）。
- 不需要完整审计列的表按相邻先例选择 `BaseUpdEntity`/`BaseCrtEntity`。
- 审计列由 MyBatis-Plus `FieldFill` 自动填充，见 [data/ddl.md](../data/ddl.md)。

## 注解

- `@TableName("table_name")`；JSON type handler 场景加 `autoResultMap = true`。
- `@TableId` 指定主键，主键类型同时匹配 DDL、Mapper/Biz、Controller 泛型。
- 只有参与通用查询解析的字段才加 `@SqlEquals`。
- 字典字段用 `@FaColDict("dict_code")`，见 [data/dict.md](../data/dict.md)。
- Excel 字段按相邻实体加 EasyExcel 注解，见 [excel/excel.md](../excel/excel.md)。
- 只有"设为 null 也要写回"才用 `@TableField(updateStrategy = FieldStrategy.ALWAYS)`。

## 树形实体

按基类要求配：

- `@SqlTreeId`
- `@SqlTreeName`
- `@SqlTreeParentId`
- `@SqlSorter`

根节点 ID 按相邻树形实体约定。

## 字段命名

优先复用框架已有字段名：`id`、`sort`、`status`、`description`、`remark`、`parentId`、`userId`、`xxxUser`。不引入 `valid`、`info` 等与现有风格不一致的字段。
