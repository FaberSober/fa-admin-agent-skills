# 测试

## 测试类模板

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FaTestApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FaAppTest {
    @Test
    void testGetUser() {
        // arrange / act / assert
    }
}
```

- `FaTestApp` 包路径必须在 `com.faber` 下，确保被扫描。
- 跟随模块现有 JUnit 版本，不混用 JUnit 4/5。
- 测试必须有断言，不只打印结果。

## 最小验证原则

不跑全量测试，按风险选择：编译目标模块 → 运行直接相关测试类 → 用户明确要求才跑全量。
