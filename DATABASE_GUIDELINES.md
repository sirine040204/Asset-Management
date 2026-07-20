# Database Guidelines

This document outlines the usage of PostgreSQL 18.x and Django ORM rules.

## 1. Primary Keys
- **Strategy:** Use `UUIDv7` (or `UUIDv4`) for all externally facing models (Users, Orders, Items). Integer `id` can be used for internal joining tables.
- **Why Chosen:** Prevents ID enumeration attacks (e.g., guessing `/api/users/5`). UUIDv7 provides sequential sorting which improves database insert performance compared to UUIDv4.
- **Alternatives:** Standard auto-incrementing integers.
- **Trade-offs:** UUIDs consume more storage and are slightly slower to index than integers, but security and distributed system generation outweigh the cost.

## 2. Naming Conventions
- **Strategy:** `snake_case` for all tables and columns. Django handles this by default. Explicitly name `related_name` on ForeignKeys (e.g., `related_name="orders"`).
- **Why Chosen:** Follows PEP8 and PostgreSQL standards. Explicit related names prevent clashing and confusing reverse lookup names (`user.order_set`).

## 3. Soft Delete Strategy
- **Strategy:** Soft deletions (`is_deleted` flag) are **strictly limited to high-value business models** (e.g., `User`, `Order`). Do **not** apply soft deletes globally to all models. Use standard hard deletes for non-critical resources.
- **Why Chosen:** Prevents accidental data loss for critical records while avoiding the massive complexity of managing unique constraints (e.g., unique emails) across globally soft-deleted rows.
- **Alternatives:** Global soft deletions (violates YAGNI/KISS and complicates schemas).
- **Trade-offs:** Developers must consciously decide if a model warrants soft deletion.

## 4. Audit Fields
- **Strategy:** All major models inherit from a `TimeStampedModel` containing `created_at` and `updated_at`.
- **Why Chosen:** Essential for debugging, caching, and data analytics.

## 5. Indexing & Constraints
- **Strategy:** 
  - Add DB-level `UniqueConstraint` and `CheckConstraint` instead of relying solely on Django application-level validation.
  - Index foreign keys and fields frequently used in `filter()` or `order_by()`.
- **Why Chosen:** DB-level constraints prevent race conditions that application-level validations miss.
- **Alternatives:** Django `clean()` methods.
- **Trade-offs:** Database schema becomes slightly more complex to migrate.

## 6. Migration Strategy
- **Strategy:** Never alter existing migration files once pushed to shared branches. Always create new migrations. Run `makemigrations --check` in CI to ensure no missing migrations.
- **Why Chosen:** Prevents database state desync between developers and production.

## 7. JSON Usage
- **Strategy:** Use PostgreSQL `JSONB` for unstructured data (e.g., user preferences, third-party API payloads). Do not use it as a crutch to avoid proper relational modeling.
- **Why Chosen:** `JSONB` provides excellent querying speed while allowing flexible schemas.

## 8. Backup Strategy
- **Strategy:** Automated nightly `pg_dump` to an encrypted S3 bucket, plus Write-Ahead Logging (WAL) archiving for Point-In-Time-Recovery (PITR).
