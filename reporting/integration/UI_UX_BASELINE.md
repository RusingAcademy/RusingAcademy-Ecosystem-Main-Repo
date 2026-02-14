# UI/UX Baseline\n\nThis document establishes the baseline for UI/UX patterns across all 6 repositories.\n
\n## Repo: rusingacademy-ecosystem\n

- **Component Library:** The project uses **shadcn/ui**, which is a collection of re-usable components built on top of **Radix UI** and styled with **Tailwind CSS**. This is evident from the `package.json` dependencies and the `components.json` file.
- **Styling:** **Tailwind CSS** is the primary styling approach, configured via the `@tailwindcss/vite` plugin in `vite.config.ts`. The project also uses `tailwindcss-animate` for animations.
- **Layout:** The application uses a combination of traditional and modern layouts. The main marketing pages have a standard layout, while the admin and user dashboards utilize a sidebar navigation layout. The use of `react-resizable-panels` suggests that some layouts may be resizable.
- **Bilingual Support:** The application supports both English and French. This is evident from the use of `LanguageProvider` and the presence of `Fr` suffixes in many component props and database columns (e.g., `headlineFr`, `bioFr`).
- **Glassmorphism:** The presence of `framer-motion` and the overall modern aesthetic suggest that glassmorphism and other advanced styling techniques might be used, although this would need to be confirmed by visual inspection.
\n## Repo: RusingAcademy-Learner-Portal Audit Report\n
\n## Repo: RusingAcademy-Library Audit Report\n
\n## Repo: RusingAcademy-Sales Repository Audit\n
\n## Repo: RusingAcademy-KAJABI-style-Admin-Control-System Audit Report\n
\n## Repo: RusingAcademy-Community Audit Report\n

### Design System & Component Library

The project utilizes a design system based on **shadcn/ui**, a collection of reusable UI components for React. This is evident from the component files found in `client/src/components/ui/`, which closely match the naming and structure of shadcn/ui components. Radix UI is likely used as the underlying headless component library, as it is a common foundation for shadcn/ui.

### Styling

**Tailwind CSS** is the primary styling approach, as indicated by the presence of `tailwind.config.js` and `postcss.config.js`. This utility-first CSS framework is used to build the visual appearance of the components and layouts.

### Layout Patterns

The main application layout is defined in `client/src/components/DashboardLayout.tsx`. It consists of a `TopHeader`, a `LeftSidebar`, and a main content area. This is a common pattern for dashboard-style applications, providing consistent navigation and structure across different pages.

### Bilingual Support

The application supports both English and French. The internationalization (i18n) is managed through files in the `client/src/i18n/` directory, including `en.ts` and `fr.ts` for the language strings, and a `LocaleContext.tsx` to provide the current locale to the application.

### Glassmorphism

While not explicitly found in the code, the use of glassmorphism is a stated preference of the user. It's possible that this effect is achieved through custom Tailwind CSS classes or inline styles that combine background blur and transparency, but a quick scan of the code did not reveal any obvious implementations. It's a design preference to be aware of for future development.

