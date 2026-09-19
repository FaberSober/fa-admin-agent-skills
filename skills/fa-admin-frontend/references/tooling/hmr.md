# HMR 热更新

## 组件命名规则

默认导出函数必须大写开头：

```tsx
// 正确
export default function Demo01() { return <div />; }

// 错误（小写或叫 index 都会导致 Fast Refresh 失败）
export default function demo01() { return <div />; }
export default function index() { return <div />; }
```

## ESLint

`react-refresh/only-export-components` 规则要求：一个文件只导出组件，常量/context/工具拆到独立文件。
