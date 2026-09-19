# Form 表单

## InputNumber

Form 中 `InputNumber` 需要加 `type: 'number'` 和 `transform`，否则字符串/undefined 误判：

```tsx
<Form.Item name="year" label="年份" rules={[{ type: 'number', transform: (v) => Number(v), required: true }]}>
  <InputNumber min={1900} max={2100} />
</Form.Item>
```

## Switch / Checkbox

必须加 `valuePropName="checked"`：

```tsx
<Form.Item name="isPublic" label="是否公开" valuePropName="checked">
  <Switch />
</Form.Item>
```

## 布局

- 半列用 `FaUtils.formItemHalfLayout`，两列网格用 `fa-grid2`。
- 日期组件值是 Dayjs，提交前必须转换，不能直接传给后端。
- 校验用 Ant Design rules，错误文案写业务字段名。
