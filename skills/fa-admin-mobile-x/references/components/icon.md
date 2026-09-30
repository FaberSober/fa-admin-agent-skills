# FaIcon 图标

分类：共享组件。实现：`features/fa-core-mobile/components/fa-icon.uvue`；语义映射：`features/fa-core-mobile/common/icons.uts`；示例：`features/fa-demo-mobile/pages/basic/icons/index.uvue`。

## 最小用法

以下导入路径适用于 `features/<业务模块>/pages/<页面>/index.uvue`：

```vue
<script setup lang="uts">
import FaIcon from '../../../fa-core-mobile/components/fa-icon.uvue'
</script>

<template>
  <fa-icon name="home" :size="24" color="#1677ff" />
</template>
```

组件包装现有 `uni-icons`，业务使用框架语义名称，不直接把上游图标名称当成 `name`。

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

新增语义图标时同步维护 `FaIconName` 和 `faIconCatalog`，核对所用上游 `type` 是否在当前 `uni-icons` 中存在；demo 遍历目录，会显示新增项。

## 主题与限制

组件不会自动读取主题，调用方根据 [主题状态](../theme.md) 传入颜色。当前封装没有自定义 SVG、图标集合加载或点击业务逻辑；触摸操作放在页面的可点击容器上使用 `@tap`。

## 验证

已核对参数默认值、名称映射、未知名称回退和 demo 调用。未执行 HBuilderX 编译或端侧字体图案、尺寸、主题验证；不承诺所有目标平台已验证。
