# 环境变量

业务代码只读 `VITE_APP_*`：

```ts
const filePrefix = import.meta.env.VITE_APP_FILE_PREFIX;
```

Vite config 用 `loadEnv`：

```ts
const env = loadEnv(mode, process.cwd());
```

所有 `import.meta.env` 值都会进前端包，不能放密钥/token/密码。新增变量同步类型声明和环境模板。
