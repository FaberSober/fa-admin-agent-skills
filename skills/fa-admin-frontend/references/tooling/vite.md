# Vite / Fast Refresh

遇到 `Could not Fast Refresh` 时检查：

- 组件函数是否大写业务名。
- 默认函数是否叫 `index`（会报错）。
- 文件是否混合导出组件和非常量值。
- barrel 是否形成循环依赖。

不要通过关闭 HMR/规则掩盖结构问题。见 [hmr.md](hmr.md) 的命名规则。
