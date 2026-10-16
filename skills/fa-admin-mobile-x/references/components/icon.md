# FaIcon 图标

分类：共享组件。实现：`features/fa-ui-mobile/components/fa-icon.uvue`；语义映射：`features/fa-ui-mobile/common/icons.uts`；示例：`features/fa-demo-mobile/pages/basic/icons/index.uvue`。

## 最小用法

以下别名导入适用于 Feature 内 `.uvue` 页面；消费者在 `feature.json.dependsOn` 声明 `fa-ui-mobile`：

```vue
<script setup lang="uts">
import FaIcon from '@/features/fa-ui-mobile/components/fa-icon.uvue'
</script>

<template>
  <fa-icon name="home" :size="24" color="#1677ff" />
</template>
```

组件依赖工程中的 `uni_modules/uni-icons`（当前 2.0.13），通过现有组件自动发现机制引用；UI Feature 不依赖 core/base/业务模块。组件包装现有 `uni-icons`，业务使用框架语义名称，不直接把上游图标名称当成 `name`。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 含义 |
| --- | --- | --- | --- | --- |
| `name` | `string` | 是 | 无 | `faIconCatalog` 中的语义名称 |
| `size` | `number` | 否 | `20` | 传给 `uni-icons` 的图标尺寸，demo 按 px 展示 |
| `color` | `string` | 否 | `'#667085'` | 传给 `uni-icons` 的颜色 |

无自定义事件或插槽。当前 `name` prop 类型是 `string`，未用 `FaIconName` 限制模板传值。

## 名称与回退

当前目录包含 `search`、`bell`、`chevron-right`、`arrow-right`、`close`、`messages`、`security`、`appearance`、`about`、`logout`、`home`、`contacts`、`mine`、`grid`、`lightning`、`clock`、`file`、`organization`、`question`。

`resolveFaIconType(name)` 在 `faIconCatalog` 查找名称，找不到时返回上游 `help` 图标。名称与实际图案不一定同名，例如 `bell` 映射为 `notification`、`grid` 映射为 `bars`；以映射源码为准。

附件卡片使用 `download`（下载）、`check`（已缓存）、`retry`（失败重试）表达文件状态，demo 自动从图标目录展示。

新增语义图标时同步维护 `FaIconName` 和 `faIconCatalog`，核对所用上游 `type` 是否在当前 `uni-icons` 中存在；demo 遍历目录，会显示新增项。

## 主题与限制

组件不会自动读取主题，调用方根据 [主题状态](../theme.md) 传入颜色。当前封装没有自定义 SVG、图标集合加载或点击业务逻辑；触摸操作放在页面的可点击容器上使用 `@tap`。

## 验证

2026-10-17 UI01B：FaIcon 与纯语义映射迁入 UI Feature，旧 core 组件/工具路径不再提供实现。`pnpm check --group core --name check-fa-icon.mjs` 已通过，覆盖 32 个映射、上游字形、参数默认值和名称更新/回退；Demo 增加明暗预览及未知名称示例。HBuilderV 配套 SDK CLI `5.31.2026100911-alpha` Android 资源编译及导出通过，完整日志无 warning/error。用户确认本批人工验证通过，UI01B 状态为 ✅已完成，未单独注明验收平台；本次自动化未构建 APK、未运行设备、未编译 iOS。

已核对参数默认值、名称映射、未知名称回退和 demo 调用。未执行 HBuilderX 编译或端侧字体图案、尺寸、主题验证；不承诺所有目标平台已验证。

聊天标题栏使用语义图标 `chevron-left`（返回，对应 `left`）和 `more`（更多，对应 `more-filled`）；已加入共享目录，图标 demo 会自动展示。

聊天工具栏与功能宫格使用 `voice`、`add`、`album`、`camera`、`location`、`microphone`、`favorite`、`music`，统一通过 `FaIcon` 渲染；相关原生图标映射已加入目录和自动展示的 demo。
