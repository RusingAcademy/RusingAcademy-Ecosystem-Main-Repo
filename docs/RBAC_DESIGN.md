# RusingAcademy RBAC System Design

## 1. Roles Hierarchy

```
Owner (Super-Admin)
  └── Admin
        └── HR Admin (B2B/B2G)
        └── Coach
        └── Learner
```

### Role Definitions

| Role | Description | Max Users |
|------|-------------|-----------|
| `owner` | Super-admin with full access. Can manage all admins and settings. | 1 |
| `admin` | Full platform access. Can manage users, content, sales. | 20 |
| `hr_admin` | B2B/B2G focused. Cohorts, reporting, licenses, enterprise billing. | Unlimited |
| `coach` | Teaching role. Sessions, learners, content creation. | Unlimited |
| `learner` | Learning role. Courses, progress, certificates. | Unlimited |

## 2. Permission Modules (Kajabi-style)

### Products Module
- `products.courses` - Manage courses
- `products.coaching` - Manage coaching sessions
- `products.community` - Manage community features
- `products.podcasts` - Manage podcasts
- `products.newsletters` - Manage newsletters
- `products.downloads` - Manage downloadable resources

### Sales Module
- `sales.payments` - View/manage payments
- `sales.offers` - Create/manage offers
- `sales.payouts` - Manage coach payouts
- `sales.cart` - Cart settings
- `sales.invoices` - Invoice management
- `sales.coupons` - Coupon management
- `sales.affiliates` - Affiliate program

### Website Module
- `website.design` - Theme/design settings
- `website.pages` - Page management
- `website.landing` - Landing pages
- `website.navigation` - Menu/navigation
- `website.blog` - Blog management

### Marketing Module
- `marketing.email` - Email campaigns
- `marketing.funnels` - Sales funnels
- `marketing.automations` - Automation workflows
- `marketing.events` - Event management
- `marketing.forms` - Form builder
- `marketing.contacts` - Contact management
- `marketing.inbox` - Message inbox

### Insights Module
- `insights.assessments` - Assessment tools
- `insights.analytics` - Platform analytics
- `insights.reports` - Report generation

### People Module
- `people.users` - User management
- `people.admins` - Admin management
- `people.coaches` - Coach management
- `people.learners` - Learner management
- `people.cohorts` - Cohort management

### Settings Module
- `settings.general` - General settings
- `settings.billing` - Billing settings
- `settings.integrations` - Third-party integrations
- `settings.api` - API access

## 3. Permission Actions

Each module permission supports these actions:
- `view` - Read access
- `create` - Create new items
- `edit` - Modify existing items
- `delete` - Remove items
- `export` - Export data

## 4. Database Schema

### roles table
```sql
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  displayName VARCHAR(100) NOT NULL,
  description TEXT,
  isSystem BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### permissions table
```sql
CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module VARCHAR(50) NOT NULL,
  submodule VARCHAR(50) NOT NULL,
  action ENUM('view', 'create', 'edit', 'delete', 'export') NOT NULL,
  description TEXT,
  UNIQUE KEY unique_permission (module, submodule, action)
);
```

### role_permissions table
```sql
CREATE TABLE role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roleId INT NOT NULL REFERENCES roles(id),
  permissionId INT NOT NULL REFERENCES permissions(id),
  UNIQUE KEY unique_role_permission (roleId, permissionId)
);
```

### user_permissions table (for custom overrides)
```sql
CREATE TABLE user_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL REFERENCES users(id),
  permissionId INT NOT NULL REFERENCES permissions(id),
  granted BOOLEAN DEFAULT TRUE,
  UNIQUE KEY unique_user_permission (userId, permissionId)
);
```

### password_reset_tokens table
```sql
CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL REFERENCES users(id),
  token VARCHAR(255) NOT NULL UNIQUE,
  expiresAt TIMESTAMP NOT NULL,
  usedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 5. Default Role Permissions

### Owner
- ALL permissions with ALL actions

### Admin
- ALL permissions except `settings.billing` delete and `people.admins` delete

### HR Admin
- `people.*` - view, create, edit
- `insights.*` - view, export
- `products.courses` - view
- `sales.invoices` - view, export

### Coach
- `products.courses` - view, create, edit (own)
- `products.coaching` - view, create, edit (own)
- `people.learners` - view (assigned)
- `insights.reports` - view (own)

### Learner
- `products.courses` - view (enrolled)
- `products.coaching` - view (booked)
- `insights.assessments` - view (own)

## 6. Implementation Priority

1. **Phase 1 (MVP)**: Basic roles (owner, admin, coach, learner) + core permissions
2. **Phase 2**: HR Admin role + cohort management
3. **Phase 3**: Granular permission UI + custom permission overrides
4. **Phase 4**: OAuth providers (Google, Microsoft, Apple)
