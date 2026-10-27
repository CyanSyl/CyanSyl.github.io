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
        description: "基于 Astro 的静态博客，不断更新中。",
        techStack: ["Astro", "CSS"],
        url: "https://github.com/CyanSyl/CyanSyl.github.io",
        featured: true,
    },
    {
        name: "失物招领后端练习项目",
        description: "学习后端开发时的第一个练习项目。",
        techStack: ["Go"],
        url: "https://github.com/PengZX1945/Backendjh",
        featured: true,
    },
];