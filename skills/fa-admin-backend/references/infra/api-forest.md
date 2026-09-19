# Forest 外部 API

仓库已使用 Forest 声明式 HTTP 客户端，优先定义接口，不在业务代码拼 URL。

## GET

```java
public interface IpService {
    @Get("${ip.service.url}?ip={0}&json=true")
    IpAddr query(String ip);
}
```

## POST

```java
@Address(basePath = "#{remote.api.base-url}")
@Headers("Authorization: Bearer #{remote.api.token}")
public interface RemoteService {
    @Post("datasets")
    JSONObject create(@JSONBody("name") String name);

    @Post("datasets/{datasetId}/documents")
    JSONObject upload(@Var("datasetId") String datasetId, @DataFile("file") File file);
}
```

## 规则

- base URL、token、超时来自配置，不硬编码。
- 为非 2xx、超时、重试、限流、反序列化和日志脱敏定义行为。
- 外部 API DTO 与内部 Entity 分离。
