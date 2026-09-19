# 首页 Cube

首页统计卡片导出大写命名组件，设置静态元数据：

```tsx
export function CountUser() {
  return <div>...</div>;
}

CountUser.displayName = 'CountUser';
CountUser.title = '用户量';
CountUser.description = '总用户量';
CountUser.showTitle = false;
CountUser.permission = '';
CountUser.w = 6;  // 宽度，网格最大 24
CountUser.h = 4;   // 高度，每单位 20px
```

`displayName` 与函数名一致；`permission` 对应当前菜单 link URL。
