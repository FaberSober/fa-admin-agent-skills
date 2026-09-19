# 拖拽排序

用 `FaSortList` / `FaSortGrid`：

```tsx
<FaSortList
  list={items}
  renderItem={(item) => <div>{item.name}</div>}
  onSortEnd={(newList) => setList(newList)}
  vertical
/>
```

- 列表项提供稳定唯一 key，不用数组下标作为持久身份。
- `onSortEnd` 更新本地顺序；需要保存时把 ID/排序值提交后端。
- 保存失败时恢复或重新加载服务端顺序。
