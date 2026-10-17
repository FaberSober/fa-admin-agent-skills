# 页面异步操作

分类：共享工具使用约定。实现：`features/fa-core-mobile/common/action.uts`；试点：重置密码页。

## 最小调用

```ts
import { useFaAction } from '@/features/fa-core-mobile/common/action.uts'

const action = useFaAction('保存失败')
// 在页面事件内执行；task 只处理异步工作，成功副作用在结果确认后执行。
const result = await action.run(async (): Promise<void> => {
  await save()
}, (): boolean => current())
if (result != 'success') return
```

`save`、`current` 为业务回调示意。真实调用见密码页，结合 Loading owner 和每次提交捕获的会话版本判断有效性。

## 契约与限制

- 返回响应式 `pending`、字符串 `error` 和 `run(task, isCurrent)`；`run` 返回 `Promise<FaActionResult>`。
- `success`：任务完成且仍有效；`failed`：有效任务抛错，error 使用非空 Error.message 或初始化的默认文案；`skipped`：已有任务进行中，不清空错误、不执行任务；`invalidated`：开始前或结束后已失效，不展示该任务错误。
- 接受执行时清空旧错误，finally 恢复 pending；同一实例串行执行，不提供取消或抢占。任务结束后可在新会话中重新执行，旧任务不会与新任务的 finally 交错。
- isCurrent 必须为同步、无副作用且不抛错的判断。task 内提前写入业务数据或调用导航不会被工具撤销；这些副作用必须自行检查有效性。
- 工具不持有会话、不注册生命周期、不登记 Loading、不弹出 Toast，不保留原始异常。需要原始异常的调用方暂不采用此接口。
- 密码页在成功结果及页面/会话复查后，才清理会话、提示并跳转；主动清理会话后不再检查旧会话版本，保证正常退出流程完成。

## 验证

定向 Node 检查：`check-action.mjs`、`check-password-form.mjs`。覆盖四种结果、重复提交、失败恢复及重试、页面/会话失效和两种退出路由；不调用真实密码接口。

2026-10-17 用户确认 BC02 验证通过。开发环境未执行 UTS 编译；用户验收平台和编译版本未记录，详见关联 BC02 计划记录。
