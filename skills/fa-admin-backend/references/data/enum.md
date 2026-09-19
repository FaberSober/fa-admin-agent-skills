# 枚举

参考 `fa-core/src/main/java/com/faber/core/enums/SexEnum.java`。

## 规范

- 类名 `XxxEnum`，放模块 `enums` 包。
- 默认 `implements IEnum<Integer>`（MyBatis-Plus 提供）；业务值天然是字符串才用 `IEnum<String>`。
- 整型枚举数据库列用 `tinyint(4)` 或相邻表兼容类型。
- 值字段 `value` 加 `@JsonValue` + `@EnumValue`；展示字段 `desc`。
- Lombok `@Getter` + `private final` 字段。
- Entity 字段直接声明为枚举类型，不退化成 `Integer`。
- 需要反查时实现 `fromValue(...)`、`fromDesc(...)`，非法值抛 `IllegalArgumentException`。

## 示例

```java
@Getter
public enum XxxEnum implements IEnum<Integer> {
    NO(0, "否"),
    YES(1, "是");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    XxxEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static XxxEnum fromValue(Integer value) { ... }
    public static XxxEnum fromDesc(String desc) { ... }
}
```
