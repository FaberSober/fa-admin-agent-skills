# pnpm workspace

在 workspace 根目录操作，用 `--filter` 限定目标包：

```bash
pnpm add lodash --filter @fa/admin
pnpm add -D @types/lodash --filter @fa/admin
```

实际 package name 从目标 `package.json` 确认。新增依赖时确认应属于具体 app、`@fa/ui`、icons 还是 workspace root。
