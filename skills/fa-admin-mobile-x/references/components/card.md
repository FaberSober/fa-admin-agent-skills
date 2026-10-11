# 卡片样式约定

分类：共享样式使用约定。唯一维护源：`features/fa-core-mobile/styles/cards.css`，由 `App.uvue` 全局导入。独立示例：`features/fa-demo-mobile/pages/basic/card/index.uvue`，入口为“移动端 Demo → 基础组件 → 统一卡片”。可预览明暗主题、普通/选中卡片与嵌套列表，预览不修改持久化主题。

## 最小用法

```vue
<view class="fa-card business-card">
  <view class="fa-card-surface" :class="dark ? 'fa-card-surface--dark' : ''">
    <view class="fa-card-fill" :class="dark ? 'fa-card-fill--dark' : ''" />
  </view>
  <text>卡片内容</text>
</view>
```

- `dark` 由调用页面的现有主题状态提供；没有自定义组件接口。
- 自定义组件需要在自己的 `<style>` 中通过 `@import '@/features/fa-core-mobile/styles/cards.css';` 引用同一维护源，确保组件样式隔离时背景层仍有样式；不要复制卡片颜色和圆角定义。`fa-app-dialog.uvue` 沿用此方式。
- `business-card` 只负责宽高、间距、内边距及内容布局；宿主必须保留 `fa-card`，不能覆盖背景、边框、圆角或添加 `overflow: hidden`。
- 背景层必须作为第一个子节点。它绝对定位且不响应触摸，不参与内容布局；后续内容保持在其上方，点击事件仍绑定宿主。
- 边框层使用边框色背景，不叠加原生 `border`；填充层绝对定位，四边显式内缩 `1rpx`，不依赖 flex 自动计算内部尺寸。这样填充轮廓始终在外层内部，不覆盖边框。
- `.fa-card-surface, .fa-card-fill` 共用唯一的 `border-radius: 20rpx` 声明。统一改圆角只修改这一处；填充层采用同一圆角并内缩，拐角边框可略宽于直边，避免填充越界。边框间距通过填充层四边 inset 调整，不能只改其中一边。
- 亮色为白色背景及浅灰边框，暗色为 `#151d2b` 背景及 `#273347` 边框；主题值集中在共享 CSS，页面不要重复定义。
- 当前账户等选中状态同时给边框层增加 `fa-card-surface--active`、填充层增加 `fa-card-fill--active`，边框间距从 `1rpx` 加粗至 `3rpx`，不改变背景或布局。暗色选中时额外给边框层增加 `fa-card-surface--active-dark`，使用更亮的 `#78aaff`；亮色选中使用 `#1677ff`。颜色和粗细统一在公共 CSS 维护，使用完整示例见统一卡片 Demo。
- 此约定用于普通内容、列表、入口和确认卡片。按钮、头像、标签、输入框及有意展示特殊颜色的控件保留各自样式，不按卡片规则批量替换。
- 网格拖动 Demo 的 `item` 插槽也使用同一卡片结构；普通条目和 ghost 共用插槽，拖动时绑定统一 active 边框。排序组件外壳只管理尺寸、定位和占位透明度，不另画边框或背景，避免出现双层轮廓。组件内导入共享卡片 CSS，覆盖插槽渲染边界。

## 验证

2026-10-11：新增统一卡片 Demo，并将 Demo 普通内容卡片与诊断页卡片接入共享结构。`node scripts/check-cards.mjs` 已通过，覆盖 93 个共享卡片宿主、填充轮廓包含关系、基础样式集中维护、背景层结构、组件内导入和路由。此次方案未执行原生编译或真机验收，状态为 🔍验证中；此前方案的验收不代表此次方案已验证。实施计划位于框架仓库 `docs/plans/PLAN-mobile-x-011-unified-card-style-1011.md`。

已核对迁移页面的模板、主题绑定和样式；按钮规范及差异格式检查通过。HBuilderV 配套 5.31.2026093020-alpha SDK 的 Android/iOS 资源编译及导出通过，最终日志无 warning/error；自动化运行未返回可确认的结果。2026-10-09 用户确认统一卡片修复及登录设备功能人工验证通过。
