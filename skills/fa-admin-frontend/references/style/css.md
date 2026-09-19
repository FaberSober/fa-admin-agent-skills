# CSS

## clsx 拼接 class

```tsx
import { clsx } from 'clsx';

<div className={clsx('fa-flex-row-center', active && 'is-active', className)} />
```

优先用项目 `fa-*` 原子类和 CSS 变量。新 CSS 变量沿用现有命名和作用域，不在业务组件覆盖全局 Ant Design 选择器。修改共享 theme 包前搜索影响范围，不用 `!important` 修局部问题。
