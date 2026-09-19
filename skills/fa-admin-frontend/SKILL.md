---
name: fa-admin-frontend
description: FA Admin 前端开发与维护规范。用于基于 FA Admin 的 React/Vite 后台管理页面、普通或树形 CRUD、feature 模块、services/types、@fa/ui 表格/表单/选择器/弹窗、文件上传、路由标签页、状态与事件、主题样式、Vite/HMR/pnpm 或复杂交互组件任务。
---

# FA Admin 前端

以 `@fa/ui`、`fa-admin-pages` 为基座的 React/Vite 后台前端。优先复用现有 services、types、hooks 和 `@fa/ui` 组件；reference 与当前源码冲突时，以源码、类型声明和目标 feature 风格为准。

## 执行顺序

1. **找相邻实现**：用 `rg` 定位目标 feature、最相近页面和 `@fa/ui` 组件源码，确认目录、别名、类型、组件 API 与后端契约。
2. **查路由表**：只读对应 reference，不加载无关文档。
3. **最小改动**：只实现需求所需；不顺带重组 feature、升级依赖、替换状态方案或改全局主题。
4. **动手**：新建页面按 [feature-modules.md](references/feature-modules.md) / [crud-pages.md](references/crud-pages.md) 的创建顺序。
5. **验证**：局部类型、语法、页面检查；不跑完整 build。

## 技术基线

| 项 | 基线 |
| --- | --- |
| 框架 | React 函数组件 + Hooks，不写 class 组件 |
| 构建 | Vite + pnpm workspace，依赖在 workspace 根目录用 `--filter` 安装 |
| UI | Ant Design + `@fa/ui`，以 `frontend/fa-ui/packages/ui` 当前源码为准，不照抄旧文档签名 |
| 样式 | UnoCSS 原子类（`fa-*`）+ CSS 变量，不全局覆盖 Ant Design 选择器 |
| 状态/通信 | Zustand；跨层级松耦合用 `use-bus`；父子共享优先 props/context |
| 路由/标签 | React Router；菜单标签统一走 `MenuLayoutContext.addTab` |
| 主键契约 | 与后端一致：Long 主键前端用 `string` 承接 |

## 硬性红线

违反任意一条即视为错误：

- **不擅自完整构建**：不跑 `vite build`/`pnpm build`/`npm run build`，除非用户明确要求。
- **凭证不进前端包**：所有 `import.meta.env.VITE_APP_*` 都会打进产物，密钥、密码、服务端 token 绝不放；敏感配置只在后端。
- **不重复造轮子**：分页/删除/导出/loading 必须用 `useTableQueryParams`/`useDelete`/`useExport`/`useApiLoading`，不在页面手写。
- **不新建第二条 WebSocket**：统一用项目 `sendMessage`，type 与后端协议一致。
- **不恢复旧缓存方案**：`react-activation` 已弃用，列表状态用菜单标签保活/URL/store。
- **按需安装依赖**：图标只装具体 `@iconify-json/<collection>`，不装全集；不为背景效果同时引入多个大依赖。
- **组件规范**：函数组件大写业务名，不叫 `index`；常量/类型拆独立文件避免 Fast Refresh 报错。
- **导入边界**：从 `@/configs`/`@/services`/`@/types` 或 feature 聚合出口导入，不跨 feature 深层相对路径；不在 JSX 拼 URL。
- **文件 URL**：用 `fileSaveApi.genLocalGetFile/genLocalGetFilePreview`，不硬编码域名；数据库存 fileId 不存 Base64/浏览器路径。

## Reference 路由

| 任务 | 必读 reference |
| --- | --- |
| 创建/重组 feature、configs、services/types 聚合、页面目录 | [feature-modules.md](references/feature-modules.md) |
| 标准 CRUD 列表、service/type、弹窗、删除/导出 | [crud-pages.md](references/crud-pages.md) |
| `BaseBizTable`、查询表单、日期、Select/SearchSelect、Tree、Tabs、loading | [tables-forms-selectors.md](references/tables-forms-selectors.md) |
| 文件上传/预览、Office、拖拽、滚动列表、3D、FormEditor | [files-rich-components.md](references/files-rich-components.md) |
| 路由/query、菜单标签页、首页 Cube、登录、页面缓存、事件总线、Socket | [navigation-state-events.md](references/navigation-state-events.md) |
| CSS、暗色主题、Iconify/SVG 图标、Prism | [styling-theme-icons.md](references/styling-theme-icons.md) |
| 环境变量、Vite/HMR、pnpm workspace、依赖检查 | [tooling-vite.md](references/tooling-vite.md) |

## 关键代码入口

- CRUD 列表：`frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/index.tsx`
- CRUD 弹窗：`frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/modal/StudentModal.tsx`
- Service/Type：`frontend/apps/admin/features/fa-admin-demo-pages/services/demo/student.ts`、`.../types/Demo.ts`
- 表格 Hook：`frontend/fa-ui/packages/ui/src/hooks/useTableQueryParams.tsx`
- UI 组件：`frontend/fa-ui/packages/ui/src/components`
- 目标业务 feature：以 `frontend/apps/admin/features/` 下实际目录为准，用 `ls`/`rg` 定位最相近 feature

## 验证清单

- **类型**：无 `any` 掩盖契约；主键/枚举/可空字段与后端一致（Long→`string`）；独立声明请求/响应类型。
- **组件**：大写业务名；常量/类型未与组件混导出；无 `index` 默认函数。
- **网络**：URL 从 configs/service 出；文件 URL 走 `genLocalGetFile`；loading URL 与实际请求一致。
- **路由/菜单**：页面 `path` 与后端菜单 `link_url` 一致；`addTab` 的 `key` 唯一稳定。
- **构建**：局部 typecheck/lint 通过；无未用 import；不跑全量 build 除非用户要求。
