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

// 想法流：不要标题，一段话 + 日期即可
// type: dig = 挖坑（待写选题），fill = 填坑（写完了，link 指向文章），不写 = 普通想法
const notes = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
    schema: z.object({
        date: z.coerce.date(),
        type: z.enum(['note', 'dig', 'fill']).default('note'),
        link: z.string().optional(),
        tags: z.array(z.string()).default([]),
    }),
});

export const collections = { blog, notes };