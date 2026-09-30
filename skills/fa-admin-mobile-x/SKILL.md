---
name: fa-admin-mobile-x
description: >
  FA Admin uni-app X 移动端开发与框架文档维护规范。新增或修改基于 mobile-x 的 .uvue 页面、.uts 逻辑、Feature 模块、按钮、弹窗、图标和主题时使用；适用于本框架及其业务项目，不用于普通 uni-app 的 mobile/ 或 React 管理端。
---

# FA Admin MobileX

## 开发流程

1. 读取项目及目标目录的 `AGENTS.md`，参考相邻实现；在框架仓库中按需读 `mobile-x/docs/development/`，业务项目缺少维护源时按下表读 `references/`。不要一次加载全部文档。
2. 确认已有能力及实际调用方式。共享组件优先复用；原生组件约定和页面示例不能当成可导入的框架组件。
3. 业务按 `features/<模块>/` 组织，页面 `.uvue`、逻辑 `.uts`；涉及页面登记时更新模块 `feature.json` 并生成路由。
4. 执行最小范围验证；UTS 编译与原生交互使用匹配版本的 HBuilderX 和目标端。工具不可用时明确未验证项。
5. 新增共享组件、变更公共 API 或形成新约定时，按文档规范更新维护源和相关 demo，随后同步 skill 源仓库副本。不要因普通业务页面开发扩写框架规范。

## 按需阅读

| 场景 | 文档 |
| --- | --- |
| 新增或更新框架文档、分发同步 | [文档编写规范](references/documentation.md) |
| UTS、事件、样式、配置、验证 | [编码约定](references/coding.md) |
| 新增模块、页面、依赖或入口 | [Feature 与路由](references/feature-modules.md) |
| 主题存储、页面和导航栏配色 | [主题约定](references/theme.md) |
| 原生按钮类型、样式与状态 | [按钮约定](references/components/button.md) |
| 页面内确认或危险操作弹窗 | [弹窗示例](references/components/dialog.md) |
| FaIcon 参数、语义名称与回退 | [图标组件](references/components/icon.md) |

## 关键边界

- 文档中的源码路径相对移动端项目根目录；导入片段按标注目录调整，先核对当地实现。
- 当前有共享 `FaIcon`，按钮使用原生 `<button>`，dialog 是页面内实现；不要编造 `FaButton`、`FaDialog` 导入或接口。
- 触摸交互使用 `@tap`；只用目标 uni-app X 编译器支持的属性和 CSS，不直接套用 DOM/React 写法。
- 不手改 `pages.json`、`features/generated/feature-registry.json`，不提交本机凭据和生成资源。
- `references/` 来自框架维护源；冲突时以当地代码为准并修正文档。无源码时不要把副本当作平台验证证据。
- HBuilderX 版本和原生宿主流程从当地项目 `README.md`、宿主 `AGENTS.md` 核对；不要固定成本机路径或默认全平台可用。
