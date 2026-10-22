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