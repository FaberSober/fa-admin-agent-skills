# 文件上传

## 组件选择

| 场景 | 组件 | 表单值 |
| --- | --- | --- |
| 单个普通文件 | `UploadFileLocal` | `string` |
| 多个普通文件 | `UploadFileLocalMultiple` | `string[]` |
| 单张图片/头像/封面 | `UploadImgLocal` | `string` |
| 仅浏览器解析不上传 | Ant Design `Upload` | `File` |

## 表单绑定

```tsx
<Form.Item name="coverFileId" label="封面">
  <UploadImgLocal />
</Form.Item>
```

编辑回填只设置已有 fileId，组件自动获取文件信息回显。

## 文件 URL

```ts
fileSaveApi.genLocalGetFile(fileId);        // 原文件
fileSaveApi.genLocalGetFilePreview(fileId); // 缩略图
```

## 规则

- 数据库存 fileId/fileIds，不存浏览器路径或 Base64。
- 上传成功 ≠ 业务完成；图片解析/OCR/SHA-256 由后端接口处理。
- 删除控件条目只清空业务字段，不物理删除平台文件。
- 不自行拼上传地址或 Authorization 头，组件已统一处理。
