# 移动端 Feature 模块

分类：开发规范。实现：`scripts/generate-pages.mjs`、`scripts/watch-pages.mjs`；示例清单：`features/fa-demo-mobile/feature.json`。本文源码路径相对 `mobile-x/`。

`features/<模块名>/` 是移动端功能的源码边界。每个可装配模块在目录内提供 `feature.json`，由 `scripts/generate-pages.mjs` 汇总生成 uni-app X 使用的 `pages.json` 和首页入口清单。

## 新增模块或页面

模块清单示例：

```json
{
	"id": "fa-inventory-mobile",
	"dependsOn": ["fa-core-mobile"],
	"pages": [
		{
			"path": "pages/list/index",
			"style": { "navigationBarTitleText": "库存" }
		}
	],
	"mineEntries": [
		{
			"id": "inventory-home",
			"title": "库存管理",
			"icon": "grid",
			"page": "pages/list/index"
		}
	]
}
```

1. 在 `features/` 下创建模块目录，并添加 `feature.json`；`id` 必须与目录名一致。
2. 在 `pages` 中登记模块页面路径和页面级 `style`。路径相对模块目录，省略 `.uvue` 后缀；所有页面都要登记。
3. 在 `dependsOn` 中声明必需模块；跨模块依赖尽量指向共享模块。
4. 如需出现在“我的”设置中，在 `mineEntries` 中声明入口及目标页面；没有入口时可省略该字段。
5. 首次使用时在 `mobile-x/` 目录执行 `pnpm install` 安装监听依赖；之后开发时运行 `pnpm watch:pages` 并保持终端开启，再使用 HBuilderX 编译运行。监听器启动时会先生成一次；之后改动 `feature.json`、新增/删除页面 `.uvue` 文件或增删 Feature 目录时，会自动重新生成。

页面路由仍需在编译前写入 `pages.json`。监听器扫描 `features/` 下带有 `feature.json` 的模块目录，并自动调用生成脚本更新路由和入口，无需逐次手动运行生成器或维护 `pages.json`。单次生成或 CI 场景运行 `pnpm generate:pages`。监听器使用 Chokidar 统一处理跨平台文件事件，用 `Ctrl+C` 停止。

`fa-base-mobile` 提供启动页并保持为必需模块；它依赖共享模块 `fa-core-mobile`。删除一个仍被其他模块依赖的目录时，生成脚本会报出缺失依赖。Feature 的页面需要通过其模块清单登记，页面文件本身不会自动成为路由。

## 生成文件与跳转

生成器读取 `pages.config.json` 和各模块 `feature.json`，输出 `pages.json` 与 `features/generated/feature-registry.json`。不手动编辑这两个输出文件，也不在 `pages.config.json` 中声明页面列表。

跳转使用完整路由，如 `/features/fa-demo-mobile/pages/basic/icons/index`；`feature.json` 中则使用模块内路径 `pages/basic/icons/index`。模块归类不等同于 `pages.json.subPackages`，不要仅因目录拆分就引入分包配置。

## 验证

新增或移除路由时运行 `pnpm generate:pages` 检查清单和页面文件，并核对生成差异；脚本成功不代表 UTS 编译或端侧跳转已通过。

本次文档更新已核对生成器及 demo 清单，未执行路由生成、HBuilderX 编译或端侧跳转验证。
