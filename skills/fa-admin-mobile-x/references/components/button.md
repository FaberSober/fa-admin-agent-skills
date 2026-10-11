# 按钮使用约定

分类：共享组件与原生组件使用约定。共享组件：`features/fa-core-mobile/components/fa-button.uvue`，示例为请求 Loading 与下拉刷新 Demo。公共样式：`features/fa-core-mobile/styles/buttons.css`。已有原生按钮可继续使用 `fa-button` 基础类及共享工具。

## 统一 FaButton

新增普通操作按钮优先使用 `FaButton`，组件内部保留原生 `<button>`，导入公共样式并通过内联样式处理主题和禁用颜色。页面只负责外层布局和业务状态。

```vue
<fa-button text="刷新资料" :dark="themeMode === 'dark'" :disabled="busy" @press="refreshProfile" />
<fa-button text="提交中…" :dark="themeMode === 'dark'" :loading="saving" @press="saveProfile" />
```

```uts
import FaButton from '@/features/fa-core-mobile/components/fa-button.uvue'
```

| 参数 | 类型 | 必填 / 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | string | 必填 | 按钮文字，无插槽 |
| `dark` | boolean | 必填 | 页面当前主题 |
| `disabled` | boolean | false | 禁用点击 |
| `loading` | boolean | false | 原生加载图标，同时禁用点击 |
| `type` | string | primary | primary / default / warn；其他值按 primary 处理 |
| `plain` | boolean | false | 启用时为透明描边按钮；禁用时使用统一禁用底色 |
| `height` | number | 88 | 单位 rpx，同步设置高度和行高 |
| `fontSize` | number | 28 | 单位 rpx |

事件 `press` 无参数，仅可操作时触发一次；组件内部使用 `@tap.stop`，调用方使用 `@press`。无插槽。宽度填满容器、圆角 14rpx；间距、横排与宽度由外层 `<view>` 控制，避免依赖组件样式透传。

所有类型的禁用态复用 `getButtonDisabledStyle`：暗色背景 `#1b2434`、边框 `#2b3648`、文字 `#8290a6`；亮色使用对应浅色禁用配色。主题或状态改变时自动重算，恢复后回到对应类型的配色。业务仍需保留防重复提交逻辑；特殊表情、图标按钮继续使用下方原生按钮约定。

验证：`node scripts/check-fa-button.mjs` 检查主题切换、禁用与恢复、loading 防重复点击、单次事件和尺寸。2026-10-11 已通过该检查、请求 Loading Demo 检查及原生按钮检查；未执行本次 Android/iOS 原生编译或真机验证。

## 最小用法

无需自定义组件导入；以下为模板片段，`recordTap` 由页面定义：

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
| `@tap` | 记录最近点击的标签 |

无自定义接口；此表只记录项目示例，不是原生按钮完整 API 或默认值说明。

## 样式与限制

所有原生按钮必须显式设置 `hover-class="fa-button-hover"` 并包含静态 `class="fa-button"`，业务类追加在其后。公共类统一 `box-sizing: border-box`、高度与行高 `88rpx`、上下内边距 `0`、外边距 `0`、文字水平居中和字号 `28rpx`。原生默认纵向内边距与页面自定义高度、行高叠加可能使文字偏下，因此不能只修改 `height` 和 `line-height`。

页面局部类负责颜色、圆角、宽度、布局及按钮间距；需要不同高度时，同时设置匹配的 `height` 和 `line-height`，允许为边框保留最多 2 个同单位差值，不再增加上下内边距。示例的 `demo-button` 和主题修饰类只在当前页面生效，页面使用 [主题工具](../theme.md) 在显示时读取主题。原生禁用态会覆盖仅由 class 设置的颜色，统一通过下面的共享工具绑定 `:style`；加载图标使用 `loading-class` 独立设置。

### 按下态与主题

原生默认 `button-hover` 会引入浅色背景，在暗色主题的透明表情按钮上尤其明显。公共 `fa-button-hover` 仅将 `opacity` 降至 `0.7`，保留按钮的背景、边框和文字色；全应用原生按钮显式绑定此类，避免默认高亮覆盖主题。禁用态仍由 `disabled` 与禁用样式处理。透明按钮的内联 `opacity` 可能覆盖这个反馈，表情这类小按钮应使用下面的显式触摸状态方案。页面需要特殊按下反馈时使用明确的自定义 `hover-class`，并自行适配明暗主题。

透明按钮需要明显按下反馈时使用 `getTransparentButtonStyle(dark: boolean, disabled: boolean, pressed: boolean): UTSJSONObject` 绑定内联样式，并设置 `hover-class="none"`。函数同时管理透明常态、主题按下底色与禁用不透明度。按钮自己的 `touchstart` 设置按下状态，`touchmove/touchend/touchcancel` 清除；不阻止滚动容器接管滑动。关闭面板、离开页面时清除状态。不要依赖外层容器 hover 接收内层原生按钮的触摸，也不要将公共 hover 与内联不透明度叠加。最近和全部表情使用不同状态键，按下仅高亮实际触摸的按钮。

### 禁用态与主题

共享工具 `features/fa-core-mobile/common/button.uts` 导出 `getButtonDisabledStyle(dark: boolean, disabled: boolean, transparent: boolean = false): UTSJSONObject`，绑定到按钮的 `:style`。普通按钮禁用时返回对应主题的背景、边框及文字色，启用时返回空对象；透明按钮始终返回透明背景/边框，并以 `opacity` 区分禁用和启用，避免原生禁用态出现白底。

```uts
import { getButtonDisabledStyle } from '@/features/fa-core-mobile/common/button.uts'
const disabledStyle = computed((): UTSJSONObject => getButtonDisabledStyle(dark.value, sending.value))
const emojiStyle = computed((): UTSJSONObject => getButtonDisabledStyle(dark.value, sending.value, true))
```

业务自定义颜色可以在自己的计算样式中合并或覆写；仍须保留 `:disabled` 与业务防重复提交。不要使用属性选择器修复禁用态，uni-app X 不支持该选择器。本工具不替代页面读取和响应主题。

原生按钮只能直接包含文字或文字插值，不能嵌套 `<text>`、图标、`<view>` 或插槽内容。使用 `@tap`；按钮外需要扩大触摸范围时沿用仓库的外层 `<view>` 方案。公共样式不接管业务请求、权限或防重复提交。

示例不提交请求，也没有业务防重复提交逻辑。复用时保留业务自己的提交状态和错误处理，不把显示 loading 当成请求已完成的依据。

## 验证

运行 `node scripts/check-buttons.mjs`，检查 `features/` 下所有原生按钮是否使用公共类、是否重复声明 class 或包含嵌套元素、是否重新加入纵向内边距及是否同时设置自定义高度和行高。该检查不代表文字已在设备上居中。

本次公共样式已接入基础业务与 Demo 的 49 个原生按钮，静态检查及 HBuilderX 5.26 Android/iOS Vapor 资源编译通过；端侧文字居中、点击、禁用、加载及亮暗主题仍需真机验收。

2026-10-10：聊天表情与按钮 Demo 接入共享禁用主题工具；已核对源码，明暗主题下发送中/恢复、透明按钮和普通禁用按钮仍待端侧验证。
