---
name: fa-admin-frontend
description: >
  FA Admin 框架（React/Vite + Ant Design + @fa/ui）前端开发规范。在新增或修改后台页面、CRUD、feature 模块、表格/表单/选择器、弹窗、文件上传、JSON 组件、路由标签、状态事件、遥测埋点、主题样式、Vite/pnpm 工具链时使用。适用于以 fa-admin-pages 和 @fa/ui 为基座的 FA Admin 业务项目。
---

# FA Admin 前端

## 常用场景：新增一个 CRUD 页面

1. 找最相近 feature，复用 configs/services/types 结构。→ [references/pages/feature-modules.md](references/pages/feature-modules.md)
2. 加 types 和 services。→ [references/pages/crud-pages.md](references/pages/crud-pages.md)
3. 写列表页和弹窗。→ [references/pages/table.md](references/pages/table.md)、[references/components/modal.md](references/components/modal.md)
4. 按需用 Select/Tree/Form。→ [references/pages/select.md](references/pages/select.md)
5. 局部 typecheck/lint。

## 参考文档

| 主题 | 文档 |
| --- | --- |
| feature 组织、configs/services/types | [pages/feature-modules.md](references/pages/feature-modules.md) |
| CRUD 页面流程、service/type | [pages/crud-pages.md](references/pages/crud-pages.md) |
| BaseBizTable 表格、列生成器、组合查询 | [pages/table.md](references/pages/table.md) |
| Form 表单、InputNumber、Switch | [pages/form.md](references/pages/form.md) |
| Select/SearchSelect 选择器 | [pages/select.md](references/pages/select.md) |
| Tree/Cascader 树选择 | [pages/tree.md](references/pages/tree.md) |
| 日期处理 | [pages/date.md](references/pages/date.md) |
| Loading 请求状态 | [pages/loading.md](references/pages/loading.md) |
| Tabs 标签页 | [pages/tabs.md](references/pages/tabs.md) |
| 弹窗选择（Modal/DragModal/BaseModal） | [components/modal.md](references/components/modal.md) |
| 文件上传 | [components/upload.md](references/components/upload.md) |
| Office 文档查看/编辑 | [components/office.md](references/components/office.md) |
| 拖拽排序 | [components/dnd.md](references/components/dnd.md) |
| 滚动列表 | [components/scrollList.md](references/components/scrollList.md) |
| 3D 模型 | [components/3dmodal.md](references/components/3dmodal.md) |
| FormEditor 低代码 | [components/formEditor.md](references/components/formEditor.md) |
| FaJsonView / FaJsonEdit | [components/json.md](references/components/json.md) |
| 路由跳转 | [state/route.md](references/state/route.md) |
| URL 参数、菜单标签页、页面标题 | [state/url.md](references/state/url.md) |
| 首页 Cube | [state/home.md](references/state/home.md) |
| 登录页背景效果 | [state/login.md](references/state/login.md) |
| 页面缓存 | [state/cache.md](references/state/cache.md) |
| 事件总线 | [state/bus.md](references/state/bus.md) |
| WebSocket / Socket.IO | [state/socket.md](references/state/socket.md) |
| 遥测埋点、异常上报 | [state/telemetry.md](references/state/telemetry.md) |
| CSS / clsx | [style/css.md](references/style/css.md) |
| 主题亮色/暗色 | [style/theme.md](references/style/theme.md) |
| 图标 Iconify/SVG | [style/icon.md](references/style/icon.md) |
| Prism 代码高亮 | [style/prism.md](references/style/prism.md) |
| 环境变量 | [tooling/env.md](references/tooling/env.md) |
| Vite Fast Refresh | [tooling/vite.md](references/tooling/vite.md) |
| HMR 组件命名规则 | [tooling/hmr.md](references/tooling/hmr.md) |
| pnpm workspace | [tooling/pnpm.md](references/tooling/pnpm.md) |
| 依赖升级检查 | [tooling/ncu.md](references/tooling/ncu.md) |
| 开发规范 | [tooling/rule.md](references/tooling/rule.md) |

## 硬规则

- 不擅自 `vite build`/`pnpm build`，除非用户要求。
- `VITE_APP_*` 都会进产物，密钥/token 绝不放前端。
- 分页/删除/导出/loading 用 `useTableQueryParams`/`useDelete`/`useExport`/`useApiLoading`，不手写。
- WebSocket 统一用项目 `sendMessage`，不新建第二条连接。
- 组件大写业务名，不叫 `index`；从聚合出口导入，不跨 feature 深相对路径。
