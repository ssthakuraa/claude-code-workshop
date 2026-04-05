---
name: scaffold-entity
description: Scaffold a complete HR entity (Entity, Repo, DTO, Request, Service, Controller) following CLAUDE.md conventions
user-invocable: true
---

## Entity Scaffolding Pattern

When invoked, generate all 6 layers for an HR entity:

### 1. Entity (model/)
- Class: Hr{EntityName}, @Entity, @Table(name = "{table_name}")
- @SQLRestriction("deleted_at IS NULL") for soft delete
- @EntityListeners(HrAuditListener.class)
- FKs: @ManyToOne(fetch = FetchType.LAZY)
- PK strategy: @GeneratedValue(strategy = GenerationType.IDENTITY) for Integer PKs
- String PKs (CHAR columns): no @GeneratedValue — assigned manually

### 2. Repository (repository/)
- Hr{EntityName}Repository extends JpaRepository<Hr{EntityName}, {IdType}>

### 3. DTO (dto/response/)
- Hr{EntityName}DTO with all display fields

### 4. Request (dto/request/)
- Hr{EntityName}Request with validation annotations (@NotBlank, @Size, etc.)

### 5. Mapper (mapper/)
- Hr{EntityName}Mapper using MapStruct (@Mapper(componentModel = "spring"))
- toDTO, fromRequest, updateFromRequest methods

### 6. Service (service/)
- Hr{EntityName}Service with HrLogHelper entry/exit on EVERY method
- findAll, findById, create, update, delete
- @Transactional, @PreAuthorize on all methods
- ALL methods annotated with appropriate RBAC role

### 7. Controller (controller/)
- Hr{EntityName}Controller at /app/hr/api/v1/{plural_name}
- ALL endpoints return HrApiResponse<T> or HrPagedResponse<T>
- Never return raw objects

## Gotchas
- Use @SQLRestriction NOT @Where (deprecated Hibernate 6.2)
- Column names must match schema.sql exactly (PhysicalNamingStrategyStandardImpl)
- Never log PII in HrLogHelper calls — use MASKED placeholder
- countryId uses String type (CHAR(2) column), not Integer
- FK relationships use @ManyToOne(fetch = FetchType.LAZY)
- Soft delete: deletedAt Instant field + @SQLRestriction

## Usage Example

```
/scaffold-entity
Entity: Notification
Table: hr_notifications
Fields:
- notificationId (Long, PK, auto-generated)
- recipientUserId (Integer, FK → HrUser, required)
- notificationType (ENUM: PROBATION_ALERT, CONTRACT_EXPIRY, ACTION_COMPLETE, SYSTEM)
- title (String, max 255, required)
- message (String/TEXT)
- referenceTable (String, max 60)
- referenceId (String, max 60)
- isRead (Boolean, default false)
- createdAt (Instant, auto)
```
```
