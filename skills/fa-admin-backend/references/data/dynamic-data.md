# 动态表、动态数据源与 TDengine

## 动态表名

在同一线程设置 `BaseContextHandler` 表后缀，并确保结束后清理。使用 `try/finally` 防止异常导致线程复用时污染后续查询：

```java
BaseContextHandler.setTableSuffix("1");
try {
    return iotDeviceBiz.getById(id);
} finally {
    BaseContextHandler.setTableSuffix("");
}
```

表后缀必须来自受控值，不直接接受未校验的请求字符串。

## 动态数据源

仅在任务明确需要多数据源时使用项目当前 dynamic-datasource 方案：

- 先确认父 POM 是否已有 starter 和版本管理，不重复声明版本。
- 在目标环境配置中添加数据源，凭证使用环境变量或密钥管理，不把真实密码写入仓库或 reference。
- 使用 `@DS("dataSourceName")` 标注 Service/Biz 或方法，命名与配置完全一致。
- 明确默认数据源、严格匹配策略、事务边界和跨数据源调用限制。
- 测试实际连接、路由和失败行为；不要复制历史文档中的主机、账号或密码。

## 地理数据

- 经纬度列通常使用 `decimal(11,8)`；确认业务覆盖范围、精度和坐标系后再定字段。
- MySQL 距离计算可参考仓库历史 `lat_lng_distance` 函数，但新增数据库函数前确认部署权限、单位和索引方案。

## TDengine

TDengine 任务先读取当前模块 Service/Mapper、驱动和连接配置，再使用 `@DS` 路由。

- 超级表（STable）的 timestamp、普通列和 TAGS 要分开建模；库的 `PRECISION`、`KEEP`、`DURATION`、`BUFFER` 必须来自实际保留与写入需求。
- TDengine SQL 和驱动 API 以仓库锁定版本为准，不把普通 MySQL/MyBatis-Plus 假设直接套用。
