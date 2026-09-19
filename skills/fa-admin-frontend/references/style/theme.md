# 主题（亮色/暗色）

```tsx
const { themeDark, colorPrimary } = useContext(ThemeLayoutContext);
```

主题配置和应用逻辑以当前文件为准：

- `frontend/fa-ui/packages/ui/src/layout/theme/ThemeLayout.tsx`
- `frontend/fa-ui/packages/theme/theme.scss`

新增颜色优先用现有 CSS 变量/Ant Design token。自定义时同时验证 light/dark、hover、disabled、border 和文本对比度。
