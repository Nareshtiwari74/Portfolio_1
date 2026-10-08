import { si, skill } from "./techIcons";

/** Naresh's full confirmed tech stack, in the supplied order. */
export const techStack = [
  { name: "Java", icon: skill("java"), desc: "Language" },
  { name: "Python", icon: skill("py"), desc: "Language" },
  { name: "JavaScript", icon: skill("js"), desc: "Language" },
  { name: "SQL", icon: "/tech-icons/sql.svg", desc: "Query Language" },
  { name: "Kotlin", icon: skill("kotlin"), desc: "Language" },
  { name: "Bash", icon: skill("bash"), desc: "Shell Scripting" },
  { name: "React", icon: skill("react"), desc: "UI Library" },
  { name: "HTML5", icon: skill("html"), desc: "Markup Language" },
  { name: "CSS3", icon: skill("css"), desc: "Styling" },
  { name: "Spring Boot", icon: skill("spring"), desc: "Framework" },
  {
    name: "Spring Security",
    icon: si("springsecurity"),
    desc: "Authentication & Authorization",
  },
  { name: "Hibernate", icon: skill("hibernate"), desc: "ORM" },
  { name: "FastAPI", icon: skill("fastapi"), desc: "Framework" },
  { name: "PostgreSQL", icon: skill("postgres"), desc: "Relational Database" },
  { name: "MySQL", icon: skill("mysql"), desc: "Relational Database" },
  { name: "MongoDB", icon: skill("mongodb"), desc: "Document Database" },
  { name: "Redis", icon: skill("redis"), desc: "In-Memory Data Store" },
  { name: "Kafka", icon: skill("kafka"), desc: "Event Streaming" },
  { name: "Docker", icon: skill("docker"), desc: "Containers" },
  {
    name: "Kubernetes",
    icon: skill("kubernetes"),
    desc: "Container Orchestration",
  },
  { name: "Git", icon: skill("git"), desc: "Version Control" },
  { name: "GitHub", icon: skill("github"), desc: "Code Hosting" },
  { name: "Linux", icon: skill("linux"), desc: "Operating System" },
  { name: "Jenkins", icon: skill("jenkins"), desc: "CI/CD" },
  { name: "Postman", icon: skill("postman"), desc: "API Testing" },
  { name: "Swagger", icon: si("swagger"), desc: "API Documentation" },
];

/** Original confirmed main skills keep the hero and About summary concise. */
export const mainSkills = [
  { name: "Java", icon: skill("java"), desc: "Language" },
  { name: "Spring Boot", icon: skill("spring"), desc: "Framework" },
  {
    name: "REST APIs",
    icon: "/tech-icons/rest-api.svg",
    desc: "API Development",
  },
  { name: "SQL", icon: "/tech-icons/sql.svg", desc: "Query Language" },
  { name: "React", icon: skill("react"), desc: "UI Library" },
];

type IntroductionPart = {
  text: string;
  icon?: string;
  emphasized?: boolean;
};

/** Naresh's supplied introduction, shared by the hero, About, and metadata. */
export const introduction: IntroductionPart[] = [
  { text: "I build backend systems and full-stack applications using " },
  { text: "Java", icon: skill("java") },
  { text: ", " },
  { text: "Spring Boot", icon: skill("spring") },
  { text: ", " },
  { text: "React", icon: skill("react") },
  { text: ", and " },
  { text: "SQL", icon: "/tech-icons/sql.svg" },
  { text: ", with a strong focus on " },
  { text: "REST APIs", icon: "/tech-icons/rest-api.svg" },
  { text: ", " },
  { text: "Performance", emphasized: true },
  { text: ", and " },
  { text: "User Experience", emphasized: true },
  { text: "." },
];

export const introductionText = introduction.map((part) => part.text).join("");
