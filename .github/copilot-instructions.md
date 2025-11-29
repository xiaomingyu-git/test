<!-- Copilot / AI agent guidance for contributors working on this repo -->

# 快速上手（AI 代理）

请把下面内容作为在此仓库中进行代码修改、补全、或重构时的首要参考。

- **常用命令**
  - `npm install` — 安装依赖
  - `npm run dev` — 启动开发服务器 (Vite)
  - `npm run build` — 构建生产包
  - `npm run preview` — 本地预览构建产物
  - `npm run type-check` — 运行 `vue-tsc` 类型检查
  - `npm run lint` — 执行 ESLint/oxlint 检查

# 一览：项目架构要点（大局观）

- 前端单体应用：`Vue 3 (Composition API) + TypeScript + Vite`。
- UI：`Element Plus`。富文本编辑核心使用 `Tiptap`，与 `src/components/TiptapEditor.vue` 及工具栏相关组件紧密耦合。
- 页面在 `src/views/`，可复用组件在 `src/components/`，可复用逻辑在 `src/composables/`，类型定义集中在 `src/types/`。
- 本地演示/开发使用“模拟 API”实现：`src/api/*.ts`（例如 `src/api/user.ts` 返回项目内约定的 `ApiResponse<T>`）。生产接入通常通过外部 HTTP 客户端（文档中提到的 `utils/request.ts` / `yujiaAxios` 封装）。

# 数据获取与 API 约定（关键，常被误用）

- 仓库同时存在两类 API 风格：
  1. 本地模拟 API（`src/api/*.ts`）——返回 `ApiResponse<T>`（示例：`src/api/user.ts` 返回 `{ success, data, message, code }`）。
  2. 真实后端请求（文档/工具参考）：`utils/request.ts`（yujiaAxios 封装）会返回完整的 `AxiosResponse<T>`，真实业务数据位于 `response.data`。
- 当你在代码中调用 API，请先确认目标函数的返回类型：
  - 如果调用 `src/api/*` 的 mock 函数，处理的是 `ApiResponse` 结构（直接使用 `response.success/response.data`）。
  - 如果调用通过 `request()` 的真实客户端，先 `await` 后用 `response.data` 获取业务数据。

# 典型文件/模式（可做参考的例子）

- 业务类型：`src/types/`（例如 `src/types/crud.ts`）
- Mock API：`src/api/user.ts`（分页、增删改查示例）
- 组合函数（composables）：`src/composables/useCrud.ts`（CRUD 流程、分页、表单验证示例）
- 编辑器：`src/components/TiptapEditor.vue`、`src/components/TiptapToolbar.vue`
- 入口/全局：`src/main.ts`、路由在 `src/router/`。

# 代码风格与约定

- 使用 `script setup` 和 Composition API；首选在 `composables/` 中提取共享逻辑。
- 类型安全优先：用已定义的 `src/types/*`，并运行 `npm run type-check` 检查。
- 错误/提示使用 Element Plus 的 `ElMessage` / `ElMessageBox`，参见 `src/composables/useCrud.ts` 和 `src/api/*` 的调用处。

# 集成点与注意事项

- 富文本功能靠 `Tiptap` 的扩展和 `lowlight`/`highlight.js`，修改相关代码请同时检查样式文件 `src/styles/`。
- 若要替换 mock API 为真实后端：
  1. 实现或引入 `utils/request.ts`（项目文档中有示例封装，返回 `AxiosResponse<T>`）。
  2. 在 API 模块中把返回类型从 `ApiResponse<T>` 改为 `Promise<AxiosResponse<T>>`，并在上层组合函数中解构 `response.data`。
  3. 更新调用处（组件/组合函数）以兼容 `AxiosResponse`。

# 交互与调试要点

- 本地运行时使用 `npm run dev`（Vite 热更新），页面入口与测试路径在 `README.md` 中列出（例如 `/editor-test`）。
- 若修改类型或组件，先运行 `npm run type-check`，再 `npm run lint`。

# 如何提出补全/PR（给 AI 的小提示）

- 修改 UI 行为时：优先在 `src/components/` 或 `src/views/` 中定位控件，然后在 `composables/` 中提取/复用逻辑。
- 修改数据流：先查看 `src/api/`（mock）或文档中的 `utils/request.ts` 风格，保持调用方一致（不要混合 `ApiResponse` 和 `AxiosResponse` 处理方式）。
- 在更改接口返回格式或迁移到真实后端前，请在 PR 描述中明确列出受影响文件（例如：`src/api/user.ts` -> `src/views/users/composables/useUsers.ts`）。

# 未尽事宜 / 询问点

- 如果遇到不确定的 API 返回类型，优先搜索 `src/api/` 中的实现或在代码中查找 `response.data` 的调用位置；若仍不清楚，请询问维护者。
- 我可以把本文件再缩短或扩展成英文版，或合并 `.claude` 中的 data-fetching 段落进来，是否需要？

---
_文件自动生成：基于仓库扫描与现有 README、`src/api`、`src/composables` 示例。请审阅并指出需补充的具体场景。_
