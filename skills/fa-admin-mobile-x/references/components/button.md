# 按钮使用约定

分类：共享组件与原生组件使用约定。共享组件：`features/fa-ui-mobile/components/fa-button.uvue`，示例为按钮、请求 Loading 与下拉刷新 Demo。公共样式：`features/fa-ui-mobile/styles/buttons.css`；core 旧样式路径仅转引。普通业务操作统一优先使用 FaButton；原生按钮保留给组件内部实现、原生属性 Demo 和特殊触摸手势。

## 统一 FaButton

普通操作按钮使用 `FaButton`，组件内部保留原生 `<button>`，统一处理主题、禁用/加载拦截和 `press` 事件。页面通过按钮属性与外层布局保留业务样式。

消费者在 `feature.json.dependsOn` 声明 `fa-ui-mobile`。组件、工具和样式已迁入 UI 模块，旧 core 组件/工具路径不再提供实现；UI 不读取主题存储或业务状态，现有参数、事件和配色保持不变。

```vue
<fa-button text="刷新资料" :dark="themeMode === 'dark'" :disabled="busy" @press="refreshProfile" />
<fa-button text="提交中…" :dark="themeMode === 'dark'" :loading="saving" @press="saveProfile" />
<fa-button text="取消" :dark="dark" type="custom" width="auto" class="dialog-cancel" @press="cancel" />
<fa-button text="同意并继续" :dark="dark" type="custom" open-type="agreePrivacyAuthorization" @press="agree" />
```

mobile-x 已通过 easycom 自动注册，页面可直接使用 `<fa-button>`。其他工程仍可显式导入组件。

| 参数 | 类型 | 必填 / 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | string | 必填 | 按钮文字，无插槽 |
| `dark` | boolean | 必填 | 页面当前主题 |
| `disabled` | boolean | false | 禁用点击 |
| `loading` | boolean | false | 原生加载图标，同时禁用点击 |
| `type` | string | primary | primary / default / warn；`custom` 交由自定义样式控制，其他值按 primary 处理 |
| `plain` | boolean | false | 启用时为透明描边按钮；禁用时使用统一禁用底色 |
| `height` | number | 88 | 单位 rpx，同步设置高度和行高；不传时使用 CSS 默认值 |
| `fontSize` | number | 28 | 单位 rpx；不传时使用 CSS 默认值 |
| `width` | string | 100% | CSS 宽度，如 `auto`、`112rpx` |
| `customStyle` | UTSJSONObject | 无 | 叠加在主题/尺寸样式之后，覆盖按钮样式 |
| `loadingClass` | string | 按主题选择 | 自定义原生加载图标样式 |
| `hoverClass` | string | `fa-button-hover` | 自定义按下反馈 class |
| `openType` | string | 空 | 透传原生 `open-type`，用于系统按钮能力 |

事件 `press` 无参数，仅可操作时触发一次；组件内部使用 `@tap.stop`，调用方使用 `@press`。按钮只显示 `text` 属性，不提供插槽。默认宽度填满容器、圆角 14rpx；紧凑按钮可传 `width`。页面局部样式类应通过组件的 `class` 属性传入（支持动态 class），以保留页面样式作用域；不要通过普通 `buttonClass` prop 传递 class。需要动态覆盖 CSS 属性时可使用 `customStyle`。

预设类型的禁用态复用 `getButtonDisabledStyle`：暗色背景 `#1b2434`、边框 `#2b3648`、文字 `#8290a6`；亮色使用对应浅色禁用配色。`custom` 类型启用时不注入预设颜色，禁用时仍使用统一禁用色，可由 `customStyle` 覆盖。主题或状态改变时自动重算，恢复后回到对应类型配色。业务仍需保留防重复提交逻辑；表情触摸控件继续使用下方原生按钮约定。

验证：`pnpm check --group core --name check-fa-button.mjs` 检查主题切换、禁用与恢复、loading 防重复点击、单次事件和尺寸。2026-10-11 已通过该检查、请求 Loading Demo 检查及原生按钮检查；未执行本次 Android/iOS 原生编译或真机验证。

## 原生按钮示例

只有需要展示原生能力或实现特殊手势时才直接使用 `<button>`；`recordTap` 由页面定义：

```vue
<button hover-class="fa-button-hover" class="fa-button" type="primary" @tap="recordTap('保存')">保存</button>
<button hover-class="fa-button-hover" class="fa-button" type="primary" :loading="true" :disabled="true">提交中</button>
```

第二个按钮只展示状态；实际业务由请求状态绑定 `loading` 和 `disabled`，不能直接把常量演示复制成业务流程。

## 已使用的原生属性

| 属性或事件 | demo 用法 |
| --- | --- |
| `type` | `primary`、`default`、`warn` |
| `size` | `mini` |
| `plain` | `:plain="true"`，示例另设透明背景 |
| `loading`、`disabled` | 布尔绑定；加载示例同时禁用按钮 |
| `open-type` | 系统隐私授权示例 |
| `@tap` | 记录最近点击的标签 |

无自定义接口；此表只记录项目示例，不是原生按钮完整 API 或默认值说明。

## 样式与限制

保留的原生按钮必须显式设置 `hover-class="fa-button-hover"` 并包含静态 `class="fa-button"`，业务类追加在其后。公共类统一 `box-sizing: border-box`、高度与行高 `88rpx`、上下内边距 `0`、外边距 `0`、文字水平居中和字号 `28rpx`。原生默认纵向内边距与页面自定义高度、行高叠加可能使文字偏下，因此不能只修改 `height` 和 `line-height`。

FaButton 调用方通过组件根节点的 `class` 提供页面样式类，通过 `customStyle` 覆盖主题生成的内联样式；`width`、`height` 和 `fontSize` 用于尺寸控制。原生按钮仍使用页面局部类、共享禁用工具和 `loading-class`，原生禁用态会覆盖仅由 class 设置的颜色。

### 按下态与主题

原生默认 `button-hover` 会引入浅色背景，在暗色主题的透明表情按钮上尤其明显。公共 `fa-button-hover` 仅将 `opacity` 降至 `0.7`，保留按钮的背景、边框和文字色；保留的原生按钮显式绑定此类。FaButton 默认使用同一 hover class，也可通过 `hoverClass` 改写。透明按钮的内联 `opacity` 可能覆盖这个反馈，表情这类小按钮应使用下面的显式触摸状态方案。

透明表情按钮需要明显按下反馈时使用 `getTransparentButtonStyle(dark: boolean, disabled: boolean, pressed: boolean): UTSJSONObject` 绑定内联样式，并设置 `hover-class="none"`。函数同时管理透明常态、主题按下底色与禁用不透明度。按钮自己的 `touchstart` 设置按下状态，`touchmove/touchend/touchcancel` 清除；不阻止滚动容器接管滑动。关闭面板、离开页面时清除状态。不要依赖外层容器 hover 接收内层原生按钮的触摸，也不要将公共 hover 与内联不透明度叠加。最近和全部表情使用不同状态键，按下仅高亮实际触摸的按钮；这两处保留原生按钮以保留逐项触摸事件。

### 禁用态与主题

共享工具 `features/fa-ui-mobile/common/button.uts` 导出 `getButtonDisabledStyle(dark: boolean, disabled: boolean, transparent: boolean = false): UTSJSONObject`，绑定到按钮的 `:style`。普通按钮禁用时返回对应主题的背景、边框及文字色，启用时返回空对象；透明按钮始终返回透明背景/边框，并以 `opacity` 区分禁用和启用，避免原生禁用态出现白底。

```uts
import { getButtonDisabledStyle } from '@/features/fa-ui-mobile/common/button.uts'
const disabledStyle = computed((): UTSJSONObject => getButtonDisabledStyle(dark.value, sending.value))
const emojiStyle = computed((): UTSJSONObject => getButtonDisabledStyle(dark.value, sending.value, true))
```

业务自定义颜色可以在自己的计算样式中合并或覆写；仍须保留 `:disabled` 与业务防重复提交。不要使用属性选择器修复禁用态，uni-app X 不支持该选择器。本工具不替代页面读取和响应主题。

原生按钮只能直接包含文字或文字插值，不能嵌套 `<text>`、图标、`<view>` 或插槽内容。使用 `@tap`；按钮外需要扩大触摸范围时沿用仓库的外层 `<view>` 方案。公共样式不接管业务请求、权限或防重复提交。

示例不提交请求，也没有业务防重复提交逻辑。复用时保留业务自己的提交状态和错误处理，不把显示 loading 当成请求已完成的依据。

## 验证

2026-10-17 UI01B：FaButton、纯按钮工具和公共样式迁入独立 UI Feature，按钮 Demo 增加组件类型、尺寸、禁用/加载切换、点击计数及不持久化的明暗预览。按钮逻辑、原生按钮、图标及卡片/依赖检查通过；HBuilderV 配套 SDK CLI `5.31.2026100911-alpha` Android 资源编译及导出通过，完整日志无 warning/error。用户确认本批人工验证通过，UI01B 状态为 ✅已完成，未单独注明验收平台；本次自动化未构建 APK、未运行设备、未编译 iOS。

运行 `pnpm check --group core --name check-buttons.mjs`，检查 `features/` 下原生按钮的样式与结构，并限制原生按钮只用于 FaButton 实现、按钮原生能力 Demo 和表情手势。该检查不代表文字已在设备上居中。

历史记录（2026-10-10）：公共样式接入基础业务与 Demo 的 49 个原生按钮，静态检查及 HBuilderX 5.26 Android/iOS Vapor 资源编译通过；端侧文字居中、点击、禁用、加载及亮暗主题仍需真机验收。

2026-10-17 UI07：扩展 FaButton 的自定义 class/style、宽度、加载图标 class、hover class 和原生 `open-type`；将 97 个消费侧原生按钮中的 87 个普通操作改为 FaButton。原生余项是 8 个按钮原生能力 Demo 和 2 个聊天表情触摸控件，组件内部仍保留原生 `<button>`。页面样式类改为通过组件根节点 `class` 透传，修复暗色按钮回退为原生白底的问题。FaButton 行为检查、原生按钮例外检查通过；修复后使用 HBuilderV 配套 SDK CLI `5.31.2026100911-alpha` 重新编译并导出 Android App 资源成功，完整日志未发现 warning/error。自动化未运行设备、未编译 iOS；用户确认本批人工验证通过，未单独注明验收平台，UI07 状态为 ✅已完成。

2026-10-10：聊天表情与按钮 Demo 接入共享禁用主题工具；已核对源码，明暗主题下发送中/恢复、透明按钮和普通禁用按钮仍待端侧验证。
