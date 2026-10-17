# 页面与会话作用域

分类：共享工具使用约定。实现：`features/fa-base-mobile/common/page-session-scope.uts`；试点：资料编辑页。

## 最小调用

```ts
import { PageSessionScope } from '@/features/fa-base-mobile/common/page-session-scope.uts'

const scope = new PageSessionScope()
// 页面卸载才销毁，隐藏不销毁。
onUnload(() => scope.dispose())
```

在业务异步操作入口检查 `scope.isActive()` 及业务 busy，随后调用 `const current = scope.capture()`；异步返回、错误展示和 finally 状态恢复前都调用 `current()`。图片选择的原生 success/fail 回调使用同一捕获判断，通过后再开始独立的上传操作。

## 接口与边界

| 接口 | 行为 |
| --- | --- |
| `isActive(): boolean` | 页面未销毁且记录的会话版本仍有效 |
| `capture(): () => boolean` | 为本次操作捕获会话版本和批次；新 capture 会使此前捕获失效，适合串行、互斥操作 |
| `refresh(): boolean` | 接纳新的会话版本并作废旧捕获；版本未变化或已销毁返回 false |
| `dispose(): void` | 永久销毁作用域，使所有捕获失效 |

- 调用方在页面再次显示时执行 refresh；返回 true 时先清空旧草稿、用户数据、错误和忙碌状态，再加载新会话。相同会话返回不重置草稿，不重复加载。
- 每个任务在自己的闭包内保留 current，不读取可被后来任务覆盖的共享“当前任务”。工具不自动重置业务状态，不撤销请求或任务内部已发生的副作用。
- 并行且互不相干的业务任务应使用不同作用域，不能共用此串行批次能力。该工具不替代请求层的登录/租户校验，不建立缓存。
- 用户资料缓存更新可能改变会话版本；资料加载成功后先结束本次 loading，再接纳 saveUser 后的会话版本。页面仍负责业务数据写入。
- 工具不创建、激活或释放 Loading owner；页面创建 owner、FaPageFrame 管理其显示及销毁的职责保持原样。页面隐藏和系统选图不视为卸载。

## 验证

`check-profile.mjs` 执行真实 UTS 逻辑及资料页面，覆盖旧加载/保存/上传的成功和失败、旧选图回调、新会话重新加载、旧 finally 不覆盖新任务，以及同会话再次显示保留任务。2026-10-17 用户确认 BC03 验证通过。开发环境未执行 UTS 编译；用户验收平台和编译版本未记录，详见关联 BC03 计划记录。
