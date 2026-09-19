# 弹窗组件选择

| 场景 | 组件 |
| --- | --- |
| 普通对话框 | Ant Design `Modal` |
| 可拖动、可切换全屏 | `DragModal` |
| 带触发器的通用新增/编辑 | `BaseModal` |
| 覆盖 `.fa-main`、承载复杂表单 | `FaFullContentModal` |

## DragModal

CRUD 弹窗首选。

```tsx
<DragModal title="编辑" open={open} width={800} onOk={() => form.submit()} onCancel={() => setOpen(false)}>
  表单内容
</DragModal>
```

## BaseModal

用 `triggerDom` 提供打开按钮，适合简单新增。

```tsx
<BaseModal triggerDom={<Button type="primary">新增</Button>} title="新增">
  <Form>表单内容</Form>
</BaseModal>
```

## FaFullContentModal

通过 Portal 挂到当前 Tab 面板，覆盖主体区域，自带滚动。适合复杂表单。

```tsx
<FaFullContentModal
  title="复杂表单"
  triggerDom={<Button>新增</Button>}
  open={open}
  onOpenChange={setOpen}
  onOk={() => form.submit()}
  onCancel={() => form.resetFields()}
>
  <Form form={form} onFinish={() => setOpen(false)}>
    {/* 复杂表单 */}
  </Form>
</FaFullContentModal>
```

- 自动挂到调用位置所属 Tab；切走再回来保留表单状态。
- `showOk`/`showCancel` 可隐藏按钮；未配 `onOk` 时点确定直接关闭。
- 受控模式在 `onFinish` 成功后关弹。
