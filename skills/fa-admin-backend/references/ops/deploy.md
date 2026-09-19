# 构建与部署

测试见 [test.md](test.md)；代码生成器见 [generator.md](generator.md)；Nginx 配置见 [nginx.md](nginx.md)。

## Maven 与依赖检查

只在用户要求检查升级时运行 Versions Plugin：

```shell
mvn versions:display-dependency-updates
mvn versions:display-plugin-updates
mvn versions:display-property-updates
```

这些命令只报告候选版本，不授权升级。普通代码改动用目标模块编译，不默认 `mvn package`。

## Git submodule

```shell
git submodule update --init --recursive
```

删除 submodule 涉及多处状态，属破坏性操作，只有用户明确要求才执行。

## Docker

打包、镜像发布改变外部状态，必须用户明确请求。不擅自取消注释 `push` goal；registry、tag、登录身份确认后再执行。

## Windows 自启动

用 WinSW 注册服务，服务名唯一。Java 路径、JVM 参数、工作目录用目标机实际值。

## Linux 服务化

- 生产推荐 **systemd**，临时环境用 `service.sh`，不要两种同时跑。
- unit 文件 `ExecStart` 用绝对路径；密钥放 `EnvironmentFile`（`chmod 600`），不写进 unit 或 Git。
- 改 unit/env 后 `daemon-reload && restart`；日志用 `journalctl -u fa-admin -f`。

## 运维 SQL

`TRUNCATE`、物理 `DELETE` 属破坏性操作，必须用户明确要求并确认环境。执行前先跑等价 `SELECT COUNT(*)`。
