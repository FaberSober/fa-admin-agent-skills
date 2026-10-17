# 业务页面辅助目录

分类：开发规范与共享工具目录。记录 BC01—BC07 已实现能力，按需组合，不要求所有页面使用同一模板。源码路径相对 mobile-x 根目录，完整用例使用已交付业务页面。

## 场景与最小调用

| 场景 | 工具 / 实现 | 最小调用 | 限制与真实用例 |
| --- | --- | --- | --- |
| 初始化及返回刷新主题 | `useFaPageTheme`；`features/fa-core-mobile/common/page-theme.uts` | `const { dark } = useFaPageTheme()` | setup 调用一次；false 关闭原生导航栏及底色同步，不查询业务数据。账号与安全页；见 [主题](theme.md) |
| 串行提交与错误恢复 | `useFaAction`；`features/fa-core-mobile/common/action.uts` | 创建 `useFaAction('失败文案')` 后 `await action.run(task, current)` | 区分 success/failed/skipped/invalidated，不提示、不登记 Loading。重置密码页；见 [异步操作](page-action.md) |
| 页面、会话及任务批次隔离 | `PageSessionScope`；`features/fa-base-mobile/common/page-session-scope.uts` | 创建实例后 `const current = scope.capture()` | capture 作废旧捕获；await 后和 finally 前检查 current，隐藏不销毁，卸载 dispose。资料编辑页；见 [作用域](page-session-scope.md) |
| 查询状态与并发合并 | `useFaPageData`；`features/fa-base-mobile/common/page-data.uts` | 创建实例后 `await data.load(options, action)` | action 接收 group/current；沿用 PageDataState、Loading 和缓存，错误写入 ref、不抛出，await 返回不代表业务成功。账号资料页；见 [加载辅助](page-data-loading.md) |
| 必填、可选邮箱校验 | `requiredTextError` / `optionalEmailError`；`features/fa-base-mobile/common/form.uts` | `requiredTextError(value, '请输入姓名')` | 返回业务文案或空串，只读取 trim 后的值，不修改草稿或替代后端校验。资料编辑页；见 [表单辅助](forms.md) |
| 资料草稿初始化、重置 | `useProfileForm`；`features/fa-base-mobile/common/profile-form.uts` | 创建实例后 `form.reset(user)` / `form.reset(null)` | 实例独立，缺失项清空，同时清空头像预览；失败和普通返回不自动重置。资料编辑页；见 [表单辅助](forms.md) |
| 退出后的账号入口 | `getAccountEntry`；`features/fa-base-mobile/common/account-entry.uts` | `const entry = getAccountEntry()` | clearSession 后读取剩余账号；保留过期账号仍去账号选择页，不提示、不导航。首页退出和密码修改；见 [入口决策](account-entry.md) |
| 简单设置条目 | 页面本地 MineSetting / SecurityEntry 配置 | `v-for` 渲染 FaCell，`@press` 执行动作 | 页面负责路由或页签动作，Feature 扩展入口保留原事件。首页“我的”、账号与安全；见 [设置列表](components/cell.md) |

## 组合与推广边界

- core 辅助只依赖 core 与平台/Vue；base 辅助组合 base/core，不反向引用 UI 或具体业务模块。UI 只接收显式状态。
- 保留请求层鉴权及上下文保护；业务写入、错误、提示和导航仍按契约检查有效性，辅助无法撤销回调内提前发生的副作用。
- 页面创建 Loading owner，FaPageFrame 管理显示及销毁；辅助不重复创建或释放 owner。useFaAction 不登记 Loading，useFaPageData 委托 PageDataState 组合 Loading。
- 只复用查询缓存；草稿、上传、密码修改、登录及一次性票据不缓存。密码跨字段规则、倒计时和权限保留在业务层。
- PageSessionScope 用于串行任务，并行独立任务使用不同作用域。查询参数变化先 invalidate；卸载 dispose。
- 先确认真实重复，再以一个可独立验收的流程推广，不批量强制迁移历史页面。

## 定向检查

在 mobile-x 执行 `node scripts/test/run-tests.mjs --kind checks --group <分组> --name <文件>`，按改动选取：

| 分组 | 文件 | 覆盖 |
| --- | --- | --- |
| core | `check-theme.mjs`、`check-action.mjs` | 主题生命周期、提交四种结果及恢复 |
| base | `check-profile.mjs` | 真实资料页面、头像、草稿、会话与旧 finally 隔离 |
| base | `check-page-data.mjs`、`check-page-data-state.mjs` | 合并、空结果、失败重试、保留数据、失效与销毁 |
| base | `check-profile-form.mjs` | 校验、实例隔离、初始化和重置 |
| base | `check-password-form.mjs`、`check-logout.mjs`、`check-multi-account.mjs` | 两种去向、提示、清理顺序、超时及旧任务隔离 |
| base / core | `check-home-page-data.mjs` / `check-cells.mjs` | 设置顺序、路由、页签、扩展入口及点击契约 |
| base | `check-business-reuse.mjs` | 七个辅助模块的导入路径、直接依赖方向和文档链接 |

检查器负例：`node scripts/test/run-tests.mjs --kind unit --group base --name business-reuse.test.mjs`。目录检查只覆盖已交付辅助的直接导入，不是全仓库依赖图或 UTS 编译器，也不强制代码片段。

BC01—BC07 已由用户逐批确认验证通过，具体平台及编译版本未记录。Node 检查不替代新增运行改动的目标端编译及设备验收；本目录与依赖检查不改运行代码，无需新增原生交互验收。

## 实测代码量

按各实施提交与父提交比较，仅统计该批指定业务页面的 template/script/style 内行数变化，含空行；排除其他提交中的 UI 迁移、自动导入和按钮改动，排除测试、文档及生成文件。

| 批次 / 提交 | 页面模板 | 页面脚本 | 页面样式 | 新增公共 UTS |
| --- | --- | --- | --- | --- |
| BC01 / a63d56ca | 0 | -7 | 0 | 19 |
| BC02 / e7ec8624 | 0 | +3 | 0 | 28 |
| BC03 / 6abb3761 | 0 | +10 | 0 | 34 |
| BC04 / f494c19a | 0 | -6 | 0 | 60 |
| BC05 / 552df055 | 0 | -13 | 0 | 32 |
| BC06 / 3a69c000 | -21 | +8 | -6 | 0 |
| BC07 / 023b0203 | 0 | -2 | 0 | 12 |
| 合计 | -21 | -7 | -6 | 185 |

页面减少 34 行，加上公共辅助，运行代码净增 151 行。本轮收益是职责集中和隔离行为补齐，尚未取得整体代码压缩；退出决策有两个实际调用方，其他工具以单页试点为主，不预设后续推广的节省比例。

## BC09 评估

继续保留“未来按需”：现有试点包含查询、写操作、原生选图和设置动作，契约不同，尚无多个新增模块验证过的统一页面骨架。当前不增加模板生成器；出现重复建页需求后再评估参数、目录与路由登记，沿用现有 Feature 页面生成器。
