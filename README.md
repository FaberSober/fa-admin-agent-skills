# @fa-admin/agent-skills

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

# 在业务项目中安装
```
pnpm add -D @fa-admin/agent-skills@1.0.0 --save-exact
pnpm exec fa-admin-skills sync
```
