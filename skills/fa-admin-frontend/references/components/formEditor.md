# FormEditor 低代码表单

历史概念：

- `JsonConfig`：数据库表、列和表单项。
- `DataConfig`：主表和字段排序。
- `TableConfig`：查询列、展示列和 table props。

新增 schema 字段时同时更新 TypeScript 类型、编辑器、预览/解析器和持久化兼容逻辑。保留旧配置默认行为，对导入 JSON 做版本和结构校验。
