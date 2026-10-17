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
| 场景选组件、真实导入、Demo 与定向复用规则 | [UI 组件目录](references/ui-components.md) |
| 新增模块、页面、依赖或入口 | [Feature 与路由](references/feature-modules.md) |
| 页面主题、异步操作、会话保护、查询、表单与退出流程复用 | [业务页面辅助目录](references/business-reuse.md) |
| 主题存储、页面和导航栏配色 | [主题约定](references/theme.md) |
| FaButton 参数、主题、禁用/加载状态与原生按钮约定 | [按钮约定](references/components/button.md) |
| FaCard 参数、插槽、点击、主题与兼容卡片结构 | [卡片约定](references/components/card.md) |
| FaCell / FaCellGroup 设置行、分组、禁用与业务入口 | [设置列表](references/components/cell.md) |
| FaField 值绑定、密码、禁用、焦点和错误提示 | [输入项](references/components/field.md) |
| FaSortList / FaSortGrid 拖动、事件签名、插槽与滚动边界 | [拖动排序](references/components/sort.md) |
| 页面内确认或危险操作弹窗 | [弹窗示例](references/components/dialog.md) |
| FaIcon 参数、语义名称与回退 | [图标组件](references/components/icon.md) |

## 关键边界

- 文档中的源码路径相对移动端项目根目录；导入片段按标注目录调整，先核对当地实现。
- 新增 UI 先查组件目录和相邻调用，再选择现有组件；只在接口确实不能覆盖时扩展。四个迁移试点的复用规则及例外由目录文档和 `check-ui-reuse.mjs` 维护，不对全部历史页面强制替换；新增导入或试点同步维护检查与最小示例。
- 框架通过 `pages.config.json.easycom.custom` 统一注册八个 UI 组件，模板可直接使用 Fa 标签而无需逐项 import；应用级组件保持显式导入。旧项目先核对当地配置，未配置时仍使用实际组件路径。映射修改后运行页面生成器，不手改 pages.json；保留 uni-icons 等原有自动发现能力。
- 通用 UI 由独立 `features/fa-ui-mobile/` 提供，消费者声明对应 Feature 依赖；UI 不反向导入 core/base/业务模块。新增普通操作按钮优先复用 `components/fa-button.uvue`（FaButton），语义图标复用 `components/fa-icon.uvue`（FaIcon，依赖工程现有 uni-icons）。FaButton 传入 `text`、`dark` 和业务状态，使用 `@press`；内部保留原生按钮并统一处理主题、禁用和 loading，间距与布局由外层容器控制。纯按钮/图标工具位于 UI 的 `common/`，公共样式位于 `styles/`；core 旧按钮 CSS 仅转引。
- 旧项目使用前先核对是否已有 `FaButton`；未提供组件或需要特殊表情/图标按钮时，沿用当地原生 `<button>` 和共享样式工具。原生禁用颜色会覆盖 class，使用 `getButtonDisabledStyle` 绑定内联样式，不能仅添加暗色 class。具体参数与验证命令见按钮约定。
- dialog 的页面示例不能当成共享组件；导入其他弹窗组件前先核对当地实现，不编造接口。
- 新增普通内容、列表、入口和确认卡片优先复用 `features/fa-ui-mobile/components/fa-card.uvue`（FaCard），支持显式 `dark`、`active`、`padding`（normal/small/none）、默认插槽和 `@press`。内部控件需阻止 tap 冒泡；间距和尺寸放外层容器，插槽文字主题由调用方管理。消费者声明 UI Feature 依赖；旧项目先核对是否已有组件。
- 常规设置行优先复用 UI 的 FaCell / FaCellGroup；分组只提供卡片背景，每行显式传 `dark`，最后一行传 `border=false`。FaCell 支持标题、说明、值、图标、箭头、禁用和 `@press`；纯展示行传 `clickable=false`，隐藏箭头另传 `arrow=false`。路由与请求留在业务层；已有业务设置入口保留自身事件契约，内部复用通用行。
- 常规输入项优先复用 UI 的 FaField，使用 `v-model`、显式 `dark`、`disabled` 与业务 `error`。组件透传原生输入能力，先同步确认值再派发 `confirm`；focus 请求随 focus/blur 事件复位。不裁剪、记录或存储密码；校验、请求及验证码倒计时仍由业务层处理，原生键盘与 maxlength 需目标端验收。
- 固定高度列表/网格排序复用 UI 的 FaSortList / FaSortGrid，使用稳定唯一 rowKey，条目由插槽提供。列表 `sort-end(list, oldIndex, newIndex)` 与网格 `sort-end(list)` 保持不同签名；业务接收结果后更新 list 并自行保存。取消、外部更新或页面离开会废弃未完成拖动，不提供自动滚动或变高条目能力；按拖动排序文档验证原生手势和浮层。
- 未迁移页面仍可使用 `fa-card` 宿主及首个子节点 `fa-card-surface` / `fa-card-fill` 背景结构。基础样式只在 `features/fa-ui-mobile/styles/cards.css` 维护，core 旧路径仅转引；圆角只有一处声明。边框用外层背景绘制，填充层四边显式内缩，不叠加原生 border，不重复定义背景和圆角或用 `overflow: hidden` 裁剪。自定义组件内导入公共 CSS；运行 `pnpm check --group core --name check-cards.mjs`，原生效果仍需目标端验证。
- 触摸交互使用 `@tap`；只用目标 uni-app X 编译器支持的属性和 CSS，不直接套用 DOM/React 写法。
- 不手改 `pages.json`、`features/generated/feature-registry.json`，不提交本机凭据和生成资源。
- `references/` 来自框架维护源；冲突时以当地代码为准并修正文档。无源码时不要把副本当作平台验证证据。
- HBuilderX 版本和原生宿主流程从当地项目 `README.md`、宿主 `AGENTS.md` 核对；不要固定成本机路径或默认全平台可用。
