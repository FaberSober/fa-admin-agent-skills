# @fa-admin/agent-skills

# 在业务项目中安装
直接下载安装到.agents/skills目录（推荐）
```
pnpm dlx @fa-admin/agent-skills@latest sync
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

### 配置本机 npm 代理

如果登录时出现网络错误，可将代理写入用户级 `~/.npmrc`，配置一次后无需每次在命令中指定代理。以下以本机 HTTP 代理端口 `7897` 为例，请按实际代理地址和端口调整，并保持代理程序运行。

```bash
npm config set proxy http://127.0.0.1:7897 --location=user
npm config set https-proxy http://127.0.0.1:7897 --location=user
npm config set strict-ssl true --location=user
```

验证连接，成功时会输出 `PONG`，随后直接登录：

```bash
npm ping --registry=https://registry.npmjs.org/
npm login --registry=https://registry.npmjs.org/
```

不再使用代理时，删除用户级代理配置：

```bash
npm config delete proxy --location=user
npm config delete https-proxy --location=user
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
pnpm dlx @fa-admin/agent-skills@latest sync
```
