# UI 组件目录与复用检查

分类：开发规范与已实现组件导航。实现位于 `features/fa-ui-mobile/`；新增界面先按下表选择组件，再读接口文档和相邻 Demo。以下八个组件均已实现，公共参数以对应文档和源码为准。

## 场景与实现

| 场景 | 组件 | 导入路径 | 接口文档 |
| --- | --- | --- | --- |
| 普通操作、禁用和加载 | FaButton | `@/features/fa-ui-mobile/components/fa-button.uvue` | [按钮](components/button.md) |
| 卡片背景、选中边框与内边距 | FaCard | `@/features/fa-ui-mobile/components/fa-card.uvue` | [卡片](components/card.md) |
| 设置行、说明、值和箭头 | FaCell | `@/features/fa-ui-mobile/components/fa-cell.uvue` | [设置列表](components/cell.md) |
| 设置列表分组背景 | FaCellGroup | `@/features/fa-ui-mobile/components/fa-cell-group.uvue` | [设置列表](components/cell.md) |
| 标签、输入、密码和错误提示 | FaField | `@/features/fa-ui-mobile/components/fa-field.uvue` | [输入项](components/field.md) |
| 语义名称与字体图标 | FaIcon | `@/features/fa-ui-mobile/components/fa-icon.uvue` | [图标](components/icon.md) |
| 固定行高的手柄/整行重排 | FaSortList | `@/features/fa-ui-mobile/components/fa-sort-list.uvue` | [拖动排序](components/sort.md) |
| 固定单元高度的网格重排 | FaSortGrid | `@/features/fa-ui-mobile/components/fa-sort-grid.uvue` | [拖动排序](components/sort.md) |

消费者在 `feature.json.dependsOn` 声明 `fa-ui-mobile`。组件文件按 Fa 前缀命名；导入标识用 PascalCase，模板用 kebab-case。

## 最小调用片段

以下为业务页面的模板片段；`dark`、表单值、状态和事件函数由调用方定义，导入路径见上表。

```vue
<fa-button text="保存" :dark="dark" :loading="saving" @press="save" />
<fa-card :dark="dark" :active="selected"><text>自定义内容</text></fa-card>
<fa-cell-group :dark="dark">
 <fa-cell :dark="dark" title="登录设备" description="查看当前及历史设备" :border="false" @press="openDevices" />
</fa-cell-group>
<fa-field v-model="password" label="当前密码" :password="true" :dark="dark" :error="error" />
<fa-icon name="home" :size="24" color="#1677ff" />
```

排序组件必须提供 item 插槽；列表 `sort-end(list, oldIndex, newIndex)` 与网格 `sort-end(list)` 参数不同，完整最小用法见拖动排序文档。

## 可运行 Demo

- 按钮：`features/fa-demo-mobile/pages/basic/button/index.uvue`，包含主题、类型、禁用、加载和事件计数。
- 卡片：`features/fa-demo-mobile/pages/basic/card/index.uvue`，包含主题、选中态、内边距、嵌套及内部按钮。
- 设置列表：`features/fa-demo-mobile/pages/basic/cell/index.uvue`，包含信息行、分隔线、禁用恢复和长文本。
- 输入项：`features/fa-demo-mobile/pages/basic/field/index.uvue`，包含密码、长度限制、焦点、错误及确认事件。
- 图标：`features/fa-demo-mobile/pages/basic/icons/index.uvue`，包含尺寸、主题和未知名称回退。
- 列表排序：`features/fa-demo-mobile/pages/basic/sort-list/index.uvue`，包含手柄/整行、空/单条和事件计数。
- 网格排序：`features/fa-demo-mobile/pages/basic/sort-grid/index.uvue`，包含跨行、浮层与空/单条。

入口均在“移动端 Demo → 基础组件”；需启用调试模式才能显示 Demo 入口。预览主题不修改持久化偏好。

## 边界与复用规则

- 首期继续显式传 `dark`。主题存储、导航栏和页面背景由 core/页面管理；共享响应式主题入口、CSS 变量试验及 easycom 简化仍是后续规划，不是现有 API。
- UI Feature 无业务依赖和页面；组件可导入 Vue、`@dcloudio/uni-app`、UI 自身及工程的 `uni_modules`，保留同目录 `./文件` 引用，不导入 core/base/具体业务或通过父目录绕行。新增外部依赖需同步调整检查允许范围并说明用途；第三方运行兼容仍需单独验证。
- UI 负责默认展示、结构、主题状态和基础事件；业务负责请求、权限、路由、校验、保存与恢复。FaCard 插槽文字、FaCellGroup 内各行仍需调用方显式绑定主题；复杂业务保留原业务组件，内部组合 UI。
- 页面间距和尺寸留在外层容器；优先用少量预设，避免复制组件内部颜色、边框、字号和按下/禁用行为。不依赖页面 CSS 穿透组件。

## 定向检查与例外

`pnpm check --group core --name check-ui-reuse.mjs` 仅扫描 UI 模块、组件目录和四个试点：

| 试点 | 复用要求 | 明确保留的例外 |
| --- | --- | --- |
| 统一卡片 Demo | 使用 FaCard，不重新拼装卡片背景，不新增原生 input/button | 页面主题和插槽文字布局 |
| 账号与安全 | 使用 FaCell / FaCellGroup，不恢复手工卡片/原生控件 | 页面标题、说明和背景 |
| 重置密码 | 使用 FaField / FaButton，不恢复原生控件或输入项基础样式 | 一张 class 为 `fa-card card` 的现有外层卡片、页面布局及服务端错误提示 |
| mine-setting-entry | 使用 FaCell，不恢复 mine-setting 行模板/样式 | 原业务参数与 open(route) 事件 |

检查同时核对 UI 依赖方向、组件命名、目录完整性、文档和 Demo 路径/路由。新试点在 `tests/support/ui-reuse.mjs` 的 `uiPilots` 显式登记；例外必须有具体页面和用途，避免扩大为全局豁免。

这是轻量源码检查，覆盖指定结构、导入写法与已知样式回退，不是完整 Vue/UTS AST 分析；不对全部历史 view/input 一刀切。卡片轮廓、边框几何和旧样式转引继续由 `check-cards.mjs` 检查。组件行为使用对应检查，新增界面及公共接口仍需目标端编译和运行验收。

## 验证

2026-10-17 UI06：组件目录与复用检查通过（8 个组件、4 个试点）；检查器 6 个单测及现有卡片检查通过，skill package-check 通过。仅新增文档和静态工程约束，不修改运行代码或组件接口，无需新增原生编译或人工界面验收，状态为 ✅已完成；各组件的端侧验证范围仍以对应文档为准。
