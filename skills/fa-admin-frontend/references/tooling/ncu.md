# 依赖升级检查

用 `ncu` 做候选版本检查，不直接全局安装：

```bash
npx npm-check-updates
```

`ncu -u` 会直接修改 package manifest，不在普通功能任务中运行。升级前检查 workspace 锁文件和 React/Vite/Ant Design 兼容性。
