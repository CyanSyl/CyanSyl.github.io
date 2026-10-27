export interface Project {
    name: string;
    description: string;
    techStack: string[];
    url: string;
    featured: boolean;
    updatedAt: string; // 最近更新日期，格式 YYYY-MM-DD，手动维护
}

export const projects: Project[] = [
    {
        name: "个人博客",
        description: "基于 Astro 的静态博客，正在开发中。",
        techStack: ["Astro", "CSS"],
        url: "https://github.com/CyanSyl/CyanSyl.github.io",
        featured: true,
        updatedAt: "2026-10-28",
    },
    {
        name: "失物招领后端练习项目",
        description: "学习后端开发时的第一个练习项目。",
        techStack: ["Go"],
        url: "https://github.com/PengZX1945/Backendjh",
        featured: false,
        updatedAt: "2026-10-28", // TODO: 改成实际的最后更新时间
    },
];
