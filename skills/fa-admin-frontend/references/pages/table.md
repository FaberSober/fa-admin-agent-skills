# 表格 BaseBizTable

## 基本用法

标准 CRUD 列表页用 `useTableQueryParams` + `BaseBizTable`，列用 `BaseTableUtils` 生成器：

```tsx
const { queryParams, setFormValues, handleTableChange, fetchPageList, loading, list, dicts, paginationProps } =
  useTableQueryParams<Demo.Student>(api.page, {}, serviceName);

const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName);
const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams);

function genColumns() {
  const { sorter } = queryParams;
  return [
    BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
    BaseTableUtils.genSimpleSorterColumn('名称', 'name', 120, sorter),
    BaseTableUtils.genEnumSorterColumn('状态', 'status', 100, sorter, dicts),
    BaseTableUtils.genDateSorterColumn('日期', 'bizDate', 110, sorter),
    BaseTableUtils.genDictSorterColumn('字典', 'dict1', 100, sorter, dicts, 'dict_code'),
    ...BaseTableUtils.genCtrColumns(sorter),
    ...BaseTableUtils.genUpdateColumns(sorter),
    {
      title: '操作',
      dataIndex: 'opr',
      render: (_, r) => (
        <Space>
          <StudentModal editBtn record={r} fetchFinish={fetchPageList} />
          <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
        </Space>
      ),
      width: 120,
      fixed: 'right',
      tcRequired: true,
      tcType: 'menu',
    },
  ] as FaberTable.ColumnsProp<Demo.Student>[];
}
```

## 规则

- 操作列必须 `fixed: 'right'`、`tcRequired: true`、`tcType: 'menu'`。
- 操作按钮用 `size="small"`。
- 删除用 `useDelete`，导出用 `useExport`，不手写。
- 组合查询用 `tcCondComponent` 或 `tcCondComponentElement`。

## 时间范围查询

```tsx
onFinish={(av) => setFormValues({
  ...av,
  'time#$min': FaUtils.parseRangeDateSuffix(av.dateRange, 0, '00:00:00'),
  'time#$max': FaUtils.parseRangeDateSuffix(av.dateRange, 1, '23:59:59'),
})}
```

日期选择器用 `WindDateRangerPicker`。
