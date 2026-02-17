
# RusingAcademy Learning Ecosystem

![RusingAcademy Logo](https://www.rusingacademy.com/icons/icon-192x192.png)

## Introduction

The RusingAcademy Learning Ecosystem is a premium, integrated learning platform dedicated to bilingual excellence and professional language development, with a primary focus on Canadian public servants and professionals. This repository contains the source code for the main web application, which serves as the central hub for the entire ecosystem.

The project brings together three complementary branches under a single, coherent system:

- **RusingAcademy:** The core academic and training pillar, delivering structured programs, assessments, and exam-oriented pathways.
- **Lingueefy:** The human and AI coaching layer, supporting personalized practice, feedback, and progression.
- **Barholex Media:** The EdTech, consulting, and innovation arm, supporting content strategy, digital infrastructure, and pedagogical design.

## Key Features

- **Fully Bilingual:** Seamless English and French language support across the entire platform.
- **Progressive Web App (PWA):** Installable on any device for a native-like experience and offline access to course materials.
- **Comprehensive Coach Profiles:** Detailed profiles for each coach, including specializations, videos, and booking widgets.
- **Integrated Course Catalog:** A central place to browse and enroll in courses from RusingAcademy.
- **User Authentication:** Secure login and user management.
- **Integrated Ecosystem:** A unified navigation and user experience across RusingAcademy, Lingueefy, and Barholex Media.

## Tech Stack

- **Frontend:** Vite, React, TypeScript, Tailwind CSS
- **Deployment:** Railway, Docker

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/RusingAcademy/RusingAcademy-Ecosystem-Main-Repo.git
   ```
2. Install PNPM packages
   ```sh
   pnpm install
   ```
3. Start the development server
   ```sh
   pnpm dev
   ```

## Deployment

This project is deployed on [Railway](https://railway.app/). Every push to the `main` branch automatically triggers a new build and deployment.

## Project Structure

```
.
├── client/         # Frontend code (Vite + React)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── pages/
│       └── ...
├── README.md
└── ...
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
