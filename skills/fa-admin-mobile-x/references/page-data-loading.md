# 页面数据加载与复用

分类：开发规范与共享工具约定。适用于首页四个标签及其业务页面。共享辅助模块为 `features/fa-base-mobile/common/page-data-state.uts`，业务用例为首页、联系人目录、消息历史和账号页。

## 规则

- 初始化使用 onLoad/首次挂载；普通 onPageShow 只同步本地资料、主题和确需恢复的实时流程，不无条件刷新业务列表。
- 首页标签使用首次访问才挂载、后续 v-show 的独立滚动容器，保留组件状态与滚动位置。
- 成功空结果也视为初始化成功；首次失败允许重试。
- 主动刷新保留旧数据，成功后更新列表和页码；失败保留旧结果并说明其属于上次成功查询。
- 搜索、筛选、换部门属于明确查询动作。分页使用局部进度，不能弹整页遮罩。
- 账号/租户版本变化后禁止读取旧上下文缓存；旧响应不能写入新状态。保留现有 Request 鉴权和上下文校验。
- 编辑草稿、选人结果、确认弹窗、提交成功锁定状态属于当前页面实例，不写进共享查询缓存。

## 辅助接口

| 接口 | 行为 |
| --- | --- |
| `PageDataState.load(context, action, force = false)` | 首次查询；已初始化时复用；同实例在途调用共享 Promise；force 强制刷新；内部管理组合 Loading |
| `initialized/pending/error` | 业务状态，不直接控制全局覆盖框；刷新失败保留 initialized |
| `invalidate()` | 失效初始化状态并递增版本；调用方仍需保护自身异步结果写入 |
| `dispose()` | 停止后续加载并忽略旧操作对辅助状态的更新 |
| `PageDataCache<T>.get/set` | 有类型的模块内存缓存；get 刷新最近使用顺序；每实例上限 20 条 |
| `PageDataCache<T>.clear/forEach` | 显式清空或更新已有缓存数据；forEach 也会检查会话版本 |

缓存不会写磁盘，也没有基于时间的自动刷新。版本在访问前检查，因此会话变化时旧条目不能再被读取；模块缓存不持有页面实例。

账号资料复用 `getStoredUser/saveUser`，不把租户查询缓存当作用户资料缓存。联系人目录按模式、部门、规范化搜索词区分；消息按视图、分类、未读筛选区分，快照同时保留列表、页码与下一页状态。联系人详情按用户 ID，独立公告按公告 ID。

## 实际调用示例

以下用法来自账号页，导入路径以 `features/fa-base-mobile/pages/mine/account/index.uvue` 为准：

```ts
import { useFaPageData } from '@/features/fa-base-mobile/common/page-data.uts'
const profileData = useFaPageData('资料加载失败')
const loading = profileData.pending
const errorMessage = profileData.error

await profileData.load(loadingContext(pageOwner, 'refresh'), async (options, current) => {
 const nextUser = await getCurrentUser(options)
 if (!current()) return
 saveUser(nextUser)
 user.value = nextUser
}, true)
```

LoadingContext、getCurrentUser、saveUser 和 user 使用该页已有导入与状态。列表查询还需捕获请求版本、查询参数和 sessionRevision，提交结果前逐项检查；辅助模块不替代业务自己的写入校验。

消息阅读成功使用 `updateCachedMessageRead` 更新缓存中的已读状态并通知挂载组件；未读列表过滤已读项。无需因返回详情重新请求列表。`ensureMessageUnread` 用于首次徽标准备及同上下文复用；主动刷新和已读操作使用 `refreshMessageUnread`。

文件票据、上传、密码修改、建群、登录不缓存写操作结果；文件预览每次明确重新打开都申请新票据，保留下载权限及会话检查。

## 验证

```powershell
pnpm check --group base --name check-page-data-state.mjs
pnpm check --group base --name check-home-page-data.mjs
pnpm check --group base --name check-contacts.mjs
pnpm check --group base --name check-messages.mjs
```

检查覆盖并发首次加载、空数据、缓存容量/上下文失效、四标签重复切换请求次数、手动刷新、部门返回复用、已读及旧响应隔离。Node 检查不替代 UTS 编译或设备验收；平台与验收进度见 [实施计划](../plans/2026-09-30-page-loading-and-cache.md)。

## 响应式加载辅助（BC04）

`features/fa-base-mobile/common/page-data.uts` 提供 `useFaPageData(fallbackMessage = '加载失败')`，组合既有 PageDataState、PageSessionScope 和 Loading；不新增缓存。账号资料继续复用 getStoredUser/saveUser，编辑草稿与写操作不适用。

| 接口 | 行为 |
| --- | --- |
| `initialized/pending/error` | ref 状态，可在模板中使用；不依赖普通类字段自动响应 |
| `load(context, action, force = false)` | 委托现有状态进行初始化、并发合并和组合 Loading；action 接收 options 与 current 判断。有效异常写入 error，不向页面抛出，不发送提示；调用方不得用 await 返回当作业务成功信号 |
| `invalidate()` | 使初始化与旧回调失效，重置响应式状态；不清除业务数据，查询参数变化时由页面调用 |
| `syncSession(): boolean` | 接纳新会话并 invalidate，变化时返回 true；页面先清除旧数据，再读取新会话缓存或加载。load 内也执行此检查 |
| `isActive(): boolean` | 页面作用域仍存活且会话一致；用于读取缓存等同步操作之前的保护 |
| `dispose()` | 销毁作用域和既有状态，不释放 Loading owner；之后不执行加载 |

回调在每次 await 后、业务写入或副作用前检查 current；invalidate/dispose/会话变化后旧结果不能提交。不要在 action 中递归调用同实例 load；同实例表示同一查询，强制刷新仍合并在途任务，参数变化需先 invalidate。刷新失败保留已初始化状态和业务数据，成功空结果也标记初始化。新的批次开始后旧 finally 不会修改其响应式状态。

saveUser 或工作空间初始化可能主动递增会话版本；旧上下文的错误仍被抑制，但尚未开启新批次时会正常结束 pending，不会让按钮永久禁用。initialized 在会话已变化时保持 false，后续 syncSession 使查询失效。工具不将返回值、用户资料或临时凭据写入第二套缓存。

2026-10-17：新增 check-page-data.mjs，扩展 check-profile.mjs，并运行既有 check-page-data-state.mjs；定向检查通过。2026-10-17 用户确认 BC04 验证通过；开发环境未执行 UTS 编译，用户验收平台和编译版本未记录。