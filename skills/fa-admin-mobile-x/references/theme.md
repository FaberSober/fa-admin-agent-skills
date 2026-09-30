# 主题使用约定

分类：共享工具使用约定。实现：`features/fa-core-mobile/common/theme.uts`；示例：`features/fa-demo-mobile/pages/basic/icons/index.uvue`。

## 最小用法

以下片段位于 `features/<业务模块>/pages/<页面>/index.uvue`，省略页面布局和样式：

```vue
<script setup lang="uts">
import { ref } from 'vue'
import { applyThemeToNavigationBar, getThemeMode } from '../../../fa-core-mobile/common/theme.uts'
import type { ThemeMode } from '../../../fa-core-mobile/common/theme.uts'

const themeMode = ref<ThemeMode>('light')
onPageShow(() => {
  themeMode.value = getThemeMode()
  applyThemeToNavigationBar(themeMode.value)
})
</script>
```

在模板中按 `themeMode` 切换页面亮暗类；图标颜色也由调用方传入，见 [图标](components/icon.md)。

## 工具接口

| 接口 | 行为 |
| --- | --- |
| `ThemeMode` | `'light' \| 'dark'` |
| `getThemeMode(): ThemeMode` | 读取 `fa.mobile.theme-mode`；仅值为 `dark` 时返回暗色，其他值或读取异常返回亮色 |
| `saveThemeMode(mode: ThemeMode): void` | 写入本地存储；当前实现没有捕获写入异常 |
| `applyThemeToNavigationBar(mode: ThemeMode): void` | 设置导航栏背景和前景颜色 |

## 行为与限制

当前工具没有系统主题跟随、全局响应式状态或主题切换广播。保存配置不会自动更新已显示页面，调用方需要更新自己的状态；demo 在页面再次显示时重新读取。导航栏设置不会替代页面 CSS，亮暗背景、文本、边框等仍需由页面维护。

## 验证

已核对工具接口及 icons demo 的调用。未执行 HBuilderX 编译、端侧主题切换或跨平台导航栏验证；支持范围须按实际目标端确认。
