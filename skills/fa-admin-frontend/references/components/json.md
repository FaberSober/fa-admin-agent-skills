# JSON 组件

## FaJsonView（展示）

只读/查看 JSON，支持字符串/对象/数组，折叠展开，异常数据兜底。

```tsx
<FaJsonView data='{"name":"tom","age":18}' defaultExpandDepth={1} />
```

关键 Props：

| Prop | 说明 |
| --- | --- |
| `data` | 字符串按 JSON 解析；对象/数组直接展示；null/空展示空状态 |
| `defaultExpandDepth` | `'all'` 全展开；`0` 全折叠；`N` 展开到第 N 层 |
| `showToolbar` | 展开全部/折叠全部/复制 |
| `maxRenderNodes` | 节点上限，防超大 JSON 卡死 |
| `defaultWrap` | 超宽换行 vs 横向滚动 |

非法 JSON、循环引用、空数据都有兜底展示，不崩页面。

## FaJsonEdit（编辑）

图形化 + 文本双模式编辑 JSON。文本模式允许暂时非法 JSON，解析通过后才能切图形模式。

```tsx
const [value, setValue] = useState('{"name":"tom"}');
<FaJsonEdit value={value} onChange={setValue} />
```

关键 Props：

| Prop | 说明 |
| --- | --- |
| `value` | 受控 JSON 源文本（字符串） |
| `defaultMode` | `'tree'` 图形 / `'text'` 源码 |
| `readOnly` | 只读 |
| `maxRenderNodes` | 图形模式节点上限 |
| `indent` | 格式化缩进空格 |

图形模式支持改字符串/数字/布尔/null、改 key、增删字段和数组项。
