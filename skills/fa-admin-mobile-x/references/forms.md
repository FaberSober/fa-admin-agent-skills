# 表单辅助

分类：共享工具使用约定。通用校验位于 `features/fa-base-mobile/common/form.uts`，资料草稿位于 `common/profile-form.uts`（同模块）；试点为资料编辑页。

## 最小调用

```ts
import { requiredTextError, optionalEmailError } from '@/features/fa-base-mobile/common/form.uts'
import { useProfileForm } from '@/features/fa-base-mobile/common/profile-form.uts'

const form = useProfileForm()
const { name, tel, email, avatar, avatarPreview, avatarFailed } = form
// currentUser 为页面已校验有效的 PortalUser 或 null。
form.reset(currentUser)
const error = requiredTextError(name.value, '请输入姓名') || optionalEmailError(email.value, '邮箱格式不正确')
```

## 接口与边界

| 接口 | 行为 |
| --- | --- |
| `requiredTextError(value, message): string` | trim 后为空返回业务文案，否则返回空字符串；不修改草稿 |
| `optionalEmailError(value, message): string` | trim 后为空允许通过；非空沿用原资料页邮箱规则，失败返回业务文案 |
| `useProfileForm()` | 创建独立的姓名、手机、邮箱、头像 ID、临时预览 ref，以及头像加载失败 ref |
| `reset(user: PortalUser \| null): void` | 从资料复制原值，缺失项或 null 清空；同时清空本地头像预览和图片失败标记，不持有原对象 |

- 页面在有效的缓存/接口资料加载完成时初始化，在会话变化时 reset(null)。普通页面再次显示和提交失败不重置草稿；取消仍由页面返回，重新进入创建新表单。
- 校验顺序和文案由页面决定；先校验姓名，再校验可选邮箱。邮箱规则保持既有简易格式检查，不替代服务端校验，不扩展手机号或密码规则。
- 密码跨字段比较、验证码倒计时、权限和提交快照留在业务层。调用方自行决定 trim 后提交哪些字段；工具不修改用户输入或提交请求。
- 上传、保存及页面/会话保护仍由原流程负责。头像预览路径只在表单实例中保留，不写入缓存；上传成功也要保存资料后才生效。
- 这两个工具不包含表单渲染、动态规则引擎、自动保存或重置按钮。真实调用和业务成功流程见资料编辑页。

## 验证

`check-profile-form.mjs` 覆盖必填/可选邮箱、原值初始化、实例及缓存隔离、重置与空资料清理；`check-profile.mjs` 覆盖真实页面的校验、规范化提交、保存失败保留草稿、取消及会话变化重置等。

本批定向 Node 检查通过；2026-10-17 用户确认 BC05 验证通过。开发环境未执行 UTS 编译，用户验收平台和编译版本未记录，详见 BC05 计划记录。
