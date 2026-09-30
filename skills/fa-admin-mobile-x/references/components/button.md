# 按钮使用约定

分类：原生组件使用约定。示例：`features/fa-demo-mobile/pages/basic/button/index.uvue`。当前示例使用 uni-app X 原生 `<button>`，没有可导入的 `FaButton` 封装。

## 最小用法

无需自定义组件导入；以下为模板片段，`recordTap` 由页面定义：

```vue
<button type="primary" @tap="recordTap('保存')">保存</button>
<button type="primary" :loading="true" :disabled="true">提交中</button>
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

示例通过页面局部 `demo-button` 类及修饰类设置主色、危险色、尺寸和禁用样式；这些类不是全局样式。暗色普通按钮、禁用按钮有独立类，页面使用 [主题工具](../theme.md) 在显示时读取主题。

示例不提交请求，也没有业务防重复提交逻辑。复用时保留业务自己的提交状态和错误处理，不把显示 loading 当成请求已完成的依据。

## 验证

已核对示例模板、点击处理和样式。未执行 HBuilderX 编译或端侧点击、禁用、亮暗主题验证；这些属性在新增目标平台上仍需编译和运行确认。
