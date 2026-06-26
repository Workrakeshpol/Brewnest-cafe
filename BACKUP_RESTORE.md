# BACKUP_RESTORE

## PostgreSQL Backup

### Manual Backup (CLI)
```bash
# Replace parameters with your actual values or use the .env variables
PGHOST=localhost \
PGPORT=5432 \
PGUSER=brewnest \
PGPASSWORD=brewnest \
pg_dump -Fc -d brewnest -f backup_$(date +%F).dump
```
- `-Fc` creates a **custom-format** dump that can be restored with `pg_restore`.
- Store the dump files in a secure, off‑site location (S3, Google Cloud Storage, etc.).
- Rotate backups (e.g., keep last 7 daily, last 4 weekly, last 12 monthly).

### Automated Backup (Docker Compose)
Add a **cron** service that runs nightly:
```yaml
  pg-backup:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      PGHOST: db
      PGPORT: 5432
      PGUSER: ${POSTGRES_USER}
      PGPASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./backups:/backups
    command: >
      sh -c "while true; do
        pg_dump -Fc -d ${POSTGRES_DB} -f /backups/backup_$(date +%F).dump;
        sleep 86400; done"
``` 
The `backups` directory is mounted to the host for persistence.

## Restore Procedure
```bash
# Restore into a fresh database (or drop the existing one first)
createdb -U brewnest -h localhost restored_brewnest
pg_restore -U brewnest -d restored_brewnest -Fc backup_2026-06-26.dump
```
- Verify the restoration by running a quick query:
  ```sql
  SELECT count(*) FROM users;
  ```
- If using Docker, you can exec into the container:
  ```bash
  docker exec -i brewnest-db pg_restore -U brewnest -d brewnest -Fc /backups/backup_2026-06-26.dump
  ```

## Disaster Recovery Checklist
1. **Validate** that recent backups exist and are not corrupted (`pg_restore --list` can list contents).
2. **Test** restore on a staging environment at least once a month.
3. **Store** backups in at least two geographically separate locations.
4. **Rotate** encryption keys periodically and keep the decryption keys safe.
5. **Document** the recovery time objective (RTO) and recovery point objective (RPO) for the business.

---
*For managed PostgreSQL services (Supabase, AWS RDS, Neon), use their built‑in backup features and configure automated daily snapshots.*
