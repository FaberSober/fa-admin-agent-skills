# 图标

## Iconify

先搜索 `@fa/icons` 和已安装集合。需要新集合时只装具体包：

```bash
pnpm add -D @iconify-json/streamline-sharp
```

不要装通用全集。用法：

```tsx
<div className="i-streamline-sharp:input-box" />
```

## 自定义 SVG

放入 `frontend/fa-ui/packages/icons/src/components/custom`，从 `@fa/icons` 导出：

```tsx
<FaSendIcon size="1em" color="currentColor" />
```

保留正确 `viewBox`，用 `currentColor` 便于主题化。
