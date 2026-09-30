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

## 验证与交付

优先核对受影响文件和路由。涉及 UTS、原生能力或页面交互时，使用项目 `README.md` 中匹配版本的 HBuilderX 编译，并在目标端验证；普通 TypeScript 检查不能替代 UTS 编译。不支持属性的编译警告也需要处理。

仅文档变更核对真实接口、路径和链接即可，不启动服务器或完整构建。编译工具或设备不可用时，记录未验证项，不声明验证成功。新增公共用法同步文档与相关 demo，遵守 [文档编写规范](documentation.md)。

## 来源与本次验证

来源：`AGENTS.md`、`README.md`、`features/fa-demo-mobile/pages/basic/`。已核对源码及工程约束；本文未执行 HBuilderX 编译或端侧验证。
