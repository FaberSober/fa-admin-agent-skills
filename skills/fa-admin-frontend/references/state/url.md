# URL 参数与标签页

## 动态路由参数

```tsx
const { id } = useParams<{ id: string }>();
```

## Query 参数

用 `useQs()`，不手动解析 `window.location.search`：

```tsx
const search = useQs(); // { id: '222' }
```

## 菜单标签页

```tsx
const { addTab, removeTab } = useContext(MenuLayoutContext);

addTab({
  key: '/admin/system/account/base',
  path: '/admin/system/account/base',
  name: '个人中心',
  type: 'inner', // 或 'iframe'
  closeable: true,
});

removeTab('/admin/system/account/base');
```

- `key` 在打开标签中唯一稳定。
- 外部 iframe URL 必须明确可信域。
- 不直接修改 DOM 模拟标签状态。

## 页面标题

```tsx
<Helmet title={`页面标题-${systemConfig.title}`} />
```
