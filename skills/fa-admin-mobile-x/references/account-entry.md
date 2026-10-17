# 账号退出后的入口决策

分类：共享业务工具使用约定。实现：`features/fa-base-mobile/common/account-entry.uts`；调用方：首页退出登录、重置密码成功流程。

## 最小调用

```ts
import { getAccountEntry } from '@/features/fa-base-mobile/common/account-entry.uts'

// 调用方先按既有流程确认操作有效并清理当前会话。
const entry = getAccountEntry()
uni.reLaunch({ url: entry.url })
```

## 契约与边界

- `getAccountEntry(): AccountEntry` 每次调用读取 getSavedAccounts，返回同一次决策的 `hasAccounts: boolean` 和 `url: string`；不缓存账号列表或决策。
- 本机仍有保存账号（包含需要重新认证的账号）时进入 `/features/fa-base-mobile/pages/mine/accounts/index`，没有时进入 `/features/fa-base-mobile/pages/login/index`。
- 工具只确定去向，不执行会话清理、提示或导航，不携带 Token、账号标识或其他查询参数。不改变 session 原有账号数据迁移/恢复逻辑；读取错误交给调用方处理。
- 修改密码页在确认成功及上下文有效后 clearSession，再读取决策，并用 hasAccounts 选择原提示文案；主动清理会话后不再用旧版本阻止导航。
- 首页保留解绑推送、服务端退出、超时兜底和 authRevision 检查，完成本地清理后再读取去向；旧退出流程不能清理新登录账号。
- 本批只迁移这两个退出调用方；启动恢复、请求鉴权失败、设备吊销和添加账号的业务语义继续沿用原流程，不因路由相似自动统一。

## 验证

定向 `check-password-form.mjs`、`check-logout.mjs` 执行真实共享工具与页面流程，覆盖两种路由、密码提示、失败重试、先清理后决策、重复点击、离线/超时及旧任务隔离。`check-multi-account.mjs` 使用真实 session 验证空列表、单账号退出、保留过期账号和决策实时读取。

2026-10-17 用户确认 BC07 验证通过。开发环境未执行本批 UTS 编译，用户验收平台和编译版本未记录，详见 BC07 计划记录。
