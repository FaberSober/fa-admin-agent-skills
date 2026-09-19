# Office 文档查看/编辑

通过 `MenuLayoutContext.addTab` 打开内部标签：

```tsx
const { addTab } = useContext(MenuLayoutContext);

// 查看
addTab({
  key: `/admin/common/doc/view/${fileId}`,
  path: `/admin/common/doc/view/${fileId}`,
  name: `查看文档-${name}`,
  type: 'inner',
  closeable: true,
});

// 编辑
addTab({
  key: `/admin/common/doc/edit/${fileId}`,
  path: `/admin/common/doc/edit/${fileId}`,
  name: `编辑文档-${name}`,
  type: 'inner',
  closeable: true,
});
```

打开前确认用户权限和文件类型。tab key 保持唯一稳定。标签操作见 [../state/url.md](../state/url.md)。
