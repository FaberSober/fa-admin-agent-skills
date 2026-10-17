# FaSortList / FaSortGrid 拖动排序

分类：共享组件。实现：`features/fa-ui-mobile/components/fa-sort-list.uvue`、`fa-sort-grid.uvue`；Demo：`features/fa-demo-mobile/pages/basic/sort-list/index.uvue`、`sort-grid/index.uvue`。基于原 MobileSortList / MobileSortGrid 迁移并更名，旧 base 组件路径不再提供实现。

## 最小用法

适用于 Feature 内 `.uvue` 页面；消费者在 `feature.json.dependsOn` 声明 `fa-ui-mobile`。

```vue
<template>
 <fa-sort-list :list="items" row-key="id" :handle="true" :dark="dark" @sort-end="saveOrder">
  <template #item="{ item }"><text>{{ item.title }}</text></template>
 </fa-sort-list>
</template>
<script setup lang="uts">
 import { ref } from 'vue'
 import FaSortList from '@/features/fa-ui-mobile/components/fa-sort-list.uvue'
 const dark = ref(false)
 const items = ref<UTSJSONObject[]>([{ id: 'a', title: '第一项' }, { id: 'b', title: '第二项' }])
 function saveOrder(list: UTSJSONObject[], oldIndex: number, newIndex: number): void {
  items.value = list
 }
</script>
```

网格导入 `FaSortGrid from '@/features/fa-ui-mobile/components/fa-sort-grid.uvue'`，模板使用 `<fa-sort-grid>`，同样由 `item` 插槽提供内容；`sort-end` 回调仅接收列表，不接收旧/新下标。完整卡片及浮层示例见网格 Demo。

## 接口

| 参数 | 类型 | 必填 / 默认值 | 适用组件 |
| --- | --- | --- | --- |
| list | UTSJSONObject[] | 必填 | 两者；调用方管理最终顺序 |
| rowKey | string | id | 两者；应提供稳定唯一键，缺失值时仅回退 index |
| itemHeight | number | 列表 112 / 网格 184 | 两者，单位 rpx，固定条目高度 |
| dark | boolean | false | 两者，显式主题；插槽内容自行绑定主题 |
| handle | boolean | false | 仅列表；true 从手柄拖动，false 从整行拖动 |
| columns | number | 3 | 仅网格；向下取整并至少为 1 |
| gap | number | 16 | 仅网格；间距 rpx，计算时至少为 0 |

- FaSortList：`sort-end(list: UTSJSONObject[], oldIndex: number, newIndex: number)`，下标从 0 开始。
- FaSortGrid：`sort-end(list: UTSJSONObject[])`。保持原有不同签名，不做统一转换。
- 仅在顺序变化后结束拖动时派发一次事件；过程中不提交，也不原地修改传入数组。业务接收结果后更新 list，自行保存及处理失败。

| 插槽 | 作用域参数 | 说明 |
| --- | --- | --- |
| item | 列表：item、index、dragging；网格另有 ghost | 普通条目与固定定位浮层复用同一插槽 |
| handle | item、index | 仅列表；默认提供拖动点阵，ghost 中也会渲染 |
| empty | 无 | 两者；默认显示“暂无数据” |

## 行为与边界

- 空列表与单条数据不启动拖动。触摸取消恢复拖动前顺序，不提交事件；外部 list 更新优先，取消未完成排序并使用最新数据。
- 测量带版本校验；取消、完成、外部更新及新测量会使旧测量失效，迟到回调不能激活另一次拖动的浮层。页面隐藏或卸载会取消未完成拖动，不提交事件。
- 网格外壳只管理定位与占位；卡片内容沿用共享 CSS 或调用方组件，不叠加另一层卡片轮廓。组件内部导入 UI 卡片 CSS，保留已有插槽样式隔离处理。
- 列表的浮层、条目占位和手柄配色由组件维护；网格的 dark 参数保留既有接口，条目和空态文字仍需调用方提供主题样式。组件不读取业务主题存储。
- 现有 Demo 页面保留 `disableScroll`，内嵌 scroll-view 负责内容滚动并关闭回弹；手势期间阻止默认事件，实际滚动与拖动协调仍需验收。嵌套滚动、自动滚动、变高条目、跨容器拖放和虚拟列表未在本批实现，不据 Demo 推断已支持。
- 没有长按启动、禁用项或排序持久化接口；触摸开始即进入拖动态。此类能力有实际需求时单独设计。

## 验证

2026-10-17 UI03：`pnpm check --group core --name check-sort-components.mjs` 执行真实 UTS 脚本，验证首尾与网格跨行重排、单次事件及不同签名、取消、外部更新、空/单条、迟到测量及离开清理；定向卡片/按钮检查和页面生成通过。HBuilderV 配套 SDK CLI `5.31.2026100911-alpha` Android 资源编译及导出通过，完整日志未发现 warning/error。用户确认本批人工验证通过，UI03 状态为 ✅已完成，未单独注明验收平台；本次自动化未构建 APK、未运行设备、未编译 iOS。
