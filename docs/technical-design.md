# HR Enterprise Platform — High-Level Technical Design

**Version:** 1.0
**Date:** 2026-03-29
**Status:** Draft — pending review

---

## 1. Project Structure

### 1.1 Monorepo Layout

```
hr-app/
├── backend/                          # Spring Boot application
│   ├── pom.xml                       # Parent POM (Maven multi-module)
│   ├── hrapp-common/                 # Shared framework utilities
│   │   ├── pom.xml
│   │   └── src/main/java/com/company/hr/common/
│   │       ├── log/HrLogHelper.java
│   │       ├── message/HrMessageProvider.java
│   │       ├── security/HrSecurityUtil.java
│   │       ├── format/HrFormatter.java
│   │       ├── exception/
│   │       │   ├── HrApplicationException.java
│   │       │   ├── HrResourceNotFoundException.java
│   │       │   ├── HrBusinessRuleViolationException.java
│   │       │   ├── HrConflictException.java
│   │       │   ├── HrValidationException.java
│   │       │   └── HrAccessDeniedException.java
│   │       ├── response/
│   │       │   ├── HrApiResponse.java
│   │       │   └── HrPagedResponse.java
│   │       └── audit/HrAuditListener.java
│   │
│   └── hrapp-service/                # Domain services, controllers, entities
│       ├── pom.xml
│       └── src/
│           ├── main/
│           │   ├── java/com/company/hr/
│           │   │   ├── HrApplication.java
│           │   │   ├── config/
│           │   │   │   ├── HrSecurityConfig.java
│           │   │   │   ├── HrWebConfig.java
│           │   │   │   ├── HrCorsConfig.java
│           │   │   │   ├── HrCacheConfig.java
│           │   │   │   └── HrJwtConfig.java
│           │   │   ├── controller/
│           │   │   ├── service/
│           │   │   ├── repository/
│           │   │   ├── model/
│           │   │   ├── dto/
│           │   │   ├── mapper/
│           │   │   └── filter/
│           │   │       └── HrJwtAuthenticationFilter.java
│           │   └── resources/
│           │       ├── application.yml
│           │       ├── application-dev.yml
│           │       ├── messages.properties
│           │       ├── messages_fr.properties
│           │       └── db/migration/          # Flyway
│           │           ├── V1__baseline_schema.sql
│           │           ├── V2__seed_data.sql
│           │           └── V3__add_indexes.sql
│           └── test/
│
├── frontend/                         # React application
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── ui/                   # Copied from rental app, adapted
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── DataTable.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Toast.tsx
│       │   │   ├── ... (17 reusable components)
│       │   │   └── index.ts
│       │   ├── hr/                   # HR-specific components
│       │   │   ├── HrScoreboardCard.tsx
│       │   │   ├── HrWizard.tsx
│       │   │   ├── HrActivityFeed.tsx
│       │   │   ├── HrStatusBadge.tsx
│       │   │   ├── HrSalaryRangeInput.tsx
│       │   │   ├── HrEmployeeSelector.tsx
│       │   │   ├── HrJobSelector.tsx
│       │   │   ├── ... (23 HR components)
│       │   │   ├── charts/
│       │   │   │   ├── HrDonutChart.tsx
│       │   │   │   ├── HrHorizontalBarChart.tsx
│       │   │   │   ├── HrLineChart.tsx
│       │   │   │   └── HrBoxPlotChart.tsx
│       │   │   ├── layout/
│       │   │   │   ├── HrTopBar.tsx
│       │   │   │   ├── HrSidebar.tsx
│       │   │   │   └── HrPageLayout.tsx
│       │   │   └── i18n/
│       │   │       ├── HrLanguageSelector.tsx
│       │   │       ├── HrCurrencyDisplay.tsx
│       │   │       └── HrDateDisplay.tsx
│       │   └── templates/            # Page layout templates
│       │       ├── DataManagementTemplate.tsx  # from rental app
│       │       ├── FormTemplate.tsx             # from rental app
│       │       ├── WizardTemplate.tsx           # from rental app (adapt → HrWizardTemplate)
│       │       ├── SplitViewTemplate.tsx        # from rental app (adapt → HrSplitViewTemplate)
│       │       ├── HrDashboardTemplate.tsx
│       │       ├── HrAuthTemplate.tsx
│       │       ├── HrOrgChartTemplate.tsx
│       │       ├── HrNotificationCenterTemplate.tsx
│       │       ├── HrSettingsTemplate.tsx
│       │       ├── HrBulkImportTemplate.tsx
│       │       ├── HrEmptyStateTemplate.tsx
│       │       └── index.ts
│       ├── pages/                    # Route-level page components
│       │   ├── auth/
│       │   │   └── LoginPage.tsx
│       │   ├── dashboard/
│       │   │   └── DashboardPage.tsx
│       │   ├── employees/
│       │   │   ├── EmployeeDirectoryPage.tsx
│       │   │   └── EmployeeDetailPage.tsx
│       │   ├── actions/
│       │   │   ├── HireWizardPage.tsx
│       │   │   ├── PromoteWizardPage.tsx
│       │   │   ├── TransferWizardPage.tsx
│       │   │   └── TerminateWizardPage.tsx
│       │   ├── organization/
│       │   │   ├── RegionsPage.tsx
│       │   │   ├── CountriesPage.tsx
│       │   │   ├── LocationsPage.tsx
│       │   │   ├── DepartmentsPage.tsx
│       │   │   └── JobsPage.tsx
│       │   ├── admin/
│       │   │   ├── UsersPage.tsx
│       │   │   └── AuditLogsPage.tsx
│       │   ├── OrgChartPage.tsx
│       │   ├── NotificationCenterPage.tsx
│       │   ├── SettingsPage.tsx
│       │   ├── SearchResultsPage.tsx
│       │   └── errors/
│       │       ├── NotFoundPage.tsx
│       │       └── UnauthorizedPage.tsx
│       ├── hooks/                    # Custom React hooks
│       │   ├── useAuth.ts
│       │   ├── useHrFormatter.ts
│       │   ├── useEmployees.ts       # TanStack Query hooks
│       │   ├── useDashboard.ts
│       │   └── ...
│       ├── services/                 # API client layer
│       │   ├── HrApiClient.ts
│       │   ├── authService.ts
│       │   ├── employeeService.ts
│       │   ├── dashboardService.ts
│       │   └── ...
│       ├── contexts/
│       │   ├── AuthContext.tsx
│       │   └── PreferencesContext.tsx
│       ├── routes/
│       │   ├── router.tsx
│       │   └── ProtectedRoute.tsx
│       ├── i18n/
│       │   ├── config.ts
│       │   ├── en.json
│       │   └── fr.json
│       ├── types/
│       │   ├── employee.ts
│       │   ├── department.ts
│       │   ├── api.ts
│       │   └── ...
│       ├── utils/
│       │   └── constants.ts
│       ├── data/                     # Mock data (Phase 1, replaced by API later)
│       │   ├── mockEmployees.ts
│       │   ├── mockDepartments.ts
│       │   ├── mockJobs.ts
│       │   └── ...
│       └── styles/
│           └── globals.css
│
├── database/
│   ├── schema.sql                    # Original DDL (reference only)
│   ├── demo.sql                      # Demo/seed data
│   └── create-readonly-user.sql      # For MCP lab
│
├── docs/                             # All documentation
│   ├── requirement.md
│   ├── figma-ui-spec.md
│   ├── hr_components_specification.md
│   ├── hr_templates_specification.md
│   ├── hr_screens_specification.md
│   ├── technical-design.md           # This document
│   └── claudetips/                   # Training materials
│
├── .claude/                          # Claude Code configuration
│   ├── skills/
│   ├── agents/
│   └── commands/
├── CLAUDE.md
├── .mcp.json                         # Team MCP config
├── .env.example                      # Template for local env vars
└── .gitignore
```

### 1.2 Why This Structure

| Decision | Rationale |
|---|---|
| **Monorepo (single git repo)** | Backend + frontend deployed together, shared git history, simpler CI, one CLAUDE.md governs both |
| **Maven multi-module** (hrapp-common + hrapp-service) | Utilities (HrLogHelper, exceptions, response envelope) are reused across services and keep hrapp-service clean |
| **Frontend `src/components/ui/`** not `src/app/components/ui/` | Matches rental app actual structure (no `app/` segment). Figma specs say `src/app/components/` — we ignore that and use the real path |
| **Components split: `ui/` + `hr/` + `templates/`** | `ui/` = generic reusables (from rental app), `hr/` = HR-domain-specific, `templates/` = page layouts |
| **`pages/` separate from `components/`** | Pages are route-level compositions. Components are reusable. Clean separation. |
| **`services/` for API calls** | Centralized API layer with typed responses. Pages use hooks, hooks use services, services use HrApiClient |
| **`data/` for mock data** | Phase 1 uses mock data. Services have a flag to swap between mock and real API. Clean removal later. |

---

## 2. Backend Architecture

### 2.1 Maven Multi-Module

```xml
<!-- backend/pom.xml (parent) -->
<modules>
    <module>hrapp-common</module>
    <module>hrapp-service</module>
</modules>

<properties>
    <java.version>21</java.version>
    <spring-boot.version>3.2.x</spring-boot.version>
    <mapstruct.version>1.5.x</mapstruct.version>
    <flyway.version>10.x</flyway.version>
</properties>
```

**hrapp-common** — no Spring Boot dependency, pure Java:
- HrLogHelper, HrMessageProvider, HrSecurityUtil, HrFormatter
- Exception hierarchy (HrApplicationException and subclasses)
- Response envelope (HrApiResponse, HrPagedResponse)
- HrAuditListener (@EntityListener)

**hrapp-service** — Spring Boot application:
- All controllers, services, repositories, entities, DTOs, mappers
- Spring Security config, JWT filter
- Flyway migrations
- Application configuration

### 2.2 Entity Design

Each JPA entity maps to one database table. Key design rules:

```java
@Entity
@Table(name = "employees")
@EntityListeners(HrAuditListener.class)
public class HrEmployee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employeeId;

    // Fields map directly to schema columns
    // Soft delete: @SQLRestriction("deleted_at IS NULL") for default filtering
    // Relationships: @ManyToOne(fetch = LAZY) for all FK relationships
    // No business logic in entities (Anemic Domain Model)
}
```

**Entity list** (13 entities, all prefixed `Hr`):

| Entity | Table | Key Notes |
|---|---|---|
| HrRegion | regions | Simple, no FK dependencies |
| HrCountry | countries | FK → regions |
| HrLocation | locations | FK → countries |
| HrDepartment | departments | FK → locations, self-ref parent, soft delete |
| HrJob | jobs | min/max salary range |
| HrEmployee | employees | FK → departments, jobs, self-ref manager, soft delete |
| HrJobHistory | job_history | Composite PK (employee_id, start_date) |
| HrUser | hr_users | FK → employees, 1:1 |
| HrRole | hr_roles | ROLE_ADMIN, ROLE_HR_SPECIALIST, etc. |
| HrUserRole | hr_user_roles | M:N junction |
| HrUserPreference | hr_user_preferences | 1:1 with users |
| HrAuditLog | hr_audit_logs | JSON old/new values |
| HrEmployeeDocument | hr_employee_documents | File metadata |
| HrNotification | hr_notifications | User alerts |

### 2.3 DTO Strategy

Every entity gets purpose-specific DTOs. Never expose entities in API responses.

| DTO Pattern | Usage | Example |
|---|---|---|
| `Hr{Entity}SummaryDTO` | List views (minimal fields) | HrEmployeeSummaryDTO: id, name, department, job, status |
| `Hr{Entity}DetailDTO` | Detail views (all fields) | HrEmployeeDetailDTO: all fields + manager name + location |
| `Hr{Entity}CreateRequest` | POST body | HrEmployeeCreateRequest: validated input fields |
| `Hr{Entity}UpdateRequest` | PUT/PATCH body | HrEmployeeUpdateRequest: partial fields |

MapStruct mapper interfaces handle all conversions:

```java
@Mapper(componentModel = "spring")
public interface HrEmployeeMapper {
    HrEmployeeSummaryDTO toSummary(HrEmployee entity);
    HrEmployeeDetailDTO toDetail(HrEmployee entity);
    HrEmployee fromCreateRequest(HrEmployeeCreateRequest request);
    void updateFromRequest(HrEmployeeUpdateRequest request, @MappingTarget HrEmployee entity);
}
```

### 2.4 Service Layer Patterns

```java
@Service
@RequiredArgsConstructor
public class HrEmployeeService {
    private static final HrLogHelper LOGGER = new HrLogHelper(HrEmployeeService.class);
    private final HrEmployeeRepository repository;
    private final HrEmployeeMapper mapper;
    private final HrAuditService auditService;

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST','MANAGER','EMPLOYEE')")
    public HrPagedResponse<HrEmployeeSummaryDTO> findAll(Pageable pageable, EmployeeFilter filter) {
        LOGGER.info("Entering findAll(page={}, size={})", pageable.getPageNumber(), pageable.getPageSize());
        // Manager: auto-scope to direct/indirect reports via HrSecurityUtil
        // Employee: salary masking via HrSecurityUtil.canViewSalary()
        Page<HrEmployee> page = repository.findAll(buildSpec(filter), pageable);
        LOGGER.info("Exiting findAll, found {} employees", page.getTotalElements());
        return HrPagedResponse.of(page.map(mapper::toSummary));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN','HR_SPECIALIST')")
    public HrEmployeeDetailDTO hireEmployee(HrEmployeeCreateRequest request, String idempotencyKey) {
        LOGGER.info("Entering hireEmployee(email=MASKED, idempotencyKey={})", idempotencyKey);
        // 1. Check idempotency key
        // 2. Validate salary within job grade
        // 3. Create employee
        // 4. Create hr_users record
        // 5. Assign ROLE_EMPLOYEE
        // 6. Create job_history entry
        // 7. Create notification for HR admin
        // All in one transaction
        LOGGER.info("Exiting hireEmployee, created employee ID: {}", saved.getEmployeeId());
        return mapper.toDetail(saved);
    }
}
```

### 2.5 JWT Authentication Flow

```
1. POST /app/hr/api/v1/auth/login {username, password}
2. HrAuthController → HrAuthService.authenticate()
3. Verify password (Argon2id) against hr_users.password_hash
4. Check hr_users.is_active = true
5. Load roles from hr_user_roles
6. Generate JWT: {sub: username, roles: [...], employeeId: N, exp: +30min}
7. Return: {token, refreshToken, expiresIn, user: {name, role, ...}}

Subsequent requests:
1. Authorization: Bearer <token>
2. HrJwtAuthenticationFilter extracts + validates token
3. Sets SecurityContext with username + roles
4. @PreAuthorize checks on controller methods
```

**Token refresh:** Client calls `/auth/refresh` with refresh token before access token expires. Refresh tokens have longer TTL (7 days) and are single-use.

### 2.6 Flyway Migration Strategy

The existing `schema.sql` becomes the baseline migration. Subsequent changes are incremental.

```
db/migration/
├── V1__baseline_schema.sql           # Full schema from schema.sql
├── V2__seed_roles.sql                # Insert ROLE_ADMIN, ROLE_HR_SPECIALIST, etc.
├── V3__seed_demo_data.sql            # Insert demo employees, departments, etc.
├── V4__add_idempotency_keys.sql      # Table for idempotency tracking
└── V5__xxx.sql                       # Future migrations
```

**Rule:** Never edit `schema.sql` directly. All changes go through Flyway migrations. A hook enforces this.

### 2.7 Caching Strategy

Use Caffeine (in-memory) for frequently accessed, slowly-changing data:

| Cache | TTL | Data |
|---|---|---|
| `jobs` | 1 hour | Job list (rarely changes) |
| `departments` | 15 min | Department tree |
| `regions-countries` | 1 hour | Region/country lists |
| `user-preferences` | 5 min | Logged-in user's locale settings |

**Rule:** Cache read-only reference data only. Never cache employee data (too dynamic, PII concerns).

### 2.8 API Response Envelope

All responses wrapped in a standard envelope:

```java
public class HrApiResponse<T> {
    private Instant timestamp;
    private int status;
    private T data;
    private String message;

    // Error variant
    private String error;
    private String errorCode;       // e.g., "SALARY_OUTSIDE_BAND"
    private Map<String, String> fieldErrors;  // For validation errors
}

public class HrPagedResponse<T> extends HrApiResponse<List<T>> {
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
}
```

---

## 3. Frontend Architecture

### 3.1 Technology Stack (aligned with rental app)

```json
{
  "react": "^19.x",
  "react-dom": "^19.x",
  "react-router-dom": "^7.x",
  "typescript": "~5.9.x",
  "vite": "^8.x",
  "tailwindcss": "^4.x",
  "tailwind-merge": "^3.x",
  "clsx": "^2.x",
  "recharts": "^3.x",
  "react-hook-form": "^7.x",
  "i18next": "^25.x",
  "react-i18next": "^16.x",
  "lucide-react": "^0.577.x",
  "react-dnd": "^16.x",
  "sonner": "^2.x",
  "vitest": "^4.x",
  "@testing-library/react": "^16.x",
  "storybook": "^10.x"
}
```

**Deliberate alignment:** Same versions as the rental app so copied components work without dependency conflicts.

**Addition needed (not in rental app):**
- `@tanstack/react-query` — Server state management (TanStack Query)
- `axios` — HTTP client for HrApiClient
- `react-day-picker` already in rental app (used for DatePicker)
- `zod` (optional) — Runtime schema validation for API responses

### 3.2 Component Reuse from Rental App

**Copy strategy:** Copy files from `/home/ssthakur/projects/rentalapp/frontend/src/components/` into the HR app's `frontend/src/components/`. Do not symlink — the HR app is a separate deployable.

**UI components to copy** (from `src/components/ui/`):

| Rental App Component | HR App Usage | Changes Needed |
|---|---|---|
| Button.tsx | All CTAs | None |
| Input.tsx | All text inputs | None |
| Select.tsx | All dropdowns | None |
| Checkbox.tsx | Multi-select, toggles | None |
| Avatar.tsx | Employee photos | None |
| Badge.tsx | Status indicators | None |
| Card.tsx | Content containers | None |
| DataTable.tsx | All data lists | None |
| Modal.tsx | Dialogs, forms | None |
| Toast.tsx / sonner | Notifications | None |
| Breadcrumbs.tsx | Navigation trails | None |
| Calendar.tsx / DatePicker.tsx | Date selection | None |
| SearchBar.tsx | Global search | None |
| DropdownMenu.tsx | Action menus | None |
| Tabs.tsx | Multi-section views | None |
| PageHeader.tsx | Page titles | None |
| Pagination.tsx | Table paging | None |
| EmptyState.tsx | No-data states | None |
| Spinner.tsx | Loading indicators | None |
| Textarea.tsx | Multi-line input | None |
| FileUpload.tsx | Document uploads | Minor adapt for HR categories |
| Form.tsx / FormSection.tsx | Form layouts | None |
| Tooltip.tsx | Hover info | None |
| Alert.tsx | Warning/info banners | None |
| ScoreboardCard.tsx | KPI display | Adapt → HrScoreboardCard |
| ProgressBar.tsx | Upload progress | None |

**Templates to copy** (from `src/components/templates/`):

| Rental App Template | HR App Usage | Changes Needed |
|---|---|---|
| DataManagementTemplate.tsx | Employee Directory, Structure pages, Users, Audit Logs | None |
| FormTemplate.tsx | Simple create/edit forms | None |
| WizardTemplate.tsx | Hire/Promote/Transfer/Terminate wizards | Adapt step indicator styling |
| SplitViewTemplate.tsx | Departments (tree + detail) | None |
| DashboardTemplate.tsx | HR Dashboard | Adapt layout to HR KPI grid |
| SettingsTemplate.tsx | User Preferences | None |
| ProfileTemplate.tsx | Employee 360 View | Adapt to HR tab structure |

**Components NOT in rental app** (build fresh):
- HrActivityFeed, HrOrgChartNode, HrSalaryRangeInput, HrEmployeeSelector, HrJobSelector
- HrStatusBadge, HrEmploymentTypeBadge, HrAuditLogRow, HrKpiFilter, HrConfirmDialog
- All chart components (HrDonutChart, HrHorizontalBarChart, HrLineChart, HrBoxPlotChart)
- Layout: HrTopBar, HrSidebar, HrPageLayout
- i18n: HrLanguageSelector, HrCurrencyDisplay, HrDateDisplay
- Templates: HrAuthTemplate, HrOrgChartTemplate, HrNotificationCenterTemplate, HrBulkImportTemplate, HrEmptyStateTemplate

### 3.3 HrApiClient Architecture

```typescript
// services/HrApiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

class HrApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/app/hr/api/v1',
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });

    // Request interceptor: attach JWT
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('hr_access_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // Response interceptor: handle 401 (token refresh), unwrap envelope
    this.client.interceptors.response.use(
      (response) => response.data,  // Unwrap HrApiResponse.data
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Attempt token refresh, retry original request
          // If refresh fails → redirect to /hr/login
        }
        // Throw structured error with errorCode for frontend handling
        throw this.normalizeError(error);
      }
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> { ... }
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> { ... }
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> { ... }
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> { ... }
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> { ... }
}

export const hrApi = new HrApiClient();
```

### 3.4 TanStack Query Integration

```typescript
// hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';

export function useEmployees(filters: EmployeeFilter) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeService.getAll(filters),
    staleTime: 30_000,         // 30 seconds
    placeholderData: keepPreviousData,  // Smooth pagination
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeService.getById(id),
    staleTime: 60_000,
  });
}

export function useHireEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeeService.hire,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

### 3.5 Auth Context & Protected Routes

```typescript
// contexts/AuthContext.tsx
interface AuthState {
  user: { id: number; name: string; role: string; employeeId: number } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// routes/ProtectedRoute.tsx
function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/hr/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/hr/unauthorized" />;
  return <Outlet />;
}
```

### 3.6 Routing Structure

```typescript
// routes/router.tsx — maps to hr_screens_specification.md Section 9
const router = createBrowserRouter([
  {
    path: '/hr',
    children: [
      { path: 'login', element: <LoginPage /> },
      {
        element: <ProtectedRoute />,   // All authenticated routes
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'employees', element: <EmployeeDirectoryPage /> },
          { path: 'employees/:id', element: <EmployeeDetailPage /> },
          { path: 'org-chart', element: <OrgChartPage /> },
          {
            path: 'actions',
            element: <ProtectedRoute roles={['ADMIN','HR_SPECIALIST','MANAGER']} />,
            children: [
              { path: 'hire', element: <HireWizardPage /> },
              { path: 'promote', element: <PromoteWizardPage /> },
              { path: 'transfer', element: <TransferWizardPage /> },
              {
                path: 'terminate',
                element: <ProtectedRoute roles={['ADMIN','HR_SPECIALIST']} />,
                children: [{ index: true, element: <TerminateWizardPage /> }]
              }
            ]
          },
          // ... organization, admin, settings, notifications, search, errors
        ]
      }
    ]
  }
]);
```

### 3.7 Tailwind + Vertex Tech Modern Design Tokens

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Vertex Tech Modern (Modern Design System 24C) tokens
        'blue-60': '#1F6BCC',      // Primary
        'blue-50': '#2B7DE0',
        'blue-10': '#C7E0FF',      // Background
        'neutral-5': '#F5F5F5',
        'neutral-10': '#E8E8E8',
        'neutral-20': '#D0D0D0',
        'neutral-30': '#999999',
        'neutral-60': '#666666',
        'neutral-90': '#1A1A1A',
        'success-60': '#1A8917',
        'danger-60': '#D92D20',
        'warning-60': '#DC6803',
        'danger-5': '#FEF3F2',
      },
      spacing: {
        // 8px grid
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
      },
      borderRadius: {
        'rds': '16px',      // Card radius
        'rds-sm': '8px',    // Button, input radius
        'rds-lg': '24px',   // Large cards
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(0,0,0,0.12)',
        'level-2': '0 4px 12px rgba(0,0,0,0.15)',
      },
      fontSize: {
        'rds-xs': ['11px', '16px'],
        'rds-sm': ['12px', '18px'],
        'rds-base': ['14px', '20px'],
        'rds-lg': ['16px', '24px'],
        'rds-xl': ['20px', '28px'],
        'rds-2xl': ['24px', '32px'],
        'rds-3xl': ['32px', '40px'],
      }
    }
  }
}
```

### 3.8 Mock Data Strategy (Phase 1)

Phase 1 builds the frontend with mock data before the backend is ready. This allows parallel development.

```typescript
// services/employeeService.ts
import { hrApi } from './HrApiClient';
import { mockEmployees } from '../data/mockEmployees';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const employeeService = {
  getAll: async (filters: EmployeeFilter) => {
    if (USE_MOCK) return filterMockEmployees(mockEmployees, filters);
    return hrApi.get<PagedResponse<EmployeeSummary>>('/employees', { params: filters });
  },
  // ...
};
```

Toggle via `.env`: `VITE_USE_MOCK=true` for frontend-only development, `false` when backend is ready.

### 3.9 Code Splitting

```typescript
// Route-based lazy loading
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const AuditLogsPage = lazy(() => import('./pages/admin/AuditLogsPage'));
const OrgChartPage = lazy(() => import('./pages/OrgChartPage'));

// Admin module not loaded for employees
// Org chart + charting libs not loaded until needed
```

---

## 4. Database Migration Strategy

### 4.1 From schema.sql to Flyway

The existing `database/schema.sql` is the authoritative DDL. We convert it into Flyway migrations:

| Migration | Content | Source |
|---|---|---|
| V1__baseline_schema.sql | All CREATE TABLE + ALTER TABLE + CREATE INDEX | schema.sql (verbatim) |
| V2__seed_roles.sql | INSERT into hr_roles (4 roles) | New |
| V3__seed_demo_data.sql | INSERT regions, countries, locations, departments, jobs, employees, users | demo.sql + extensions |
| V4__idempotency_keys.sql | CREATE TABLE hr_idempotency_keys | New |

**Rule:** Once V1 is created, `schema.sql` becomes read-only reference. All future changes are new migration files.

### 4.2 Idempotency Key Table

```sql
CREATE TABLE hr_idempotency_keys (
    idempotency_key VARCHAR(64) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    response_status INT NOT NULL,
    response_body JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    PRIMARY KEY (idempotency_key)
);
CREATE INDEX idx_idempotency_expires ON hr_idempotency_keys(expires_at);
```

---

## 5. Cross-Cutting Concerns

### 5.1 Error Handling Flow

```
Frontend Form Validation (React Hook Form)
    ↓ (passes)
HrApiClient POST request
    ↓
HrController: @Valid on request DTO
    ↓ (fails → 400 with fieldErrors)
HrService: business validation
    ↓ (fails → 422 with errorCode)
HrRepository: database constraint
    ↓ (fails → 409 for unique, 500 for unexpected)
HrGlobalExceptionHandler catches all → HrApiResponse with errorCode

Frontend:
- 400: Show field-level errors on form
- 401: Refresh token or redirect to login
- 403: Show "Access Denied" toast
- 404: Show "Not Found" page
- 409: Show conflict message (e.g., "Email already exists")
- 422: Show business rule error (e.g., "Salary outside job grade range")
- 500: Show generic "Something went wrong" toast
```

### 5.2 Audit Logging

```java
@EntityListener
public class HrAuditListener {
    // @PreUpdate: capture old values
    // @PostPersist: log INSERT
    // @PostUpdate: log UPDATE with old/new JSON diff
    // @PostRemove: log DELETE (soft deletes go through @PostUpdate)

    // Uses Propagation.REQUIRES_NEW so audit persists even if parent tx rolls back
}
```

### 5.3 Soft Delete Pattern

```java
// On entity:
@SQLRestriction("deleted_at IS NULL")
public class HrEmployee { ... }

// To "delete":
employee.setDeletedAt(Instant.now());
employee.setEmploymentStatus(EmploymentStatus.TERMINATED);
// Also: deactivate hr_users record

// To include deleted in queries (admin view):
@Query("SELECT e FROM HrEmployee e")  // bypasses @SQLRestriction
```

### 5.4 PII Masking

```java
// In HrEmployeeMapper or service layer:
public HrEmployeeSummaryDTO toSummaryWithMasking(HrEmployee entity) {
    HrEmployeeSummaryDTO dto = toSummary(entity);
    if (!HrSecurityUtil.canViewSalary(entity.getEmployeeId())) {
        dto.setSalary(null);
        dto.setCommissionPct(null);
    }
    if (!HrSecurityUtil.canViewPii(entity.getEmployeeId())) {
        dto.setEmail(maskEmail(entity.getEmail()));
        dto.setPhone(null);
    }
    return dto;
}
```

---

## 6. Development Phases & Parallel Tracks

### 6.1 Phase Overview

```
Phase 1: Foundation (Week 1-2)
├── Track A: Backend bootstrap + utilities + simple CRUD
├── Track B: Frontend bootstrap + component library + mock data
└── Track C: Database migrations + seed data

Phase 2: Core Features (Week 3-4)
├── Track A: Employee service + security + auth
├── Track B: Dashboard + Employee Directory + 360 View
└── Track C: Integration (connect frontend to backend)

Phase 3: Complex Features (Week 5-6)
├── Track A: Hire/Promote/Transfer/Terminate wizards (backend)
├── Track B: Wizard UIs + Org Chart + Notifications
└── Track C: Quality pass (hooks, review agents, testing)

Phase 4: Polish & Admin (Week 7-8)
├── Track A: Admin module + audit logs + bulk import
├── Track B: Settings + i18n + responsive polish
└── Track C: MCP verification + CI/CD + documentation
```

### 6.2 Parallel Track Strategy

Tracks A and B can run in parallel using git worktrees (as per training outline). Track C is integration work that follows A+B.

```bash
# Worktree setup
git worktree add ../hr-backend  feature/backend
git worktree add ../hr-frontend feature/frontend

# Aliases
alias za='cd ../hr-backend && claude --name backend'
alias zb='cd ../hr-frontend && claude --name frontend'
```

### 6.3 Backend Build Order (within phases)

```
1. hrapp-common utilities (HrLogHelper, exceptions, response envelope)
2. HrSecurityConfig + JWT filter + HrAuthService
3. Simple CRUD: HrRegion → HrCountry → HrLocation → HrJob
4. HrDepartment (hierarchy, soft delete)
5. HrEmployee (most complex: CRUD + hire + terminate + promote + transfer)
6. Dashboard analytics endpoints
7. Notifications, Documents, Audit Logs, User Management
```

### 6.4 Frontend Build Order (within phases)

```
1. Copy reusable components from rental app
2. HrPageLayout (TopBar + Sidebar + content area)
3. HrAuthTemplate + LoginPage (with mock auth)
4. Design tokens → tailwind.config.ts
5. HrScoreboardCard + chart components
6. HrDashboardTemplate + DashboardPage (with mock data)
7. DataManagementTemplate + EmployeeDirectoryPage (with mock data)
8. DetailTemplate + Employee360Page (with mock data)
9. HrWizardTemplate + HireWizardPage
10. Remaining pages (org chart, structure, admin, settings)
```

---

## 7. Key Technical Decisions

| # | Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|---|
| 1 | State management | TanStack Query + Context | Redux, Zustand | Almost all state is server-cached. No complex client-side state. |
| 2 | HTTP client | Axios via HrApiClient | fetch API | Interceptors (JWT, error handling), request cancellation, wide adoption |
| 3 | CSS approach | Tailwind + Modern Design System tokens | CSS Modules, styled-components | Matches rental app. Utility-first is fast for component building. |
| 4 | Form library | React Hook Form | Formik | Better performance (uncontrolled), simpler API, matches rental app |
| 5 | Chart library | Recharts | Chart.js, D3 | Matches rental app. React-native composability. Good for dashboards. |
| 6 | ORM | Spring Data JPA + Specifications | jOOQ, MyBatis | Standard for Spring Boot. Specification API for dynamic queries. |
| 7 | Mapping | MapStruct | Manual, ModelMapper | Compile-time (no reflection), type-safe, fast |
| 8 | Password hashing | Argon2id | bcrypt | Requirement specifies Argon2id. More secure against GPU attacks. |
| 9 | Migrations | Flyway | Liquibase | Simpler for SQL-first approach. Matches requirement doc. |
| 10 | Mock data toggle | VITE_USE_MOCK env var | MSW (Mock Service Worker) | Simpler for this project. MSW overkill when backend will be built soon. |
| 11 | Org chart rendering | react-organizational-chart | D3 custom, GoJS | Lightweight, React-native, sufficient for our needs |
| 12 | Notifications (UI) | sonner | react-toastify | Already in rental app. Clean API. |

---

## 8. Environment Configuration

### 8.1 Backend (application-dev.yml)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/hr_db
    username: ${HR_DB_USER:root}
    password: ${HR_DB_PASS:root123}
  flyway:
    enabled: true
    baseline-on-migrate: true
  jpa:
    hibernate:
      ddl-auto: validate    # Flyway manages schema, Hibernate validates
    show-sql: false

hr:
  jwt:
    secret: ${HR_JWT_SECRET}
    expiration: 1800000      # 30 minutes
    refresh-expiration: 604800000  # 7 days
  security:
    cors-origins: http://localhost:5173
  cache:
    jobs-ttl: 3600           # 1 hour
    departments-ttl: 900     # 15 min
```

### 8.2 Frontend (.env)

```bash
VITE_API_BASE_URL=http://localhost:8080/app/hr/api/v1
VITE_USE_MOCK=true           # Set to false when backend is ready
```

### 8.3 .env.example (committed to git)

```bash
# Backend
HR_DB_USER=root
HR_DB_PASS=
HR_JWT_SECRET=               # Generate: openssl rand -base64 32

# Frontend
VITE_API_BASE_URL=http://localhost:8080/app/hr/api/v1
VITE_USE_MOCK=true

# MCP (for labs)
HR_DB_READONLY_USER=hr_readonly
HR_DB_READONLY_PASS=readonly_pass
```

---

## 9. Testing Strategy

| Layer | Tool | Coverage Target | What to Test |
|---|---|---|---|
| Backend Unit | JUnit 5 + Mockito | 80% | Service methods, business logic, validation |
| Backend Integration | Spring Boot Test + Testcontainers | Key flows | Full request lifecycle with real DB |
| Frontend Unit | Vitest + Testing Library | 80% | Components, hooks, services |
| Frontend E2E | Playwright (via MCP) | Critical paths | Login, hire wizard, directory, RBAC |
| Accessibility | jest-axe + Storybook a11y addon | All components | WCAG 2.1 AA compliance |
| Visual Regression | Storybook | Components | Prevent unintended visual changes |

---

## 10. Deployment Architecture (Local Dev)

```
┌──────────────────────────────────────────────┐
│ Developer Machine                             │
│                                               │
│  ┌─────────────┐    ┌─────────────────────┐ │
│  │ Vite Dev    │    │ Spring Boot         │ │
│  │ Server      │───▶│ (port 8080)         │ │
│  │ (port 5173) │    │                     │ │
│  └─────────────┘    └──────────┬──────────┘ │
│                                 │            │
│                      ┌──────────▼──────────┐ │
│                      │ MySQL 8.0           │ │
│                      │ (port 3306)         │ │
│                      │ Database: hr_db     │ │
│                      └─────────────────────┘ │
└──────────────────────────────────────────────┘

Vite proxies /app/hr/api/* → localhost:8080
```

Vite config for API proxy:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/app/hr/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
});
```

---

## Next Steps

After this technical design is reviewed and approved:
1. **Create Work Breakdown Structure (WBS)** — detailed tasks, dependencies, acceptance criteria
2. **Bootstrap the project** — create both Maven and npm projects, CLAUDE.md, initial configs
3. **Start Phase 1** — parallel tracks for backend utilities and frontend component library
