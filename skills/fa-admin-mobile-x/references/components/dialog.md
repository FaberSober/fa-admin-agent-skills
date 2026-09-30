# 弹窗实现示例

分类：页面实现示例。实现与示例：`features/fa-demo-mobile/pages/basic/dialog/index.uvue`。当前是页面内遮罩及卡片布局，没有可导入的 `FaDialog` 或共享 `openDialog` API。

## 用法与复用边界

以下为示例页面的模板和脚本片段，完整遮罩、按钮、主题类和样式需参考原页面：

```vue
<button @tap="openDialog('confirm')">打开确认弹窗</button>
<button @tap="openDialog('danger')">打开危险弹窗</button>
```

```ts
const dialogMode = ref('')
function openDialog(mode: string): void {
  dialogMode.value = mode
}
```

`ref` 从 `vue` 导入。`dialogMode.length > 0` 时显示遮罩；取消和确认分别调用 `finishDialog(false)`、`finishDialog(true)`。这些函数和状态仅属于示例页面，不提供组件 props、事件或插槽。

## 行为

- `confirm` 展示普通确认；`danger` 展示危险提示和红色确认按钮。
- `finishDialog` 更新页面的最近操作文本，然后将 `dialogMode` 设为空字符串关闭弹窗。
- 遮罩使用固定定位覆盖页面，卡片居中；亮暗模式来自页面状态，见 [主题约定](../theme.md)。

## 限制

示例只记录选择结果，不修改实际数据；业务接入时需要实现确认动作、请求状态和失败处理。当前没有遮罩点击关闭、系统返回键关闭、弹窗队列或异步等待结果的封装，不在文档中承诺这些能力。demo 的局部布局和样式可作为实现参考，不能直接调用一个不存在的共享弹窗接口。

## 验证

已核对示例的打开、确认、取消及关闭状态流。未执行 HBuilderX 编译或端侧遮罩布局、亮暗主题和交互验证；系统返回行为也未验证。
