# 页面缓存

`react-activation` 方案已记录会导致 Context 失效，且旧示例依赖 `ReactDOM.render`。不要直接恢复。

需要保持列表状态时优先：

- 菜单标签的当前保活/重载机制。
- 查询条件放入 URL、现有 store 或受控父层。
- 保留必要局部状态，不缓存整个 React 子树。

只有确认与当前 React/Vite/Context 兼容并有真实需求时才引入缓存库。
