# Quartz 定时任务与执行日志

适用于以 `fa-core`、`fa-base` 为基座的业务项目。使用现有任务执行日志能力，为选定任务记录关键步骤、批次进度和异常，管理端可运行中查看、执行后下载。

## 接入前确认

- 共享模块已包含 `BaseJob`、`com.faber.config.quartz.logging.JobRunLogger` 和日志查看页面。
- 后端启动时已完成对应数据库升级：初始脚本为 MySQL / PostgreSQL 的 `1.0.52_base_job_file_log.sql`，新增 `base_job.detail_log_enabled` 和 `base_job_log.log_path`。
- 老项目先升级引用的共享模块及对应数据库脚本；业务模块不重复创建同名字段、逐行日志表或附件记录。

## 业务任务接入

将任务类放在 `com.faber` 扫描范围内、本业务模块的 `jobs` 目录，继承 `BaseJob` 并添加 `@FaJob`。以下以 demo 包为例：

```java
package com.faber.api.demo.jobs;

import com.faber.config.quartz.BaseJob;
import com.faber.config.quartz.logging.JobRunLogger;
import com.faber.core.annotation.FaJob;

@FaJob("业务批次同步")
public class JobBusinessSync extends BaseJob {
    @Override
    protected void run() {
        JobRunLogger.info("开始同步，共 {} 个批次", 3);
        for (int batch = 1; batch <= 3; batch++) {
            // 在此调用所属业务模块的 Biz 处理当前批次。
            JobRunLogger.info("已处理 {}/{} 个批次", batch, 3);
        }
    }
}
```

- 在关键步骤或批次边界调用 `JobRunLogger.info/warn/error`，支持 SLF4J 的 `{}` 参数格式；异常作为最后一个参数时写入堆栈，例如 `JobRunLogger.error("业务处理失败", e)`。
- `BaseJob` 自动记录开始、成功或失败、耗时及异常，负责文件收尾和上下文清理；业务任务实现 `run()` 即可。
- 业务 Biz 方法也可以直接调用 `JobRunLogger`，同一执行线程会写入当前执行文件；开关关闭或没有任务执行上下文时不写任务日志。
- 普通 `log.info()` 不会自动进入本次执行文件。需要在任务详情中查看的步骤使用 `JobRunLogger`，系统日志仍按原方式记录。
- `JobRunLogger.error()` 只记录日志，不会把任务状态改成失败。需要整次任务失败时，将异常抛给 `BaseJob`；不要捕获后仅打印日志就正常返回。
- 同步调用链中的异常通常直接向上抛出即可，`BaseJob` 会记录堆栈，避免在每层重复记录同一异常。

## 管理端操作

1. 打开“系统管理 → 定时任务”，页面路径为 `/admin/system/base/job`。新增任务时选择带 `@FaJob` 的业务任务类，填写名称和 cron 表达式；已有任务直接编辑。
2. 开启“记录详细日志”并保存。该开关默认关闭；任务已启动且没有编辑入口时，先停止调度再编辑。
3. 点击“执行”立即执行一次，或等待下一次 cron 调度。修改开关不改变已开始执行的日志设置，也不补生成历史日志。
4. 点击任务名称打开执行记录，在新产生的执行记录上点击“查看日志”；未登记日志路径的记录会禁用按钮并提示未记录详细日志。
5. 执行中每 2 秒读取新增内容；成功或失败后补齐剩余日志，再自动停止。执行中暂时没有新日志时继续等待。
6. 可暂停或继续自动滚动、重新加载及下载日志。“暂停跟随”只暂停滚动；关闭日志窗口、切换执行记录或离开页面会取消对应轮询。

查看、增量轮询和下载接口不写 API 日志表。管理端最多显示最近约 200 万字符，需要完整的已保存内容时下载日志文件；达到服务端文件上限后的正文已被省略，不会通过下载补回。

## 子线程日志

注入框架线程池提供的 `Executor`，在父任务线程中包装子任务，再提交，并等待结束：

```java
CompletableFuture.runAsync(
        JobRunLogger.wrap(() -> JobRunLogger.info("子任务处理完成")),
        executor
).join();
```

- `CompletableFuture` 来自 `java.util.concurrent`，`executor` 使用已注入的框架 `Executor`；不要为日志临时创建线程池。
- 包装必须发生在父任务的执行上下文中；子线程仅直接调用 `JobRunLogger.info()` 不会自动继承上下文。
- `wrap` 只传播和恢复任务日志上下文。用户、租户、动态数据源及事务按 [线程池规范](thread.md) 处理，事务不跨线程传播。
- 父任务必须等待所有子任务完成，并把需要导致整次失败的异常继续抛出；父任务结束后文件会关闭，迟到的子线程日志不再追加。

## 存储与清理配置

```yaml
fa:
  setting:
    job-log:
      root-path: ./log/job
      retention-days: 30
      max-file-size: 100MB
      cleanup-cron: "0 0 3 * * ?"
```

| 配置 | 默认值 | 行为 |
| --- | --- | --- |
| `root-path` | `./log/job` | 文件根目录；相对路径以应用运行目录为基准，生产可配置绝对持久化目录 |
| `retention-days` | `30` | 清理已结束且超过保留期限的文件；小于等于 0 时暂停自动清理 |
| `max-file-size` | `100MB`（100 MiB） | 单次执行文件上限，最小 1 KiB；触顶后提示截断，并预留有界的结束或异常摘要 |
| `cleanup-cron` | `0 0 3 * * ?` | 每日凌晨 3 点执行文件清理，使用应用时区 |

- 文件格式：`{root-path}/{yyyy}/{MM}/{dd}/{jobId}/{jobLogId}.log`。日期取本次执行开始日期，跨天仍写同一个文件；同一任务不同执行相互隔离。
- `base_job_log` 继续每次执行一条，只增加相对路径；正文不入库、不逐行更新数据库，也不调用 `FileBizBiz` / `FileSaveBiz` 存附件。
- 自动清理以已结束任务的结束时间为准，运行中任务保留；清理后保留执行摘要，页面提示文件已清理或不可用。
- 删除已结束的执行记录时同时清理文件，支持单条和批量；运行中记录拒绝删除。自动文件清理由 Spring 定时器执行，不产生额外任务执行摘要。
- 多实例部署使用可共同访问的共享日志目录。各实例使用独立本地磁盘时，当前接口不能自动跨节点查找文件。

## 业务自定义查看接口时

优先复用框架接口和页面；业务确有自定义查看需求时沿用以下协议：

| 接口 | 请求 | 返回 / 行为 |
| --- | --- | --- |
| 增量读取 | `GET /api/base/admin/jobLog/read/{id}?offset=0&maxBytes=32768` | `Ret.data` 包含 `content`、字符串 `nextOffset`、`status`、`hasMore`、`available`、`message` |
| 下载 | `POST /api/base/admin/jobLog/download/{id}` | 已鉴权的文件流下载，正文不经 API 日志缓存 |

- `id` 为本次执行记录 ID。`offset` 是字节游标，下一次直接使用返回的 `nextOffset`，不要按字符数自行计算；单次读取最大 64 KiB。
- 状态为 1（执行中）、2（成功）、9（失败）。仅在状态为 2 或 9 且 `hasMore=false` 时完成读取；还有未读内容时先补齐。
- `available=false` 时提示原因并停止；请求失败时暂停并提供重试。轮询顺序执行，关闭页面时取消定时器及请求，并忽略迟到响应。
- 通过框架登录态访问，不从前端传文件路径或直接暴露静态日志目录。已有接口通过 `FaNoLog: 1` 及过滤器跳过整条 API 日志入库，仍保留请求校验和鉴权；不要为了查看日志关闭全局 API 日志。

## 常见排查

| 现象 | 检查顺序 |
| --- | --- |
| “查看日志”按钮禁用 | 先确认已开启并保存“记录详细日志”，再检查新执行记录；旧记录不会补生成。已开启的新记录仍无路径时，检查系统日志中的“初始化任务详细日志失败”及根目录写权限 |
| 文件不可用 | 检查是否超过保留期限、文件被删除、根目录或应用运行目录改变，以及多实例是否使用同一存储 |
| 业务日志不出现在详情中 | 检查是否使用 `JobRunLogger`、是否位于当前任务调用链中；子线程检查 `wrap` 和父任务等待 |
| 有 ERROR 日志但任务显示成功 | 检查异常是否被业务捕获后吞掉；仅调用 `error()` 不改变执行结果 |

源码参考：`fa-base` 中的 `BaseJob`、`JobDemo1`、`JobRunLogger`、`JobLogFileService`、`JobLogBiz`、`JobLogController`，以及 `fa-core` 的 `FaSetting.JobLogConfig`。仓库实现变化时，以实际框架代码为准。
