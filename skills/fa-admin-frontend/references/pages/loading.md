# Loading

请求 loading 用 `useApiLoading`，key 必须与请求层记录的 URL 完全一致：

```tsx
// 单个 URL
const loading = useApiLoading(api.getUrl('save'));

// 多个 URL
const loading = useApiLoading([
  api.getUrl('save'),
  api.getUrl('update'),
]);
```

不要接入旧 ApiEffect 组件，也不要为同一请求额外维护手工 loading。
