# FaCell / FaCellGroup 设置列表

分类：共享组件。实现：`features/fa-ui-mobile/components/fa-cell.uvue`、`fa-cell-group.uvue`；Demo：`features/fa-demo-mobile/pages/basic/cell/index.uvue`。真实页面：`features/fa-base-mobile/pages/mine/security/index.uvue`；业务入口 `mine-setting-entry.uvue` 保留原参数与 `open(route)` 事件，内部复用 FaCell。

## 最小用法

适用于 Feature 内 `.uvue` 页面；消费者在 `feature.json.dependsOn` 声明 `fa-ui-mobile`。

```vue
<template>
 <fa-cell-group :dark="dark">
  <fa-cell :dark="dark" title="登录设备" description="查看当前及历史登录设备" @press="openDevices" />
  <fa-cell :dark="dark" title="版本" value="1.0.0" :arrow="false" :clickable="false" :border="false" />
 </fa-cell-group>
</template>
<script setup lang="uts">
 import { ref } from 'vue'
 import FaCell from '@/features/fa-ui-mobile/components/fa-cell.uvue'
 import FaCellGroup from '@/features/fa-ui-mobile/components/fa-cell-group.uvue'
 const dark = ref(false)
 function openDevices(): void {
  // 业务层处理路由或请求。
 }
</script>
```

## 接口

FaCell 参数：

| 参数 | 类型 | 必填 / 默认值 | 说明 |
| --- | --- | --- | --- |
| title | string | 必填 | 主标题，可随内容换行 |
| description | string | 空字符串 | 标题下的说明；空时不占位 |
| value | string | 空字符串 | 右侧值；非空时与标题区域平分剩余宽度，原生端最多两行 |
| icon | string | 空字符串 | FaIcon 语义名称；空时不占位 |
| dark | boolean | false | 显式传入主题，不读取存储 |
| arrow | boolean | true | 显示右箭头，与是否可点击独立 |
| border | boolean | true | 底部分隔线；最后一行传 false |
| disabled | boolean | false | 禁用点击并降低整行透明度 |
| clickable | boolean | true | false 表示仅展示信息，不触发事件或按下反馈 |

- 事件：`press`，无参数；仅 `clickable && !disabled` 时触发一次。根节点 `@tap.stop` 阻止触发外层卡片点击。
- FaCell 无插槽；首期固定标题/说明/值/图标结构，复杂业务内容留在业务组件。
- FaCellGroup 只有 `dark?: boolean = false` 和默认插槽，无自定义事件；内部组合 FaCard，使用 `padding="none"`。

## 行为与边界

- 分组只提供统一卡片背景、边框和圆角；每行仍需显式传 `dark`，最后一行需传 `border=false`。不遍历或改写插槽节点，不提供自动主题和自动末行识别。
- 行最小高度 88rpx，左侧内缩 28rpx，上下 16rpx，标题 28rpx、描述 23rpx、值 24rpx；长标题/说明自然撑高，分隔线位于行底部。图标、文字和状态色由组件维护。
- 普通行有按下透明度反馈；禁用与信息行不响应点击。`arrow=false` 只隐藏箭头，不自动禁用点击；纯展示行应同时传 `clickable=false`。
- 路由、权限、请求、加载和持久化由业务层处理；外部容器负责分组间距。空数据时由调用方通过 `v-if` 隐藏分组或展示自己的空态；不提供输入框、键盘焦点或表单校验。
- Web/小程序不支持当前原生 `max-lines` 行为；本批不作这些平台的布局兼容承诺。

## 验证

2026-10-17 UI02：`pnpm check --group core --name check-cells.mjs`、定向卡片/按钮检查及页面生成已通过；覆盖点击拦截与恢复、主题、业务事件和路由、统一分组背景及 Demo。HBuilderV 配套 SDK CLI `5.31.2026100911-alpha` Android 资源编译及导出通过，完整日志未发现 warning/error。用户确认本批人工验证通过，UI02 状态为 ✅已完成，未单独注明验收平台；本次自动化未构建 APK、未运行设备、未编译 iOS。
