# 滚动列表

竖向轮播用 `FaScrollList`：

```tsx
<FaScrollList
  list={items}
  num={5}
  interval={5000}
  renderItem={(item) => <Item item={item} />}
/>
```

- 外层必须有可计算高度。
- 为记录提供稳定 key；列表过短时不滚动。
- 除非需要修改通用行为，不复制历史 200 行单文件轮播实现。
