# Prism 代码高亮

先搜索当前 Markdown/编辑器组件是否已有高亮方案。仍用 public Prism 时：

1. 版本化放 `public/plugins/prism/<version>/`。
2. HTML 入口引入对应 JS/CSS。
3. 动态内容渲染后调 `Prism.highlightAll()`。
4. 只包含需要的语言/插件。
5. 不信任的代码按文本渲染，不绕过 HTML 清理。
