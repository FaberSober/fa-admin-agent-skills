# Tree 树选择

## BaseCascader

```tsx
export default function TreeCascade(props: Omit<BaseCascaderProps<Demo.Tree>, 'serviceApi'>) {
  return <BaseCascader showRoot={false} serviceApi={treeApi} {...props} />;
}
```

配置 `showRoot`、root ID、Key 类型、multiple、disabled IDs 时核对当前组件类型。

## 刷新树

业务变更后刷新树用项目现有事件，不发明新事件名：

```ts
dispatch({ type: Fa.Constant.TREE_REFRESH_BUS_KEY });
```

事件总线见 [../state/bus.md](../state/bus.md)。
