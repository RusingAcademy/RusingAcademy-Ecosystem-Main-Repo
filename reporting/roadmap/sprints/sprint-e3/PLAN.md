# Sprint E3: Resource Library & Downloadable Content

## Objective
The primary objective of Sprint E3 is to build a comprehensive, bilingual, and scalable Resource Library. This feature will allow administrators to upload, manage, and track downloadable content (e.g., PDFs, worksheets, templates), and provide learners with a centralized, user-friendly interface to access and download these materials.

## Key Features
1.  **Admin CRUD Operations:** Full Create, Read, Update, and Delete (CRUD) functionality for downloadable resources via a dedicated admin interface.
2.  **Bilingual Content:** Support for bilingual (English/French) titles and descriptions for all resources.
3.  **Learner-Facing Library:** A new "Resource Library" page for authenticated learners to browse, search, filter, and download available resources.
4.  **Download Tracking:** Backend mechanism to track every download, linking the resource to the user and timestamp.
5.  **Download History:** A "My Downloads" tab for learners to view their personal download history.
6.  **Admin Analytics:** A new analytics section in the admin dashboard to provide insights into resource performance, including total downloads, downloads over time, and top resources.
7.  **Access Control:** Ability to mark resources as "public" (accessible to all) or "enrollment required" (though this sprint will not implement the enrollment check, the database field is ready).

## Technical Plan

### Backend (tRPC Routers)
*   **`downloadsAdminRouter`:**
    *   `create`: New endpoint to add a new downloadable resource.
    *   `update`: New endpoint to modify an existing resource.
    *   `delete`: New endpoint to remove a resource and its associated download logs.
    *   `getAnalytics`: New endpoint to provide aggregated download statistics.
*   **`resourceLibraryRouter` (New):**
    *   `list`: New public endpoint to list all available resources for learners, with search and filtering capabilities.
    *   `getById`: New endpoint to retrieve a single resource.
    *   `trackDownload`: New endpoint to log a download event for a user and resource.
    *   `myHistory`: New endpoint to retrieve the current user's download history.

### Frontend (React Pages & Components)
*   **`DownloadsAdmin.tsx`:**
    *   Refactor the page to include a full-featured resource management UI.
    *   Implement "Create" and "Edit" dialogs with bilingual fields.
    *   Wire up the UI to the new `create`, `update`, and `delete` mutations.
    *   Add a search input and dropdown menus for actions.
*   **`MyDownloads.tsx`:**
    *   Rewrite the page to function as the main "Resource Library".
    *   Implement two tabs: "All Resources" and "My Downloads".
    *   Wire the "All Resources" tab to the new `resourceLibrary.list` endpoint.
    *   Wire the "My Downloads" tab to the new `resourceLibrary.myHistory` endpoint.
    *   Implement search and filtering functionality.
    *   Add a "Download" button that calls the `trackDownload` mutation and opens the file URL.

## Success Metrics
*   Admins can create, edit, and delete downloadable resources.
*   Learners can view, search, and download resources from the Resource Library.
*   All downloads are tracked in the `resource_downloads` table.
*   The admin dashboard displays accurate download analytics.
*   The codebase is clean, documented, and follows existing patterns.
*   Zero regressions in existing functionality.
