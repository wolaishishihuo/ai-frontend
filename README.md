# AI Web 前端

基于 Vue 3 的 AI 聊天应用前端

## 技术栈

- Vue 3.5 + TypeScript 5
- Vite 6 构建工具
- Tailwind CSS 4 + shadcn-vue
- Pinia 状态管理
- Vue Router 4
- Vercel AI SDK

## 功能特性

- ✅ AI 对话聊天界面
- ✅ 流式响应渲染
- ✅ 用户登录/注册
- ✅ 会话历史管理
- ✅ 深色/浅色主题
- ✅ 响应式设计
- ✅ 组件自动导入
- ✅ 代码规范（ESLint + Husky + Commitlint）

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
# 开发环境已预配置，如需修改：
# .env.development - 开发环境
# .env.production  - 生产环境
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

### 4. 构建生产版本

```bash
pnpm build
pnpm preview  # 预览构建结果
```

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览构建结果
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
```

## 项目结构

```
src/
├── main.ts              # 应用入口
├── App.vue              # 根组件
├── api/                 # API 接口
│   ├── modules/         # 按模块划分的接口
│   └── types/           # 接口类型定义
├── assets/              # 静态资源
│   └── css/             # 样式文件
├── components/          # 组件
│   ├── ui/              # shadcn-vue 基础组件
│   └── ai-elements/     # AI 相关组件
├── http/                # HTTP 请求封装
├── lib/                 # 工具库
├── router/              # 路由配置
├── stores/              # Pinia 状态管理
│   └── modules/         # 状态模块
├── types/               # 类型定义
└── views/               # 页面视图
    ├── chat/            # 聊天页面
    ├── login/           # 登录页面
    └── not-found/       # 404 页面
```

## 环境变量

| 变量              | 说明            | 默认值                  |
| ----------------- | --------------- | ----------------------- |
| VITE_API_BASE_URL | 后端 API 地址   | http://localhost:3000   |

## UI 组件

项目使用 [shadcn-vue](https://www.shadcn-vue.com/) 组件库，基于 Tailwind CSS 构建。

添加新组件：

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add input
```

## 开发说明

### 自动导入

项目配置了 Vue、Vue Router、Pinia 的 API 自动导入，无需手动 import：

```vue
<script setup lang="ts">
// 无需 import { ref, computed } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)

// 无需 import { useRouter } from 'vue-router'
const router = useRouter()
</script>
```

### 组件自动注册

`src/components` 目录下的组件会自动注册，可直接在模板中使用。

## License

UNLICENSED
