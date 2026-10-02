# MobileX 编码与验证约定

分类：开发规范。适用于本框架的 uni-app X 页面和逻辑；普通 uni-app 的 `mobile/`、React 管理端规范不能直接套用。

## 工程与复用

- 页面和组件使用 `.uvue`，逻辑模块使用 `.uts`；页面脚本沿用 `<script setup lang="uts">`。
- 业务放入 `features/<模块>/`，按需建立 `pages/`、`api/`、`common/`、`components/`。共享配置、主题、图标等能力优先复用 `fa-core-mobile`，基础业务沿用 `fa-base-mobile`。
- 先查相邻实现和 demo，确认能力是共享组件还是页面代码；不要创建已有能力的第二份封装。
- 沿用相邻代码的相对导入方式，并按实际目录深度调整；不要照搬 React 的包导入或普通 uni-app 的类型假设。
- 页面登记与模块依赖见 [Feature 模块](feature-modules.md)，主题见 [主题约定](theme.md)。

## 模板与样式

- 面向用户触摸的可点击元素使用 `@tap`；输入、手势事件遵循其对应语义。
- 只使用当前 uni-app X 编译器支持的属性和 CSS，不照搬浏览器 DOM。当前工程已记录 `<view aria-hidden>` 不支持，`word-break` 会产生不支持属性警告；不要新增这两种写法。
- 文本和布局参考相邻 `.uvue`，主题颜色沿用已有亮暗模式类。demo 中的 CSS 类是页面局部样式，不能当成全局可用类。

## 配置与生成文件

- 设备 API 地址使用可访问的完整 URL；本机 `.env.local`、真实凭据、签名文件和 `unpackage/` 资源不提交。
- 不手改 `pages.json` 和 `features/generated/feature-registry.json`；路由源是 `feature.json` 和 `pages.config.json`。
- Android 原生宿主修改遵守 `app-shell/fa-admin-mobile-uniapp/AGENTS.md`。

## Debug 开关与日志

- `features/fa-core-mobile/common/config.uts` 的 `isDebugEnabled(): boolean` 读取关于页七连点保存的 `fa-debug-overlay-enabled`；未保存时 Release 默认关闭、开发模式默认开启本地诊断。显式关闭覆盖开发默认值。
- 应用日志使用 `features/fa-core-mobile/common/remote-client.uts` 的 `logConsole(level, args, mirrorToDebugConsole = false)`，不要直接调用 `console.*`。本地打印、诊断列表和 HTTP 日志跟随 Debug 开关；管理端远程采集和启动健康遥测独立运行。
- 我的页面按开关过滤 `fa-demo-mobile` 入口，在 `onPageShow` 刷新并重算最后一行样式；不要修改路由生成结果来隐藏 Demo。Android 关于页七连点同时切换悬浮面板、本地日志及 Demo，开关跨重启保存。
- 验证命令：`node scripts/check-debug-mode.mjs`。本轮定向检查及 HBuilderX 5.26 Android Vapor 编译通过；用户于 2026-09-30 确认 Release 调试开关联动验证通过。

## 验证与交付

优先核对受影响文件和路由。涉及 UTS、原生能力或页面交互时，使用项目 `README.md` 中匹配版本的 HBuilderX 编译，并在目标端验证；普通 TypeScript 检查不能替代 UTS 编译。不支持属性的编译警告也需要处理。

仅文档变更核对真实接口、路径和链接即可，不启动服务器或完整构建。编译工具或设备不可用时，记录未验证项，不声明验证成功。新增公共用法同步文档与相关 demo，遵守 [文档编写规范](documentation.md)。

## 来源与本次验证

来源：`AGENTS.md`、`README.md`、`features/fa-demo-mobile/pages/basic/`。已核对源码及工程约束；本文未执行 HBuilderX 编译或端侧验证。

## 文件上传、预览与系统打开

共享 API 位于 `features/fa-base-mobile/api/file.uts`：`uploadBaseFile(filePath)` 返回文件 ID；`createFilePreviewTicket(fileId)` 申请短期一次性票据；`buildH5PreviewUrl(ticket)` 构建在线预览地址；`openBaseFile(fileId)` 在下载授权允许时下载临时文件并调用 `uni.openDocument`，失败返回错误。完整 Demo 为 `features/fa-demo-mobile/pages/basic/upload/index.uvue`。

在线预览路由为 `/features/fa-base-mobile/pages/file-preview/index?fileId=<编码后的ID>`，通过 WebView 复用现有 H5 文件预览服务。App 优先读取 `VITE_APP_APP_H5_PREVIEW_BASE_URL`，微信优先读取 `VITE_APP_MP_H5_PREVIEW_BASE_URL`；回退至 `VITE_APP_H5_PREVIEW_BASE_URL` 或 API 域名下 `/h5/preview`。使用完整 HTTP(S) 地址，不含锚点。微信需配置业务域名和下载合法域名。

网页预览与系统打开各自申请票据；URL 不携带登录 Token，HTTP 日志隐藏票据及临时文件链接。系统打开检查下载权限并在下载前后检查登录/租户上下文；App 需可处理该格式的系统应用，微信文档格式受平台限制。图片选择沿用 `uni.chooseImage`，未新增通用文件选择器。Android 离线宿主需包含 `uni-openDocument` SDK 库。

验证：定向脚本、HBuilderX 5.26 Android/iOS Vapor 资源编译及完整 JDK 21 下的 Android Debug APK 构建通过；端侧验收及微信小程序构建仍待验证，见迁移计划 X07。
