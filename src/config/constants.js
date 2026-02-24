/**
 * PORTFOLIO — Central configuration object.
 * Edit ONLY this file to change every piece of visible content on the site.
 */

const PORTFOLIO = {
  /* ─── Personal ─────────────────────────────────────────────── */
  personal: {
    name: "Arona Jafari",
    role: "Backend Engineer & DevSecOps Builder",
    bio: "I architect resilient backend systems, harden infrastructure with DevSecOps practices, and ship scalable APIs that serve millions of requests. Security isn't an afterthought — it's baked into every layer of the stack I build.",
    location: "Hamidiye, 34408 Kağıthane/İstanbul",
    email: "aronatech.co@gmail.com",
    socials: {
      github: "https://github.com/arounatech",
      linkedin: "https://linkedin.com/in/aronatech",
      email: "mailto:aronatech.co@gmail.com",
    },
  },

  /* ─── Navigation ───────────────────────────────────────────── */
  nav: [
    { label: "Home", href: "#hero" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  /* ─── Skills ───────────────────────────────────────────────── */
  skillGroups: [
    {
      group: "Server Stacks",
      skills: [
        { name: "LAMP", level: 95 },
        { name: "LEMP", level: 92 },
        { name: "MERN", level: 85 },
      ],
    },
    {
      group: "PHP Frameworks",
      skills: [
        { name: "Laravel", level: 97 },
        { name: "Symfony", level: 90 },
        { name: "CodeIgniter", level: 88 },
        { name: "Yii2", level: 82 },
        { name: "CakePHP", level: 78 },
        { name: "Laminas/Zend", level: 80 },
        { name: "Slim", level: 85 },
        { name: "Phalcon", level: 75 },
        { name: "FuelPHP", level: 70 },
      ],
    },
    {
      group: "Languages & Runtimes",
      skills: [
        { name: "Golang", level: 88 },
        { name: "PHP", level: 96 },
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 86 },
        { name: "Node.js", level: 89 },
      ],
    },
    {
      group: "Frameworks & Libraries",
      skills: [
        { name: "Next.js", level: 83 },
        { name: "React", level: 85 },
        { name: "Express.js", level: 90 },
      ],
    },
    {
      group: "DevOps & DevSecOps",
      skills: [
        { name: "Docker", level: 94 },
        { name: "Kubernetes", level: 88 },
        { name: "Ansible", level: 82 },
        { name: "Terraform", level: 80 },
        { name: "CI/CD Pipelines", level: 90 },
        { name: "Linux Admin", level: 93 },
      ],
    },
    {
      group: "Databases",
      skills: [
        { name: "MySQL/MariaDB", level: 94 },
        { name: "PostgreSQL", level: 90 },
        { name: "MongoDB", level: 86 },
        { name: "Redis", level: 88 },
      ],
    },
  ],

  /** Flat list used by the D3 radar chart — pick the most representative ones. */
  radarSkills: [
    { axis: "PHP / Laravel", value: 0.97 },
    { axis: "Golang", value: 0.88 },
    { axis: "Node.js", value: 0.89 },
    { axis: "Docker / K8s", value: 0.91 },
    { axis: "Databases", value: 0.92 },
    { axis: "DevSecOps", value: 0.86 },
    { axis: "React / Next", value: 0.84 },
    { axis: "CI/CD", value: 0.90 },
  ],

  /* ─── Projects ─────────────────────────────────────────────── */
  projects: [
    {
      name: "iCanada",
      description:
        "A full-stack immigration platform built with Laravel APIs and a Next.js frontend, containerized with Docker for seamless deployment and scalability.",
      tags: ["Backend", "Full-Stack"],
      stack: ["Laravel", "Next.js", "Docker"],
      year: 2025,
    },
    {
      name: "Wininmin",
      description:
        "Live-streaming platform featuring a custom RTMP server implementation, powered by a Laravel backend and Next.js frontend for real-time content delivery.",
      tags: ["Backend", "Full-Stack", "Streaming"],
      stack: ["Laravel", "Next.js", "Custom RTMP"],
      year: 2025,
    },
    {
      name: "Overlord Team",
      description:
        "Corporate web platform for Overlord Team LTD., built with a Go backend for high-performance APIs and a Next.js frontend delivering a fast, modern user experience.",
      tags: ["Backend", "Full-Stack"],
      stack: ["Next.js", "Golang"],
      domain: "https://overlord.team",
      year: 2024,
    },
    {
      name: "Planio",
      description:
        "A self-developed task and project management system with boards, checklists, and team collaboration features, built on a CodeIgniter backend and Angular frontend.",
      tags: ["Full-Stack", "Productivity"],
      stack: ["Angular", "CodeIgniter"],
      year: 2024,
    },
    {
      name: "Personal Accounter",
      description:
        "A personal accounting and finance tracking application built on a custom DDD-based PHP framework designed and developed from scratch.",
      tags: ["Backend", "Open-Source"],
      stack: ["PHP", "Custom DDD Framework"],
      domain: "https://github.com/moonshadowrev/PersonalAccounter",
      year: 2024,
    },
    {
      name: "FCM Panel",
      description:
        "A Firebase Cloud Messaging management panel for sending and scheduling push notifications, built with Express.js.",
      tags: ["Backend", "Open-Source"],
      stack: ["Express.js"],
      domain: "https://github.com/moonshadowrev/FCMPanel",
      year: 2024,
    },
  ],

  /* ─── About ────────────────────────────────────────────────── */
  about: {
    narrative:
      "With over years of hands-on experience engineering backend platforms, I've developed a sharp focus on building systems that are not only performant but inherently secure. From bare-metal Linux servers to fully orchestrated Kubernetes clusters, I've operated across every layer of the stack — writing application code, designing database schemas, configuring CI/CD pipelines, and hardening infrastructure through DevSecOps automation.",
    highlights: [
      "Architected APIs serving millions of daily requests with sub-100 ms P99 latency.",
      "Built custom Docker + Kubernetes deployment pipelines with automated security gates.",
      "Implemented zero-trust network policies and secrets management with Vault & Terraform.",
      "Proficient across 9+ PHP frameworks — from Laravel to Phalcon.",
      "Passionate about open-source tooling and infrastructure-as-code practices.",
    ],
  },

  /* ─── Contact Form Labels ──────────────────────────────────── */
  contact: {
    heading: "Get In Touch",
    subheading: "Have a project in mind or want to collaborate? Drop me a message.",
    fields: {
      name: "Your Name",
      email: "Email Address",
      message: "Message",
    },
    submitLabel: "Send Message",
    successMessage: "Thanks! Your message has been sent.",
  },

  /* ─── Footer ───────────────────────────────────────────────── */
  footer: {
    copy: `© ${new Date().getFullYear()} Arona Jafari. All rights reserved.`,
    links: [
      { label: "GitHub", href: "https://github.com/arounatech" },
      { label: "LinkedIn", href: "https://linkedin.com/in/aronatech" },
    ],
  },
};

export default PORTFOLIO;
