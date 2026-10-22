# 个人博客实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Astro 从零搭建一个含 Hero 首页、文章、项目、关于我的静态个人博客，部署到 GitHub Pages。

**Architecture:** Markdown 文章经 Astro Content Collections（zod 校验）构建为纯静态 HTML；页面复用 BaseLayout 外壳；push 后 GitHub Actions 自动构建发布。

**Tech Stack:** Astro 5、纯 CSS（全局 + scoped + CSS 变量）、GitHub Pages / Actions。

**对应设计文档:** `docs/superpowers/specs/2026-10-19-personal-blog-design.md`

**执行方式说明（辅导模式）：** 开发者（用户）亲手写代码，教练（AI）讲解概念、review、协助调试。计划中的代码是"参考答案"——先自己尝试，卡住再对照。每个任务完成后经教练 review 再进下一个。

## Global Constraints

- 不使用 Tailwind 或任何 CSS 框架；样式全部为手写 CSS
- 不引入 React/Vue 等 UI 框架集成（纯 .astro 组件）
- 文章 frontmatter 字段：`title`（必填）、`date`（必填）、`tags`（数组）、`description`、`draft`（布尔，草稿不发布）
- 所有页面必须通过 `npx astro check` 与 `npm run build` 无报错
- Node.js 要求 >= 18（LTS 版本）
- 提交信息使用中文 + Conventional Commits 前缀（feat/fix/docs/chore）

---

### Task 0: 前置学习日（第 1 天）

**Files:** 无（产出在独立的练习项目中，不进入本仓库）

**目标：** 拿到 Astro 的"最小词汇量"：项目结构、`.astro` 文件、页面路由、组件、布局。

- [ ] **Step 1: 检查环境**

```bash
node --version   # 期望 >= v18
npm --version
```

若未安装或版本过低：去 nodejs.org 下载 LTS 版安装。

- [ ] **Step 2: 做官方教程的前半部分**

打开 Astro 官方教程 "Build a Blog"（https://docs.astro.build/zh-cn/tutorial/0-introduction/ ），完成：
- Unit 1（搭建：创建项目、git 仓库、dev 服务器）
- Unit 2（页面：创建页面、写 Markdown 页面、导航）
- Unit 3（组件：页眉/页脚组件、组件传 props、布局 Layout）

教程项目放在本仓库之外的目录，例如 `~/astro-tutorial/`。

- [ ] **Step 3: 验证学会了（不翻教程回答）**

向教练口头/文字回答：
1. `src/pages/` 里的文件和 URL 是什么关系？
2. `.astro` 文件里 `---` 围起来的部分是什么？浏览器会看到它吗？
3. 布局组件里的 `<slot />` 是干什么的？

答不出来就回教程对应章节重看，通过为止。

- [ ] **Step 4: 收尾（无需提交）**

教程项目保留，作为后续开发的"练习册/参考答案"。Unit 4-6（内容集合、RSS、部署）先不做，开发到对应环节时回查。

---

### Task 1: 项目脚手架（第 2 天）

**Files:**
- Create: 整个 Astro 项目骨架（`package.json`、`astro.config.mjs`、`tsconfig.json`、`src/`、`public/`）
- Create: `.gitignore`

**Interfaces:**
- Produces: 可运行的 Astro 项目，`npm run dev` 后能在 `http://localhost:4321` 访问

- [ ] **Step 1: 在当前仓库根目录创建 Astro 项目**

当前目录已有 git 仓库和 `docs/`，用官方脚手架的 `--template minimal` 在当前目录初始化：

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

（交互中确认在当前目录创建；`--no-git` 因为仓库已存在。）

- [ ] **Step 2: 启动 dev 服务器验证**

```bash
npm run dev
```

预期输出含 `Local: http://localhost:4321/`，浏览器打开能看到 Astro 默认页。Ctrl+C 停止。

- [ ] **Step 3: 安装类型检查工具**

```bash
npm install -D @astrojs/check typescript
npx astro check
```

预期：`0 errors, 0 warnings`（或仅有信息提示）。

- [ ] **Step 4: 精简默认模板**

把 `src/pages/index.astro` 改为最小内容：

```astro
---
---
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>我的博客</title>
  </head>
  <body>
    <h1>我的博客</h1>
  </body>
</html>
```

删除 `src/assets/` 和 `src/components/` 下用不到的模板文件（如有）。`npm run dev` 确认页面显示"我的博客"。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "chore: 初始化 Astro 项目（minimal 模板）"
```

---

### Task 2: BaseLayout 与全站外壳（第 2-3 天）

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `BaseLayout`，通过 `title` prop 设置标题，页面内容插入默认 slot；`Header` 含导航 `首页 / 文章 / 项目 / 关于我`（`/`, `/blog`, `/projects`, `/about`）

- [ ] **Step 1: 写全局样式**

`src/styles/global.css`：

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-accent: #2563eb;
  --color-muted: #6b7280;
  --max-width: 720px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  line-height: 1.7;
}

a { color: var(--color-accent); text-decoration: none; }
a:hover { text-decoration: underline; }
```

- [ ] **Step 2: 写 Header 组件**

`src/components/Header.astro`：

```astro
---
---
<header>
  <nav>
    <a href="/" class="logo">我的博客</a>
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/blog">文章</a></li>
      <li><a href="/projects">项目</a></li>
      <li><a href="/about">关于我</a></li>
    </ul>
  </nav>
</header>

<style>
  nav {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo { font-weight: bold; font-size: 1.2rem; color: var(--color-text); }
  ul { display: flex; gap: 1.5rem; list-style: none; }
</style>
```

- [ ] **Step 3: 写 Footer 组件**

`src/components/Footer.astro`：

```astro
---
const year = new Date().getFullYear();
---
<footer>
  <p>© {year} 我的博客 · Powered by Astro</p>
</footer>

<style>
  footer {
    max-width: var(--max-width);
    margin: 2rem auto 0;
    padding: 2rem 1rem;
    text-align: center;
    color: var(--color-muted);
    border-top: 1px solid #e5e7eb;
  }
</style>
```

- [ ] **Step 4: 写 BaseLayout**

`src/layouts/BaseLayout.astro`：

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props { title: string }
const { title } = Astro.props;
---
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: 首页改用 BaseLayout 并验证**

`src/pages/index.astro` 全文替换：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="首页 | 我的博客">
  <p>首页内容建设中。</p>
</BaseLayout>
```

运行 `npm run dev`，确认：导航四项可见、点击"文章"等会 404（正常，页面还没建）、页脚显示当前年份。再跑 `npx astro check` 无报错。

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: BaseLayout、Header、Footer 与全局样式"
```

---

### Task 3: 首页 Hero 区（第 3-4 天）

**Files:**
- Modify: `src/pages/index.astro`
- Create: `public/images/hero.jpg`（自备横版大图）

**Interfaces:**
- Produces: 首页首屏为满视口主题图 + 一句标语；向下滚动出现"最新文章"和"精选项目"两个占位区块（真实数据在 Task 10 接入）

- [ ] **Step 1: 准备主题图**

把一张横版大图（建议宽度 ≥ 1920px，压缩后 < 500KB，可用 squoosh.app 压缩）放到 `public/images/hero.jpg`。

- [ ] **Step 2: 写 Hero 与占位区块**

`src/pages/index.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="首页 | 我的博客">
  <section class="hero">
    <h1>一句话标语写在这里</h1>
    <p class="hint">向下滚动 ↓</p>
  </section>

  <section class="recent">
    <h2>最新文章</h2>
    <p>（Task 10 接入真实文章列表）</p>
  </section>

  <section class="featured">
    <h2>精选项目</h2>
    <p>（Task 10 接入真实项目数据）</p>
  </section>
</BaseLayout>

<style>
  .hero {
    height: 100vh;
    background: url('/images/hero.jpg') center / cover no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }
  .hero h1 { font-size: 2.5rem; }
  .hint { margin-top: 2rem; opacity: 0.85; }
  .recent, .featured {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 3rem 1rem 0;
  }
</style>
```

注意：BaseLayout 的 Header 会出现在 Hero 上方。若想让导航悬浮在图上，可后续打磨（Task 11），本任务先保证结构与图片正确。

- [ ] **Step 3: 验证**

`npm run dev`：首屏是满屏主题图（文字有阴影可读）；向下滚动能看到两个占位区块。窄屏（浏览器开发者工具切手机视图）图片不变形。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: 首页 Hero 主题图与滚动区块占位"
```

---

### Task 4: 内容集合与示例文章（第 5 天）

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/first-post.md`
- Create: `src/content/blog/second-post.md`

**Interfaces:**
- Produces: `blog` 集合；schema 为 `{ title: string, date: Date, tags: string[], description: string, draft: boolean(默认 false) }`。后续任务通过 `getCollection('blog')` 读取

- [ ] **Step 1: 定义集合**

先安装 zod（Astro 7 起 `z` 不再从 `astro:content` 导出，需直接从 zod 包导入）：

```bash
npm install zod
```

`src/content.config.ts`：

```ts
import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    description: z.string().default(''),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: 写两篇示例文章**

`src/content/blog/first-post.md`：

```markdown
---
title: "第一篇博客"
date: 2026-10-19
tags: ["随笔", "建站"]
description: "我的 Astro 博客开张了。"
---

这里是正文。支持 **Markdown** 的全部语法。

## 小标题

- 列表项一
- 列表项二
```

`src/content/blog/second-post.md`（日期更新一天，tags 不同，便于测试排序与标签）：

```markdown
---
title: "第二篇博客"
date: 2026-10-20
tags: ["前端"]
description: "学习 Astro 的第二天。"
draft: false
---

第二篇正文。
```

- [ ] **Step 3: 验证 schema 生效**

故意把 `date` 改成非法值（如 `date: 昨天`），跑 `npm run build`，预期构建报错并指出 frontmatter 校验失败——这就是 zod 在替你守门。改回正确值后构建通过。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: blog 内容集合与两篇示例文章"
```

---

### Task 5: 文章详情页（第 6 天）

**Files:**
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/layouts/BlogPost.astro`

**Interfaces:**
- Consumes: Task 4 的 `blog` 集合（`getCollection('blog')`，entry 有 `id`、`data.title/date/tags/description/draft`）
- Produces: 路由 `/blog/<id>`；`BlogPost` 布局接收 `title`、`date`、`tags` props，正文经默认 slot 渲染

- [ ] **Step 1: 写文章布局**

`src/layouts/BlogPost.astro`：

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  date: Date;
  tags: string[];
}
const { title, date, tags } = Astro.props;

const formatted = date.toLocaleDateString('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric',
});
---
<BaseLayout title={`${title} | 我的博客`}>
  <article>
    <h1>{title}</h1>
    <p class="meta">
      <time datetime={date.toISOString()}>{formatted}</time>
      {tags.map((tag) => <a class="tag" href={`/tags/${tag}`}>{tag}</a>)}
    </p>
    <div class="content">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  article { max-width: var(--max-width); margin: 0 auto; padding: 2rem 1rem; }
  .meta { color: var(--color-muted); margin: 0.5rem 0 2rem; }
  .tag { margin-left: 0.5rem; font-size: 0.9rem; }
  .content :global(h2) { margin-top: 2rem; }
  .content :global(p) { margin: 1rem 0; }
</style>
```

- [ ] **Step 2: 写动态路由页**

`src/pages/blog/[...slug].astro`：

```astro
---
import { getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<BlogPost title={post.data.title} date={post.data.date} tags={post.data.tags}>
  <Content />
</BlogPost>
```

- [ ] **Step 3: 验证**

`npm run dev`，访问 `http://localhost:4321/blog/first-post`：标题、中文格式日期、标签链接、正文渲染正确。`npx astro check` 与 `npm run build` 均无报错。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: 文章详情页与 BlogPost 布局"
```

---

### Task 6: 文章列表页与标签页（第 6-7 天）

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/tags/index.astro`

**Interfaces:**
- Consumes: `blog` 集合（Task 4）
- Produces: `PostCard` 组件（props：`url`、`title`、`date`、`description`）；路由 `/blog`（按日期倒序）、`/tags`（标签索引）、`/tags/<tag>`（该标签下的文章）

- [ ] **Step 1: 写 PostCard 组件**

`src/components/PostCard.astro`：

```astro
---
interface Props {
  url: string;
  title: string;
  date: Date;
  description: string;
}
const { url, title, date, description } = Astro.props;
const formatted = date.toLocaleDateString('zh-CN');
---
<article class="card">
  <a href={url}><h3>{title}</h3></a>
  <p class="desc">{description}</p>
  <time datetime={date.toISOString()}>{formatted}</time>
</article>

<style>
  .card { padding: 1rem 0; border-bottom: 1px solid #e5e7eb; }
  .card h3 { display: inline; color: var(--color-text); }
  .desc { color: var(--color-muted); margin: 0.25rem 0; }
  time { font-size: 0.85rem; color: var(--color-muted); }
</style>
```

- [ ] **Step 2: 写文章列表页**

`src/pages/blog/index.astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="文章 | 我的博客">
  <section class="list">
    <h1>全部文章</h1>
    {posts.map((post) => (
      <PostCard
        url={`/blog/${post.id}`}
        title={post.data.title}
        date={post.data.date}
        description={post.data.description}
      />
    ))}
  </section>
</BaseLayout>

<style>
  .list { max-width: var(--max-width); margin: 0 auto; padding: 2rem 1rem; }
</style>
```

- [ ] **Step 3: 写标签索引页**

`src/pages/tags/index.astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = await getCollection('blog', ({ data }) => !data.draft);
const tags = [...new Set(posts.flatMap((post) => post.data.tags))].sort();
---
<BaseLayout title="标签 | 我的博客">
  <section class="tags">
    <h1>标签</h1>
    <ul>
      {tags.map((tag) => <li><a href={`/tags/${tag}`}>{tag}</a></li>)}
    </ul>
  </section>
</BaseLayout>

<style>
  .tags { max-width: var(--max-width); margin: 0 auto; padding: 2rem 1rem; }
  ul { display: flex; gap: 1rem; list-style: none; flex-wrap: wrap; }
</style>
```

- [ ] **Step 4: 写单标签页**

`src/pages/tags/[tag].astro`：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];
  return tags.map((tag) => ({
    params: { tag },
    props: {
      posts: posts
        .filter((post) => post.data.tags.includes(tag))
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime()),
    },
  }));
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---
<BaseLayout title={`标签：${tag} | 我的博客`}>
  <section class="list">
    <h1>标签：{tag}</h1>
    {posts.map((post) => (
      <PostCard
        url={`/blog/${post.id}`}
        title={post.data.title}
        date={post.data.date}
        description={post.data.description}
      />
    ))}
  </section>
</BaseLayout>

<style>
  .list { max-width: var(--max-width); margin: 0 auto; padding: 2rem 1rem; }
</style>
```

- [ ] **Step 5: 验证**

`npm run dev`：
- `/blog` 两篇文章按日期倒序（第二篇在上）
- 文章详情页点标签跳到 `/tags/随笔`，列表只含该标签文章
- `/tags` 列出全部标签
- `npx astro check` 与 `npm run build` 无报错

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 文章列表、标签索引与单标签页"
```

---

### Task 7: 项目展示页（第 8 天）

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/projects.astro`

**Interfaces:**
- Produces: `projects` 数组，元素类型 `{ name: string; description: string; techStack: string[]; url: string; featured: boolean }`（`featured` 供 Task 10 首页精选使用）；`ProjectCard` props 同该类型

- [ ] **Step 1: 写项目数据**

`src/data/projects.ts`（先放占位数据，之后换成真实项目）：

```ts
export interface Project {
  name: string;
  description: string;
  techStack: string[];
  url: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    name: "个人博客",
    description: "基于 Astro 的静态博客，正在开发中。",
    techStack: ["Astro", "CSS"],
    url: "https://github.com/你的用户名/你的仓库",
    featured: true,
  },
  {
    name: "后端练习项目",
    description: "学习后端开发时的练习项目。",
    techStack: ["Java"],
    url: "https://github.com/你的用户名/Backendjh",
    featured: false,
  },
];
```

- [ ] **Step 2: 写 ProjectCard 组件**

`src/components/ProjectCard.astro`：

```astro
---
interface Props {
  name: string;
  description: string;
  techStack: string[];
  url: string;
}
const { name, description, techStack, url } = Astro.props;
---
<article class="card">
  <a href={url} target="_blank" rel="noopener"><h3>{name}</h3></a>
  <p class="desc">{description}</p>
  <ul class="stack">
    {techStack.map((tech) => <li>{tech}</li>)}
  </ul>
</article>

<style>
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.25rem;
  }
  .card h3 { display: inline; color: var(--color-text); }
  .desc { color: var(--color-muted); margin: 0.5rem 0; }
  .stack { display: flex; gap: 0.5rem; list-style: none; flex-wrap: wrap; }
  .stack li {
    font-size: 0.8rem;
    background: #f3f4f6;
    border-radius: 4px;
    padding: 0.15rem 0.5rem;
  }
</style>
```

- [ ] **Step 3: 写项目页**

`src/pages/projects.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { projects } from '../data/projects';
---
<BaseLayout title="项目 | 我的博客">
  <section class="projects">
    <h1>项目</h1>
    <div class="grid">
      {projects.map((p) => (
        <ProjectCard
          name={p.name}
          description={p.description}
          techStack={p.techStack}
          url={p.url}
        />
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .projects { max-width: var(--max-width); margin: 0 auto; padding: 2rem 1rem; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
```

- [ ] **Step 4: 验证与提交**

`/projects` 页面卡片正常显示、外链新标签页打开。`npx astro check && npm run build` 无报错。

```bash
git add -A
git commit -m "feat: 项目展示页"
```

---

### Task 8: 关于我页（第 8-9 天）

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: 写页面（内容为个人真实介绍，下方为结构示例）**

`src/pages/about.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="关于我 | 我的博客">
  <section class="about">
    <h1>关于我</h1>
    <p>（自我介绍：你是谁、在学什么、为什么写博客。）</p>
    <h2>技能</h2>
    <p>（如：后端开发基础、正在学习前端。）</p>
    <h2>联系我</h2>
    <p>（GitHub / 邮箱等。）</p>
  </section>
</BaseLayout>

<style>
  .about { max-width: var(--max-width); margin: 0 auto; padding: 2rem 1rem; }
  h2 { margin-top: 2rem; }
  p { margin: 0.5rem 0; }
</style>
```

- [ ] **Step 2: 验证与提交**

`/about` 显示正常；`npx astro check && npm run build` 无报错。

```bash
git add -A
git commit -m "feat: 关于我页面"
```

---

### Task 9: 首页接入真实数据（第 9-10 天）

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `blog` 集合（Task 4）、`projects` 数组（Task 7）、`PostCard`（Task 6）、`ProjectCard`（Task 7）

- [ ] **Step 1: 替换占位区块**

`src/pages/index.astro` 全文：

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { projects } from '../data/projects';

const recentPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 5);

const featuredProjects = projects.filter((p) => p.featured);
---
<BaseLayout title="首页 | 我的博客">
  <section class="hero">
    <h1>一句话标语写在这里</h1>
    <p class="hint">向下滚动 ↓</p>
  </section>

  <section class="recent">
    <h2>最新文章</h2>
    {recentPosts.map((post) => (
      <PostCard
        url={`/blog/${post.id}`}
        title={post.data.title}
        date={post.data.date}
        description={post.data.description}
      />
    ))}
    <p class="more"><a href="/blog">全部文章 →</a></p>
  </section>

  <section class="featured">
    <h2>精选项目</h2>
    <div class="grid">
      {featuredProjects.map((p) => (
        <ProjectCard
          name={p.name}
          description={p.description}
          techStack={p.techStack}
          url={p.url}
        />
      ))}
    </div>
    <p class="more"><a href="/projects">全部项目 →</a></p>
  </section>
</BaseLayout>

<style>
  .hero {
    height: 100vh;
    background: url('/images/hero.jpg') center / cover no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }
  .hero h1 { font-size: 2.5rem; }
  .hint { margin-top: 2rem; opacity: 0.85; }
  .recent, .featured {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 3rem 1rem 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  .more { margin: 1rem 0 3rem; }
</style>
```

- [ ] **Step 2: 验证与提交**

首页滚动后显示真实文章（最多 5 篇、倒序）与 `featured: true` 的项目；链接可点。`npx astro check && npm run build` 无报错。

```bash
git add -A
git commit -m "feat: 首页接入最新文章与精选项目"
```

---

### Task 10: 样式打磨与响应式（第 10 天）

**Files:**
- Modify: `src/styles/global.css`、`src/components/Header.astro`、`src/pages/index.astro` 及任何观感不佳的组件

- [ ] **Step 1: 移动端导航检查**

开发者工具切手机视图（375px 宽）：导航四项不挤压换行错乱；必要时给 `Header` 的 `ul` 加 `@media (max-width: 480px) { ul { gap: 0.75rem; } }`。

- [ ] **Step 2: Hero 区导航可读性**

若导航文字压在主题图上看不清，给 `Header` 加半透明白底或把导航链接颜色调深，确保两种背景下都可读。

- [ ] **Step 3: 全文走查**

逐页检查 `/`、`/blog`、`/blog/first-post`、`/tags`、`/projects`、`/about` 在桌面和手机视图下的间距、字号、对齐。逐项修。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "style: 响应式与整体样式打磨"
```

---

### Task 11: 部署到 GitHub Pages（第 11 天）

**Files:**
- Modify: `astro.config.mjs`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 创建 GitHub 仓库并推送**

在 GitHub 新建公开仓库（如 `blog`），然后：

```bash
git remote add origin https://github.com/你的用户名/blog.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: 配置站点地址**

`astro.config.mjs`：

```js
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://你的用户名.github.io',
  base: '/blog',
});
```

（若仓库名就是 `你的用户名.github.io`，则去掉 `base` 一行，`site` 不变。）

- [ ] **Step 3: 写部署工作流**

`.github/workflows/deploy.yml`（Astro 官方 Pages 工作流）：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: 开启 Pages 并验证**

仓库 Settings → Pages → Source 选 "GitHub Actions"。push 后在 Actions 标签页看工作流跑通，访问 `https://你的用户名.github.io/blog/` 确认线上页面与本地一致（重点检查：样式加载、文章链接、`/blog` 子路径正常——`base` 配置错误的典型症状是 CSS 404）。

```bash
git add -A
git commit -m "chore: 配置 GitHub Pages 部署"
git push
```

---

### Task 12: 加分项（第 12-14 天，按优先级选做）

**优先级 1 — giscus 评论：**

1. 仓库设为 public，安装 giscus GitHub App，开启 Discussions
2. 在 https://giscus.app/zh-CN 生成配置
3. 新建 `src/components/Comments.astro`，把生成的 `<script>` 包进组件
4. 在 `src/layouts/BlogPost.astro` 的 `<slot />` 之后加 `<Comments />`
5. 验证：文章页底部出现评论区，GitHub 账号可留言

**优先级 2 — 暗色模式：** 用 `prefers-color-scheme` 媒体查询覆盖 `:root` 里的 CSS 变量：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-text: #f3f4f6;
    --color-muted: #9ca3af;
    --color-accent: #60a5fa;
  }
}
```

注意同步处理组件里硬编码的 `#e5e7eb`、`#f3f4f6` 等颜色（抽成变量）。

**优先级 3 — RSS：** `npm install @astrojs/rss`，按官方文档新建 `src/pages/rss.xml.ts`，遍历 `blog` 集合输出。

**优先级 4 — SEO：** `@astrojs/sitemap` + 各页面 `<meta name="description">`。

每完成一项：验证 → 单独提交（`feat: 接入 giscus 评论` 等）。

---

## Self-Review 记录

- **Spec 覆盖：** 设计文档第 3 节 5 个页面 → Task 3/5/6/7/8/9 ✅；第 4 节 4 个组件 → Task 2/5/6/7 ✅（BlogPost 在 Task 5，PostCard 在 Task 6，ProjectCard 在 Task 7，BaseLayout 在 Task 2）；第 5 节内容模型 → Task 4 ✅；第 6 节质量保障 → 各任务验证步骤 ✅；第 7 节部署 → Task 11 ✅；第 8 节加分项 → Task 12 ✅；第 9 节学习策略 → Task 0 ✅。
- **类型一致性：** `PostCard` props（url/title/date/description）在 Task 6 定义，Task 9 复用一致；`Project` 类型 Task 7 定义，Task 9 使用 `featured` 字段一致；frontmatter 字段全计划一致。
- **无占位符：** 所有代码步骤含完整代码；唯一留给用户填写的是个人化内容（标语、关于我文字、GitHub 用户名），属预期输入。
