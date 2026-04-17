<div align="center">

<img src="https://img.shields.io/badge/Arona_Tech-Portfolio-6c63ff?style=for-the-badge&labelColor=1e1e32" alt="Arona Tech Portfolio" />

<br /><br />

<img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/D3.js-7.9-F9A03C?style=flat-square&logo=d3dotjs&logoColor=white" alt="D3.js" />
<img src="https://img.shields.io/badge/jsPDF-4.2-EC1C24?style=flat-square&logo=adobeacrobatreader&logoColor=white" alt="jsPDF" />
<img src="https://img.shields.io/badge/PHP_API-SMTP-777BB4?style=flat-square&logo=php&logoColor=white" alt="PHP API" />
<img src="https://img.shields.io/badge/Lucide-Icons-f56565?style=flat-square&logo=feather&logoColor=white" alt="Lucide" />

<br /><br />

**A glassmorphism one-page portfolio SPA for Arona Jafari — Backend Engineer & DevSecOps Builder.**

<a href="https://aronatech.cloud">aronatech.cloud</a>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [PDF Resume Generator](#pdf-resume-generator)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

A single-page portfolio application built with **Vite + React 19** featuring a dark glassmorphism design, lightweight scroll-triggered animations, an interactive D3 radar chart, a client-side PDF resume generator, and a secure PHP SMTP contact API for shared hosting.

**Live:** [aronatech.cloud](https://aronatech.cloud)

---

## Features

| Feature | Description |
|---|---|
| **Glassmorphism UI** | Frosted-glass cards, animated background blobs, noise overlay |
| **Scroll Animations** | IntersectionObserver-powered lightweight reveal animations with reduced-motion support |
| **D3 Radar Chart** | Interactive spider chart visualizing core skill proficiencies |
| **Skill Bars** | Animated progress bars grouped by technology category |
| **PDF Resume** | One-click US Letter resume generation with jsPDF — no server needed |
| **Contact API** | Contact form posts to `/api/contact` (PHP + PHPMailer SMTP) |
| **Responsive** | Mobile-first with hamburger nav, adaptive grid layouts |
| **Single Config** | All content (bio, skills, projects, contact) lives in `constants.js` |
| **Lucide Icons** | Lightweight SVG icons throughout the interface |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build Tool | Vite 7.3 |
| UI Framework | React 19.2 |
| Visualization | D3.js 7.9 |
| Animations | Custom CSS reveal system + IntersectionObserver |
| Icons | Lucide React |
| PDF Generation | jsPDF 4.2 |
| Contact Delivery | PHP + PHPMailer (SMTP) |
| Styling | CSS Custom Properties (no Tailwind, no CSS modules) |
| Linting | ESLint 9 with React hooks + refresh plugins |

---

## Project Structure

```
aronatech-portfolio/
  public/                    Static assets (favicon, profile photo)
  src/
    config/
      constants.js           Central content configuration
    components/
      RadarChart.jsx         D3 interactive spider chart
    hooks/
      useInView.js           IntersectionObserver scroll hook
    sections/
      Navbar.jsx             Sticky glass navbar + mobile menu
      Hero.jsx               Hero with CTAs + profile photo
      Skills.jsx             Radar chart + skill bar cards
      Projects.jsx           Filterable project grid
      About.jsx              Narrative + highlight bullets
      Contact.jsx            Contact form + contact cards
      Footer.jsx             Copyright + social links
    utils/
      generateResumePDF.js   Client-side PDF resume builder
      downloadResume.js      Lazy loader for PDF generator
      contactApi.js          Frontend contact API helper
    App.jsx                  Root component
    App.css                  All component styles
    index.css                Global reset, variables, blobs
    main.jsx                 Entry point
  public/
    api/
      contact.php            SMTP mail endpoint (PHPMailer)
    .htaccess                API + SPA rewrite rules
  index.html
  vite.config.js
  package.json
```

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# Clone the repository
git clone https://github.com/arounatech/aronatech-portfolio.git
cd aronatech-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Configuration

All visible content is managed through a single file:

```
src/config/constants.js
```

This includes personal info, navigation links, skill groups, radar chart data, projects, about section, contact labels, and footer content. Edit this file to fully customise the portfolio without touching any component code.

---

## PDF Resume Generator

The portfolio includes a client-side resume generator (`src/utils/generateResumePDF.js`) that builds a professional US Letter PDF from the same `constants.js` data:

- Clean two-section header with name, role, and contact details
- Highlighted section headings with accent colour bars
- Two-column technical skills layout
- Project listings with tech stack tags
- Key achievements as bullet points
- No server or external API required

The download button is available in the **Hero section** and in the **mobile navigation menu**.

---
## License

This project is proprietary to **Arona Tech** All rights reserved.
