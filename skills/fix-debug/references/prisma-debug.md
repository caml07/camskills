# Prisma Debugging

## Common Issues

### Connection Errors

```bash
# Test connection
npx prisma db push --skip-generate

# Check DATABASE_URL format:
# PostgreSQL: postgresql://user:password@host:port/db
# SQLite: file:./dev.db
# MySQL: mysql://user:password@host:port/db

# Common mistakes:
# - Missing SSL/TLS config for cloud databases
# - Wrong port (PostgreSQL default: 5432)
# - Special chars in password not URL-encoded
```

### Migration Errors

```bash
# Reset (drops data):
npx prisma migrate reset

# Create migration from scratch:
npx prisma migrate dev --name init

# Apply migrations:
npx prisma migrate deploy

# If migration is stuck:
# 1. Check _prisma_migrations table
# 2. Delete the stuck migration's folder
# 3. npx prisma migrate resolve --rolled-back <migration-name>
```

### Type Errors (Generated Client)

```bash
# Regenerate client:
npx prisma generate

# If types don't match:
# 1. Check schema.prisma for relation references
# 2. Run `prisma validate`
# 3. Delete node_modules/.prisma and regenerate
```

### Query Performance

- Use `select` not `include` when you need specific fields
- Use `batch` or `createMany` for bulk operations
- For large datasets, paginate with `skip`/`take` or `cursor`
- `findMany` with large `where` clauses can be slow — add database indexes

### n + 1 Problem

```prisma
// Bad: N+1 queries
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } })
}

// Good: single query with include
const users = await prisma.user.findMany({
  include: { posts: true }
})
```
