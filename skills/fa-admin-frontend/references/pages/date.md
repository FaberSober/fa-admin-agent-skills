# 日期

日期组件值是 Dayjs 对象，不是字符串。初始化和提交必须转换：

- 初始化用 `FaUtils.getInitialKeyTimeValue` 等工具。
- 提交前用 `FaUtils.getDateStr000` 或 `FaUtils.parseRangeDateSuffix` 转成字符串。
- 不能把 Dayjs 对象直接传给后端。

日期范围查询见 [table.md](table.md) 的时间范围查询节。
