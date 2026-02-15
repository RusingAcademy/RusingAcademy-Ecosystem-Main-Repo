# QA Smoke Test — Sprint 0+1

## Pre-Deployment Checklist

- [ ] PR #103 merged to main
- [ ] `pnpm db:push` executed (adds `review` enum + `publishedBy` column)
- [ ] Railway staging deployment successful
- [ ] No TypeScript compilation errors

---

## Test 1: Admin Navigation Integrity

### 1.1 Dictation Exercises Navigation
1. Login as admin
2. Navigate to Admin Control Center
3. In sidebar, find SLE PREP group
4. Click "Dictation Exercises"
5. **Expected**: DictationExercises component loads inside AdminControlCenter layout
6. **Fail condition**: Blank panel, 404, or wrong component

### 1.2 Promoted Legacy Pages
Test each of the 5 promoted pages:

| Sidebar Item | Group | Expected Component |
|---|---|---|
| Coach Applications | PEOPLE | AdminCoachAppsSection (wraps AdminApplicationDashboard) |
| Commission | SALES | AdminCommissionSection (wraps commission content) |
| Content Management | CONTENT | AdminContentMgmtSection (wraps content tabs) |
| Leads | SALES | AdminLeadsSection (wraps leads table) |
| Reminders | COMMUNITY | AdminRemindersSection (wraps reminders UI) |

For each:
1. Click the sidebar item
2. **Expected**: Component renders inside AdminControlCenter (sidebar visible)
3. **Fail condition**: Full-page redirect, standalone layout, or missing sidebar

### 1.3 Legacy Route Redirects
Navigate directly to these URLs:
- `/admin/coach-applications` -> Should load AdminControlCenter with coach-applications section
- `/admin/commission` -> Should load AdminControlCenter with commission section
- `/admin/content-management` -> Should load AdminControlCenter with content-management section
- `/admin/leads` -> Should load AdminControlCenter with leads section
- `/admin/reminders` -> Should load AdminControlCenter with reminders section

---

## Test 2: Course Publication Lifecycle

### 2.1 Status Filter
1. Go to Admin > Course Builder
2. Check stats cards: should show 5 cards (Total, Published, In Review, Drafts, Archived)
3. Open status filter dropdown: should show All Status, Published, In Review, Draft, Archived
4. Select "In Review" filter
5. **Expected**: Only courses with review status shown (may be 0 initially)

### 2.2 Submit for Review
1. Find a course in "draft" status
2. Click Actions dropdown
3. **Expected**: "Submit for Review" option visible (blue text)
4. Click "Submit for Review"
5. **Expected**: Course status changes to "review", blue badge appears

### 2.3 Return to Draft
1. Find a course in "review" status
2. Click Actions dropdown
3. **Expected**: "Return to Draft" option visible
4. Click "Return to Draft"
5. **Expected**: Course status returns to "draft"

### 2.4 Publish from Review
1. Put a course in "review" status
2. Click the green "Publish" button
3. **Expected**: Course publishes, publishedAt and publishedBy set

### 2.5 Learner Visibility
1. As a learner, browse the course catalog
2. **Expected**: Only courses with status "published" are visible
3. **Expected**: Courses in draft, review, or archived status are NOT visible

---

## Test 3: Existing Functionality (Regression)

### 3.1 Course CRUD
- [ ] Create new course (should default to "draft")
- [ ] Edit course title and description
- [ ] Duplicate course (copy should be "draft")
- [ ] Delete course (with confirmation)
- [ ] Archive course
- [ ] Unpublish course

### 3.2 Module/Lesson Management
- [ ] Create module inside a course
- [ ] Create lesson inside a module
- [ ] Reorder modules
- [ ] Reorder lessons

### 3.3 Admin Navigation (Other Sections)
Verify these existing sections still load correctly:
- [ ] Dashboard (overview)
- [ ] Users
- [ ] Courses (CourseBuilder)
- [ ] Enrollments
- [ ] Analytics
- [ ] Settings

### 3.4 Authentication
- [ ] Login flow works
- [ ] Admin role check works
- [ ] Logout works
- [ ] Session persistence across page refresh

---

## Test 4: Wave 1-3 Components (Compilation)

Verify these components load without errors (they are placeholder/mock data):
- [ ] Flashcards section
- [ ] Study Notes section
- [ ] Vocabulary section
- [ ] Dictation Exercises section

---

## Sign-Off

| Tester | Date | Result | Notes |
|---|---|---|---|
| | | | |
