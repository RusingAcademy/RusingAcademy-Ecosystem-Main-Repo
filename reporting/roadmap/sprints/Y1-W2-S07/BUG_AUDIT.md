# Bug Audit: adminCourses Router

## Critical Bugs Found

### BUG-1: `updateLesson` updates WRONG TABLE (courseModules instead of lessons)
- **File:** `server/routers/adminCourses.ts` line 469-474
- **Issue:** Imports `courseModules` but should import `lessons`. Destructures `moduleId` from input but input has `lessonId`.
- **Impact:** Updating a lesson actually modifies a module record — data corruption risk.
- **Fix:** Import `lessons` table, destructure `lessonId`, update `lessons` table.

### BUG-2: `updateLessonFull` missing `lessonId` in input schema
- **File:** `server/routers/adminCourses.ts` line 606
- **Issue:** Input schema has `moduleId` and `courseId` but no `lessonId`. The destructure on line 635 tries `const { lessonId, ...updateData } = input;` but `lessonId` is undefined.
- **Impact:** Cannot update any lesson via this endpoint — it will fail silently or update nothing.
- **Fix:** Add `lessonId: z.number()` to input schema.

### BUG-3: `createLesson` references `input.titleFr` and `input.descriptionFr` but they're not in the input schema
- **File:** `server/routers/adminCourses.ts` line 576-577
- **Issue:** `titleFr` and `descriptionFr` are used in the insert but not declared in the Zod input schema.
- **Impact:** TypeScript error (suppressed at build), bilingual fields never saved on lesson creation.
- **Fix:** Add `titleFr` and `descriptionFr` to the input schema.

### BUG-4: `updateLessonBasic` uses `input.type` but lessons table has `contentType`
- **File:** `server/routers/adminCourses.ts` line 82-83
- **Issue:** Input has `type` field but schema column is `contentType`. Setting `type` on the update object does nothing.
- **Impact:** Cannot change lesson content type via inline editing.
- **Fix:** Map `input.type` to `contentType` in the update data.

## Summary
4 critical bugs found in the admin courses CRUD layer. All must be fixed before the content pipeline can work reliably.
