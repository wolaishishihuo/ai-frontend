# Design Document: AI Web Frontend 项目初始化

## Overview

本设计文档描述了一个基于 Vue 3 生态系统的 AI Web 前端项目的初始化架构。项目采用现代化的前端技术栈，包括 Vite 构建工具、TypeScript 类型系统、TailwindCSS 样式框架、shadcn-vue UI 组件库，以及 @antfu/eslint-config 代码规范。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      AI Web Frontend                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Vue 3     │  │ TypeScript  │  │    Vite (Build)     │  │
│  │  Framework  │  │   Types     │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    shadcn-vue                           ││
│  │              (UI Component Library)                     ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   TailwindCSS                           ││
│  │                 (Styling System)                        ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │               @antfu/eslint-config                      ││
│  │                 (Code Quality)                          ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. 项目配置文件

| 文件 | 用途 |
|------|------|
| `package.json` | 项目依赖和脚本管理 |
| `vite.config.ts` | Vite 构建配置 |
| `tsconfig.json` | TypeScript 编译配置 |
| `eslint.config.ts` | ESLint 代码规范配置 (TypeScript) |
| `components.json` | shadcn-vue 组件配置 |
| `commitlint.config.ts` | Git 提交信息规范配置 |

### 2. 目录结构

```
project-root/
├── src/
│   ├── assets/           # 静态资源
│   │   └── css/
│   │       └── main.css  # 全局样式入口 (TailwindCSS)
│   ├── components/       # Vue 组件
│   │   └── ui/           # shadcn-vue 组件
│   ├── lib/              # 工具函数
│   │   └── utils.ts      # 通用工具 (cn 函数等)
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由入口
│   ├── stores/           # Pinia 状态管理
│   │   └── index.ts      # Store 入口
│   ├── views/            # 页面视图组件
│   ├── types/            # TypeScript 类型定义
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口
├── public/               # 公共静态资源
├── .vscode/              # VSCode 配置
│   ├── settings.json     # 编辑器设置
│   └── extensions.json   # 推荐扩展
├── index.html            # HTML 入口
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.ts
├── commitlint.config.ts
├── .env                  # 环境变量 (默认)
├── .env.development      # 开发环境变量
├── .env.production       # 生产环境变量
├── .gitignore            # Git 忽略配置
├── .husky/               # Git hooks
│   ├── pre-commit        # 提交前检查
│   └── commit-msg        # 提交信息校验
└── components.json
```

### 3. 核心依赖

**生产依赖:**
- `vue` - Vue 3 框架
- `vue-router` - Vue 官方路由管理
- `pinia` - Vue 官方状态管理
- `class-variance-authority` - 组件变体管理
- `clsx` - 条件类名工具
- `tailwind-merge` - Tailwind 类名合并
- `reka-ui` - shadcn-vue 底层原语

**开发依赖:**
- `vite` - 构建工具
- `@vitejs/plugin-vue` - Vue 插件
- `typescript` - TypeScript 编译器
- `vue-tsc` - Vue TypeScript 检查
- `tailwindcss` - CSS 框架
- `@tailwindcss/vite` - Tailwind Vite 插件
- `@antfu/eslint-config` - ESLint 配置
- `eslint` - 代码检查工具
- `@types/node` - Node.js 类型定义
- `husky` - Git hooks 管理
- `lint-staged` - 暂存文件检查
- `@commitlint/cli` - 提交信息检查
- `@commitlint/config-conventional` - 提交规范配置
- `unplugin-auto-import` - 自动导入 Vue API
- `unplugin-vue-components` - 自动导入 Vue 组件

## Data Models

本项目为前端脚手架初始化，不涉及复杂数据模型。主要配置数据结构如下：

### Vite 配置结构
```typescript
interface ViteConfig {
  plugins: Plugin[]
  resolve: {
    alias: Record<string, string>
  }
}
```

### shadcn-vue 组件配置
```typescript
interface ComponentsConfig {
  style: 'default' | 'new-york'
  typescript: boolean
  tailwind: {
    config: string
    css: string
    baseColor: string
  }
  aliases: {
    utils: string
    components: string
  }
}
```

## Error Handling

### 构建错误处理
- TypeScript 类型错误：通过 `vue-tsc` 在构建前检查
- ESLint 错误：通过 `eslint` 命令检查代码规范
- 构建失败：Vite 提供详细的错误堆栈信息

### 开发时错误处理
- HMR 错误：Vite 在浏览器控制台显示错误覆盖层
- 类型错误：IDE 实时提示

## 自动导入配置

### unplugin-auto-import
自动导入 Vue 3 Composition API、Vue Router、Pinia 等常用 API：
```typescript
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'

AutoImport({
  imports: ['vue', 'vue-router', 'pinia'],
  dts: 'src/types/auto-imports.d.ts',
})
```

### unplugin-vue-components
自动导入 Vue 组件，无需手动 import：
```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

Components({
  dts: 'src/types/components.d.ts',
  dirs: ['src/components'],
})
```

## 环境变量配置

### 环境文件
- `.env` - 所有环境共享的变量
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量

### 变量命名规范
以 `VITE_` 前缀的变量会暴露给客户端代码：
```
VITE_APP_TITLE=AI Web Frontend
VITE_API_BASE_URL=http://localhost:3000
```

## VSCode 配置

### settings.json
```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.useFlatConfig": true
}
```

### extensions.json
推荐扩展列表：
- `Vue.volar` - Vue 语言支持
- `dbaeumer.vscode-eslint` - ESLint 集成
- `bradlc.vscode-tailwindcss` - Tailwind CSS 智能提示

## Git 提交规范

### Commitlint 配置
使用 `@commitlint/config-conventional` 规范提交信息格式：

```
<type>(<scope>): <subject>

type: feat | fix | docs | style | refactor | perf | test | chore | ci | build
scope: 可选，表示影响范围
subject: 简短描述
```

### Husky Git Hooks
- `pre-commit`: 运行 ESLint 检查
- `commit-msg`: 验证提交信息格式

### 相关依赖
- `husky` - Git hooks 管理
- `lint-staged` - 只检查暂存文件
- `@commitlint/cli` - 提交信息检查
- `@commitlint/config-conventional` - 常规提交规范
