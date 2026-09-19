# Select 选择器

## BaseSelect（小数据量）

数据量小可一次加载，封装 `BaseSelect`：

```tsx
export default function RoleSelect(props: Omit<BaseSelectProps<Rbac.Role>, 'serviceApi'>) {
  return <BaseSelect serviceApi={roleApi} placeholder="请选择角色" {...props} />;
}
```

外部条件变化时用 `extraParams` 触发重新获取：

```tsx
<BaseSelect
  serviceApi={{ ...api, list: () => api.list({ query: { departmentId } }) }}
  extraParams={[departmentId]}
  {...props}
/>
```

## BaseSearchSelect（大数据量搜索）

```tsx
<BaseSearchSelect<Admin.User, string>
  valueKey="id"
  labelKey="name"
  serviceApi={{
    search: (name) => api.page({ current: 1, pageSize: 20, query: { name } }),
    getById: (value) => api.getById(value),
    findList: (ids) => api.list({ 'id#$in': [...ids] }),
  }}
  placeholder="请输入搜索"
  {...props}
/>
```

Key 泛型、单选/多选 value、`findList` 参数必须一致。
