# 主题使用约定

分类：共享工具使用约定。实现：`features/fa-core-mobile/common/theme.uts`；示例：`features/fa-demo-mobile/pages/basic/icons/index.uvue`。

## 最小用法

以下片段位于 `features/<业务模块>/pages/<页面>/index.uvue`，省略页面布局和样式：

```vue
<script setup lang="uts">
import { useFaPageTheme } from '@/features/fa-core-mobile/common/page-theme.uts'

const { themeMode, dark } = useFaPageTheme()
</script>
```

在模板中按 `themeMode` 切换页面亮暗类；图标颜色也由调用方传入，见 [图标](components/icon.md)。

## 工具接口

| 接口 | 行为 |
| --- | --- |
| `ThemeMode` | `'light' \| 'dark'` |
| `getThemeMode(): ThemeMode` | 读取 `fa.mobile.theme-mode`；仅值为 `dark` 时返回暗色，其他值或读取异常返回亮色 |
| `saveThemeMode(mode: ThemeMode): void` | 写入本地存储；当前实现没有捕获写入异常 |
| `applyThemeToNavigationBar(mode: ThemeMode): void` | 设置导航栏背景和前景颜色，并同步当前原生页面底色；页面样式不可用时继续设置导航栏 |

## 行为与限制

当前工具没有系统主题跟随、全局响应式状态或主题切换广播。保存配置不会自动更新已显示页面，调用方需要更新自己的状态；demo 在页面再次显示时重新读取。页面初始状态直接使用 `getThemeMode()`，不要先渲染亮色再到 `onMounted`/`onPageShow` 读取；在 `onLoad` 同步原生页面底色，减少跳转首帧的亮色闪烁。导航栏和原生底色设置不会替代页面 CSS，亮暗背景、文本、边框等仍需由页面维护。

外观设置页 `features/fa-base-mobile/pages/mine/appearance/index.uvue` 先调用 `saveThemeMode`，保存成功后才更新页面状态和导航栏。写入失败由页面提示重试并保留原主题；点击当前选项不重复写入。其他调用方同样需要自行处理存储异常。

## 验证

初版仅核对工具接口及 icons demo 的调用，未执行端侧验证；后续验证记录如下。

2026-10-03：`pnpm check --group core --name check-theme.mjs` 已覆盖工具底色/导航栏、读取异常，以及真实外观页首帧、保存成功/失败、重试、重复点击和返回读取。HBuilderX 5.26 Android/iOS Vapor 编译及资源导出通过；用户于 2026-10-03 确认 iOS 明暗切换、返回资料/首页同步及重启保持验证成功，IOS05-03 已完成；未执行本批 Android 端侧或真机视觉验收。

## 页面主题试点（2026-10-17）

共享工具 `features/fa-core-mobile/common/page-theme.uts` 提供 `useFaPageTheme(syncNavigationBar: boolean = true)`。仅在页面 setup 中调用一次，返回 `themeMode` ref 和 `dark` computed；初始化读取偏好，在 onLoad 和 onShow 时刷新并同步原生主题，不执行业务请求。试点为账号与安全页，页面不再重复注册主题生命周期。

自定义导航栏页面可传 `false`，同时关闭原生页面底色和导航栏同步；页面 CSS 仍自行维护。保存主题不会广播给当前页面，外观设置页继续使用原有保存逻辑。

本批定向 Node 检查通过；2026-10-17 用户确认 BC01 验证通过。开发环境未执行 UTS 编译，用户验收的具体平台和编译版本未记录。