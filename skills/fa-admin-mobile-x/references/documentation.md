# MobileX 文档编写规范

本文规定框架文档的新增、更新及 skill 分发方式。开发文档维护源位于 `mobile-x/docs/development/`；可运行示例位于 `features/fa-demo-mobile/`，文档中的源码路径统一相对 `mobile-x/`。

## 内容归属

| 位置 | 内容 |
| --- | --- |
| `AGENTS.md` | 每次开发适用的工程硬约束及文档入口 |
| `docs/development/` | 组件接口、使用约定、编码规范、平台限制及验证说明 |
| `features/fa-demo-mobile/` | 完整可运行示例；文档只保留最小用法 |
| `docs/plans/`、`docs/adrs/` | 阶段计划和架构决策，不作为稳定 API 文档 |
| `fa-admin-mobile-x/SKILL.md` | AI 适用场景、开发流程和按需阅读导航 |
| skill 的 `references/` | 随包分发的框架文档副本，不独立改写规范 |

## 新增文档

- 一篇文档聚焦一个组件或规范，文件名使用小写英文和连字符。
- 组件与组件使用约定放在 `docs/development/components/`；通用规范按主题放在 `docs/development/` 根目录。技术实施计划放在 `docs/plans/`，架构决策放在 `docs/adrs/`，不要混入开发文档。
- 开头明确分类：共享组件、原生组件使用约定、页面实现示例或开发规范。只有已存在可复用实现的内容才能写成共享组件 API。
- 先检查实际实现、调用方和 demo，再写文档；不要从 demo 推断不存在的导入路径、参数或能力。
- 相对文档链接用于主题间导航；源码路径使用代码文本，避免 skill 副本中的链接指向不存在的源码。
- 不写本机绝对路径、真实凭据，也不复制完整页面、第三方 API 手册或大段生成代码。
- 新增后登记到开发文档索引 `docs/development/README.md`；需要供 AI 使用的主题同时登记到 skill 阅读导航。

## 组件文档结构

按下列顺序组织；没有参数、事件或插槽时写明“无自定义接口”，不编造接口表。

1. **定位与来源**：分类、适用场景、实现路径、demo 路径。
2. **最小用法**：共享组件给出真实导入和使用片段，注明片段所在目录；页面示例说明复用边界。
3. **接口或使用约定**：参数类型、必填、默认值、事件和插槽；原生组件只说明项目已使用的属性。
4. **行为与限制**：主题、状态、异常或回退行为，以及尚未实现的能力。
5. **验证**：区分源码核对、编译和运行验证；记录实际平台、HBuilderX 版本、结果及未验证项。

开发规范可改为“适用范围 → 规则 → 最小示例/命令 → 来源 → 验证”，无需套用组件接口表。

## 验证记录

- 只有阅读代码的结论写“已核对源码；未执行编译或端侧验证”。
- 编译通过不能替代交互验证；Android 通过不能写成 iOS、小程序或全部平台通过。
- 编译环境版本从当前项目 `README.md` 核对，不在通用规范中固化版本号。
- 计划与 ADR 的验收状态仍遵守 `AGENTS.md`，不因文档核对通过就宣布功能验收完成。

## 更新与 skill 同步

新增共享组件、变更公共接口或形成新的复用约定时，同步更新对应文档；有 demo 的主题同步维护 demo。内部实现调整但用法不变时无需新增文档。

文档与代码冲突时，以当前代码为准，修正维护源，再更新 skill 副本。在没有框架源码的业务项目中，使用 skill 文档并核对当地实现，不把副本当成实际平台验证结果。

当前分发目录：`fa-admin-agent-skills/skills/fa-admin-mobile-x/references/`。按下列映射逐文件复制，保留主题间相对路径；不要修改业务项目 `.agents/skills` 中的消费副本。

| 框架维护源（相对 `docs/development/`） | skill 副本（相对 `references/`） |
| --- | --- |
| `documentation.md` | `documentation.md` |
| `coding.md` | `coding.md` |
| `feature-modules.md` | `feature-modules.md` |
| `theme.md` | `theme.md` |
| `components/button.md` | `components/button.md` |
| `components/dialog.md` | `components/dialog.md` |
| `components/icon.md` | `components/icon.md` |

`docs/README.md` 是文档总览，`docs/development/README.md` 是开发文档索引，两者不分发。副本与维护源正文保持一致；新增分发主题时更新此表及 skill 导航，不复制计划和 ADR。发布前核对副本与维护源、检查文档链接，再在 skill 源仓库运行 `npm run package:check`。沿用源仓库发布流程，不因文档更新自动发布包。
