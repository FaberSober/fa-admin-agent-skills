# Tabs

普通页面区域用 Ant Design `Tabs` 的 `items` API：

```tsx
<div className="fa-full-content-p12 fa-flex-column fa-tabs">
  <Tabs size="small" type="card" items={[
    { key: '1', label: '图形', children: <div>Tab 1</div> },
    { key: '2', label: '列表', children: <div>Tab 2</div> },
  ]} />
</div>
```

路由级菜单标签页的 `addTab/removeTab` 见 [../state/url.md](../state/url.md)，不要把两类 Tabs 混为一套状态。
