# FaField 输入项

分类：共享组件。实现：`features/fa-ui-mobile/components/fa-field.uvue`；Demo：`features/fa-demo-mobile/pages/basic/field/index.uvue`。试点页面：`features/fa-base-mobile/pages/mine/password/index.uvue`，密码校验和 API 提交仍在业务层。

## 最小用法

适用于 Feature 内 `.uvue` 页面；消费者在 `feature.json.dependsOn` 声明 `fa-ui-mobile`。

```vue
<template>
 <fa-field v-model="password" label="当前密码" placeholder="请输入当前密码" :password="true" :dark="dark" :disabled="saving" :error="error" />
</template>
<script setup lang="uts">
 import { ref } from 'vue'
 import FaField from '@/features/fa-ui-mobile/components/fa-field.uvue'
 const password = ref('')
 const dark = ref(false)
 const saving = ref(false)
 const error = ref('')
</script>
```

## 接口

| 参数 | 类型 | 必填 / 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | string | 空字符串 | 用 `v-model` 双向绑定，不 trim 或转数字 |
| label | string | 空字符串 | 上方标签；空时不占位 |
| placeholder | string | 空字符串 | 原生占位文字，随主题设置颜色 |
| type | string | text | 透传原生输入类型，不校验输入内容 |
| password | boolean | false | 透传原生密码模式；通常与 type=text 搭配 |
| maxlength | number | 140 | 透传原生长度限制；-1 不限制，不裁剪程序传入值 |
| disabled | boolean | false | 禁用输入和确认事件，降低整体透明度 |
| focus | boolean | false | 原生焦点请求；禁用时传入 false |
| confirmType | string | done | 原生键盘确认键类型，受目标端支持范围限制 |
| error | string | 空字符串 | 错误边框与下方提示；空时不占位 |
| dark | boolean | false | 显式主题，不读取存储 |

| 事件 | 参数 | 行为 |
| --- | --- | --- |
| update:modelValue | value: string | 原生 input/confirm 时先同步最终值 |
| input | value: string | 每次原生 input 后派发一次 |
| confirm | value: string | 同步最终值后派发一次，业务可提交表单 |
| focus | 无 | 原生获取焦点后派发；更新组件焦点边框 |
| blur | 无 | 原生失焦后派发；即使已禁用，也允许通知上层复位 |

无插槽。组件由标签、原生 input 和错误文字组成，不提供动态表单、校验规则、清除按钮或密码显隐切换。

## 行为与边界

- 高度 84rpx、字号 27rpx，标签/错误 24rpx；页面间距放外层容器。明暗、焦点和错误边框由组件管理，错误优先于焦点。
- modelValue 由调用方管理；程序赋值直接更新原生 value，不派发用户 input/confirm。maxlength 由原生处理，不在脚本中截取字符串，避免破坏输入法组合和密码原值。
- 禁用时拦截迟到的 input/confirm/focus，仍转发 blur；组件不提交请求，不记录或存储输入值。
- focus 是请求值，调用方需在 `@focus` / `@blur` 同步自身状态，例如 `@blur="focused = false"`；再次聚焦需重新由 false 设为 true。不自动切换到下一个输入项。
- 输入框具有原生键盘和焦点行为；点击外部按钮、禁用切换、滚动避让、密码掩码与输入法组合需目标端验证，不以脚本测试代替。
- 重置密码页将必填、相同密码和确认不一致展示在对应输入项下；服务端失败保留表单级提示。提交中禁用三项输入，按钮与确认键共用防重复提交逻辑，成功后的会话清理和登录路由沿用业务实现。

## 验证

2026-10-17 UI04：`pnpm check --group core --name check-field.mjs` 检查实际组件脚本；`pnpm check --group base --name check-password-form.mjs` 使用模拟 API 检查密码校验、原值提交、防重复、失败恢复及成功路由。页面生成、卡片与原生按钮检查通过；HBuilderV 配套 SDK CLI `5.31.2026100911-alpha` Android 资源编译及导出通过，完整日志未发现 warning/error。用户确认本批人工验证通过，UI04 状态为 ✅已完成，未单独注明验收平台；本次自动化未构建 APK、未运行设备、未编译 iOS。
