# 字典

字典先在后台"系统管理/字典管理"维护，再在 Entity 字段上用编码引用：

```java
@FaColDict("base_dict_test_options")
@ExcelProperty("字典值")
private String dictValue;
```

- `BaseBiz.selectPageByQuery` 会解析 `@FaColDict`，把字典选项加入 `TableRet`，业务接口不用重复查字典。
- 字典编码必须与后台配置或初始化数据一致。
- 前端用 `DictDataSelector`/`DictEnumApiSelector` 等组件消费。
