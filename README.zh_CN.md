# Mutation Inspector

[English README](README.md)

Mutation Inspector 是一个基于 Vite + React 的单页应用，用来浏览突变相关的分子链条和表型映射。它把五个链条矩阵和 21 个现象视图连接起来，支持在链条阶段、矩阵 entry、相关分子机制和 DOI 文献引用之间来回定位。

## 功能

- 五条分子链条矩阵浏览，包含动作/物阶段卡片。
- 阶段筛选支持多选；不选择任何阶段时显示全部 entry。
- entry 高亮逻辑跟随显式矩阵标记。
- 原发/继发动作与产物标记使用对应颜色。
- 完整矩阵表视图，追加现象学和分子机制等列。
- 21 个现象映射视图，带相关 entry 链条图。
- 文献面板使用 DOI 或来源链接，不使用通用搜索结果链接。
- UI 支持 `en_US` 和 `zh_CN`，可在页头切换语言。

## 快速开始

```bash
npm install
npm run dev
```

打开本地 Vite 页面：

```text
http://localhost:5173/
```

## 构建

```bash
npm run build
```

生产构建输出到 `dist/`。

## 项目结构

```text
index.html                 Vite HTML 外壳
index.jsx                  React 挂载入口
main.jsx                   UI 状态、筛选、i18n 和渲染
mutationData.js            矩阵行、现象行和文献数据
.github/workflows/deploy.yml
.codex/                    Codex 状态和设置交接
.agents/                   Agent 交接和设置
```

## 国际化

应用 UI 层支持：

- `en_US`
- `zh_CN`

生物学矩阵源数据保留原始的中英混合文本。导航、控件、状态文案、详情面板标题、表格扩展列和 marker 术语会随语言切换。

## 校验

常用本地检查：

```bash
npm run build
npx --yes esbuild main.jsx --bundle --format=esm --outfile=/tmp/mutation-inspector-check.js --external:react --external:framer-motion --external:lucide-react --log-level=warning
```

## 许可证

MIT。见 [LICENSE](LICENSE)。
