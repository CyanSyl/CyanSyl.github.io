# 弈川的博客

基于 [Astro](https://astro.build) 的静态个人博客，部署于 GitHub Pages。

线上地址：https://CyanSyl.github.io

## 功能

- Markdown 文章（Zod 校验 frontmatter、草稿、标签、归档）
- Pagefind 全文搜索（构建期生成索引，零后端）
- 文章页目录（scroll-spy）、上下篇导航、字数与阅读时长、代码块复制
- 月夜深蓝主题：Hero 动态壁纸视频、Canvas 星空与流星、毛玻璃面板
- 全站尊重 `prefers-reduced-motion`

## 开发

```sh
npm install
npm run dev       # 本地开发（热更新）
npm run build     # 构建（含类型检查与搜索索引）
npm run preview   # 预览构建产物
```

## 写作

在 `src/content/blog/` 新建 `.md` 文件，frontmatter 格式：

```md
---
title: "文章标题"
date: 2026-10-27
tags: ["随笔"]
description: "一句话摘要"
---

正文……
```

push 到 `main` 分支后 GitHub Actions 自动部署。

## 文档

- `docs/部署指南.md`：部署步骤、自定义域名与备案方案
- `docs/风格设计.md` / `docs/样式实施记录.md`：视觉规范与变更记录
- `docs/语法笔记.md`：前端语法学习笔记
