# @fa-admin/agent-skills

# 在业务项目中安装
直接下载安装到.agents/skills目录（推荐）
```
pnpm dlx @fa-admin/agent-skills@1.0.0 sync
```

先把 npm 包安装到项目，CLI 再把 skills 复制到 .agents/skills
```
pnpm add -D @fa-admin/agent-skills@1.0.0 --save-exact
pnpm exec fa-admin-skills sync
```

# How to publish

## 建议 Git Tag 与 npm 版本保持一致：
```
git tag v1.0.0
git push origin v1.0.0
```

## 发布到 npm
```
npm login
npm whoami
npm publish --access public
```

## 后续升级流程

在公共仓库中修改 Skill：

```
npm version patch
npm run package:check
npm publish --access public
git push origin main --follow-tags
```

然后在每个业务项目中：

```
pnpm dlx @fa-admin/agent-skills@1.0.0 sync
```
