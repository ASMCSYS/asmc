## Production Deployment Guide: Migrating From One Server to Another

This document provides a comprehensive, step‑by‑step guide for migrating a production workload from a source server (Server A) to a target server (Server B) with minimal downtime and a clear rollback. It is platform‑agnostic and Linux‑oriented, with concrete examples for common stacks.

### Who this is for
- **Audience**: DevOps, SREs, Platform Engineers, senior developers owning production.
- **Assumptions**: You have root/sudo on both servers, SSH access, and change control to make DNS/traffic changes. OS is Linux (systemd). Shell is `/usr/bin/bash`.

---

## 1) Migration strategies at a glance

- **Blue/Green cutover**: Stand up B fully, validate, then shift traffic (DNS/LB). Safest; requires extra resources.
- **Rolling/In-place**: Migrate in segments while keeping service up; typically for clusters.
- **Lift‑and‑shift**: Rsync files and restore DB backup on B; brief downtime during final sync.
- **Immutable images**: Rebuild image/AMI/container; deploy to B; cutover.
- **Data‑first**: Replicate DB continuously to B first, then switch app traffic.

Choose based on your RTO/RPO, service complexity, and tolerance for parallel infra.

---

## 2) Pre‑migration checklist (plan and verify)

- **Access**
  - SSH key‑based access to A and B.
  - Sudo without password prompts for automation if possible.
- **Networking**
  - Ingress/egress firewall rules allow required ports (SSH 22, HTTP/S 80/443, app ports, DB ports).
  - DNS control and ability to adjust TTL or switch load balancer backends.
- **Capacity**
  - B has equal or greater CPU, RAM, disk, and IOPS than A.
  - Sufficient free space for data + backups + temporary artifacts.
- **OS baseline**
  - Matching or compatible distro and versions for runtime dependencies.
  - Time sync enabled (chrony or systemd‑timesyncd).
- **Security**
  - Plan for secrets (Vault/SSM/KMS or encrypted files). No secrets in git.
  - OS hardening, firewall, fail2ban as applicable.
- **App inventory**
  - Application code/artifacts, runtime (Node/Python/Java/Ruby/Go/PHP), reverse proxy, app server.
  - Databases (PostgreSQL/MySQL/Mongo/etc.), caches (Redis/Memcached), queues (RabbitMQ/Kafka), search (Elasticsearch).
  - Background workers, cron/systemd timers, one‑off scripts.
  - TLS certs/keys and ACME/renewal jobs.
  - Monitoring/metrics/alerts, logging/shipping, backups, logrotate.
- **Cutover & rollback**
  - Defined cutover steps, success criteria, and a tested rollback.
  - Maintenance window and stakeholder comms template.

---

## 3) Prepare the target server (B)

### 3.1 Base OS configuration

- Create an admin user and set SSH keys:
  ```bash
  adduser deployer
  usermod -aG sudo deployer
  install -d -m 700 -o deployer -g deployer /home/deployer/.ssh
  install -m 600 -o deployer -g deployer /home/deployer/.ssh/authorized_keys /dev/null
  # paste your pubkey into authorized_keys
  ```
- SSH hardening (`/etc/ssh/sshd_config`):
  ```
  PasswordAuthentication no
  PermitRootLogin prohibit-password
  PubkeyAuthentication yes
  ```
  Then: `systemctl reload sshd`
- Time sync and timezone:
  ```bash
  timedatectl set-timezone UTC
  timedatectl set-ntp true
  ```
- Basic packages:
  ```bash
  apt-get update && apt-get -y upgrade
  apt-get install -y curl wget git rsync jq ufw fail2ban
  ```
- Firewall (UFW example):
  ```bash
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw enable
  ```

### 3.2 Runtime and dependencies

Install the language/runtime and stack you use. Examples:
- Node.js via NodeSource, Python via pyenv or apt, Java via temurin, PHP‑FPM, Ruby via rbenv, Go via tarball.
- Reverse proxy: Nginx or Caddy; app server: gunicorn/uwsgi/PM2/puma/etc.
- Database server if it will be local to B.

Example (Nginx + Node + PM2):
```bash
apt-get install -y nginx
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs build-essential
npm install -g pm2@latest
``` 

### 3.3 Users, directories, and permissions

```bash
useradd --system --home-dir /srv/myapp --shell /usr/sbin/nologin myapp
install -d -m 750 -o myapp -g myapp /srv/myapp/{releases,shared,logs,tmp}
```

### 3.4 Secrets and environment

Store runtime configuration in environment files with strict permissions:
```bash
install -m 600 -o myapp -g myapp /srv/myapp/shared/.env /dev/null
# Edit /srv/myapp/shared/.env with your variables
```

Example `/srv/myapp/shared/.env`:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@db.internal:5432/mydb?sslmode=require
REDIS_URL=redis://:password@redis.internal:6379/0
SESSION_SECRET=change-me
``` 

---

## 4) Data migration (DB and files)

Choose one:
- **Backup and restore** (simple, downtime during cutover)
- **Continuous replication** (near‑zero downtime)
- **Storage snapshot** (LVM/ZFS/volume snapshots)

### 4.1 Files (uploads, assets, state)

Initial sync from A → B, then an incremental sync during cutover:
```bash
# From B, pull from A
rsync -aHAX --numeric-ids --delete --info=progress2 \
  -e "ssh -o StrictHostKeyChecking=no" \
  root@A.EXAMPLE.COM:/srv/myapp/shared/uploads/ \
  /srv/myapp/shared/uploads/

# Verify ownership and permissions
chown -R myapp:myapp /srv/myapp/shared/uploads
find /srv/myapp/shared/uploads -type d -exec chmod 750 {} +
find /srv/myapp/shared/uploads -type f -exec chmod 640 {} +
```

Optional integrity verification:
```bash
ssh root@A.EXAMPLE.COM 'find /srv/myapp/shared/uploads -type f -print0 | xargs -0 sha256sum' | sort -k2 > /tmp/hashes_a.txt
find /srv/myapp/shared/uploads -type f -print0 | xargs -0 sha256sum | sort -k2 > /tmp/hashes_b.txt
diff -u /tmp/hashes_a.txt /tmp/hashes_b.txt | wc -l
```

### 4.2 PostgreSQL

Option A: logical backup/restore (simple):
```bash
# On A
PGPASSWORD="$PGPASS" pg_dump --format=custom --file=/root/pgdump.c \
  --host=127.0.0.1 --username=postgres mydb
scp /root/pgdump.c root@B.EXAMPLE.COM:/root/

# On B
createdb -h 127.0.0.1 -U postgres mydb
PGPASSWORD="$PGPASS" pg_restore --clean --if-exists --no-owner --no-privileges \
  --host=127.0.0.1 --username=postgres --dbname=mydb /root/pgdump.c
```

Option B: continuous replication (near‑zero downtime):
```bash
# On A (primary)
psql -U postgres -c "CREATE USER replicator REPLICATION LOGIN ENCRYPTED PASSWORD 'strong-pass';"
psql -U postgres -c "SELECT pg_create_physical_replication_slot('slot_b');"

# On B (standby)
systemctl stop postgresql
rm -rf /var/lib/postgresql/14/main/*
PGPASSWORD='strong-pass' pg_basebackup -h A.EXAMPLE.COM -D /var/lib/postgresql/14/main -U replicator -v -P -R \
  --slot=slot_b --wal-method=stream
# Configure primary_conninfo in postgresql.conf or via -R
systemctl start postgresql
# Promote during cutover:
# psql -U postgres -c 'SELECT pg_promote();'
```

### 4.3 MySQL/MariaDB

Backup/restore:
```bash
mysqldump --single-transaction --routines --triggers --events -u root -p mydb | gzip > /root/mydb.sql.gz
scp /root/mydb.sql.gz root@B.EXAMPLE.COM:/root/
mysql -u root -p -e 'CREATE DATABASE mydb;'
gunzip -c /root/mydb.sql.gz | mysql -u root -p mydb
```

Replication (outline):
- Create replication user, note binlog file/position.
- Configure `CHANGE MASTER TO ...` on B and `START SLAVE;` (or GTID‑based).
- Stop replication at cutover, ensure relay log applied, then point app to B.

### 4.4 Redis/Elasticsearch/Mongo

- Redis: configure B as replica of A; during cutover, `replicaof no one` on B.
- Elasticsearch: snapshot to repository, restore on B.
- MongoDB: add B to replica set, allow it to catch up; step down A during cutover.

---

## 5) Application deployment on B

### 5.1 Obtain artifacts

Prefer immutable artifacts built by CI (tarballs or container images). Examples:
```bash
# Tarball deploy
install -d -m 750 -o myapp -g myapp /srv/myapp/releases/2025-08-08_1200
scp ci@CI.SERVER:/artifacts/myapp_2025-08-08_1200.tar.gz /tmp/
tar -xzf /tmp/myapp_2025-08-08_1200.tar.gz -C /srv/myapp/releases/2025-08-08_1200

# Symlink current release
ln -sfn /srv/myapp/releases/2025-08-08_1200 /srv/myapp/current
chown -h myapp:myapp /srv/myapp/current
```

### 5.2 Dependencies and build steps

If building on B (not recommended for prod parity), run:
```bash
cd /srv/myapp/current
export $(cat /srv/myapp/shared/.env | xargs)
# Node example
npm ci --only=production
npm run build
```

### 5.3 Systemd services

Create a service for the app server:
```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=MyApp Production Service
After=network-online.target
Wants=network-online.target

[Service]
User=myapp
Group=myapp
WorkingDirectory=/srv/myapp/current
EnvironmentFile=/srv/myapp/shared/.env
ExecStart=/usr/bin/node /srv/myapp/current/server.js
Restart=always
RestartSec=5
StandardOutput=append:/srv/myapp/logs/app.log
StandardError=append:/srv/myapp/logs/app.err

[Install]
WantedBy=multi-user.target
```

Then:
```bash
systemctl daemon-reload
systemctl enable --now myapp.service
systemctl status myapp.service | cat
```

### 5.4 Reverse proxy (Nginx)

```nginx
# /etc/nginx/sites-available/myapp.conf
server {
    listen 80;
    server_name example.com www.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;

    client_max_body_size 25m;

    location /healthz {
        access_log off;
        return 200 'ok';
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }
}
```

Enable and reload:
```bash
ln -sfn /etc/nginx/sites-available/myapp.conf /etc/nginx/sites-enabled/myapp.conf
nginx -t && systemctl reload nginx
```

Certs via Let’s Encrypt:
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d example.com -d www.example.com --redirect --non-interactive --agree-tos -m admin@example.com
systemctl list-timers | grep certbot | cat
```

---

## 6) Observability, backups, and ops

- **Metrics**: Install node_exporter/Telegraf. Expose app `/metrics` if applicable.
- **Logs**: Ship logs via Fluent Bit/Filebeat to central store. Configure logrotate for `/srv/myapp/logs/*.log`.
- **Alerts**: Health, latency, error rate, saturation, disk space, certificate expiry.
- **Backups**: Schedule DB and file backups on B and test restore quarterly.
- **Security**: Fail2ban with Nginx/SSHD jails, restrict SSH by IP if possible, keep packages updated.

---

## 7) Dry run and validation

- **Smoke tests**: Curl key endpoints from B and externally.
  ```bash
  curl -i http://127.0.0.1:3000/healthz
  curl -I https://example.com/healthz --resolve example.com:443:B.PUBLIC.IP
  ```
- **Functional checks**: Login, CRUD, file upload/download, background jobs queueing.
- **Performance**: Light load test against B to confirm headroom.

---

## 8) Cutover plan (low‑risk)

1. **Reduce DNS TTL** 24–48h before (e.g., to 60s).
2. **Freeze writes** (if not using replication): put A in maintenance mode or disable mutating endpoints.
3. **Final data sync**:
   ```bash
   # Files
   rsync -aHAX --delete --info=progress2 -e "ssh -o StrictHostKeyChecking=no" \
     root@A.EXAMPLE.COM:/srv/myapp/shared/uploads/ /srv/myapp/shared/uploads/
   # Database
   # For Postgres logical: take a brief downtime backup and restore; for replication: ensure B is caught up and promote
   ```
4. **Switch traffic**:
   - Update DNS A records to B.PUBLIC.IP (low TTL) or
   - Update load balancer backend to B.
5. **Warm verification**: Confirm health checks green, run smoke tests, check logs/metrics.
6. **Unfreeze writes** and monitor closely for 1–2 hours.

Success criteria:
- Error rate normal, latency within SLOs, no data inconsistency.

---

## 9) Rollback plan

Keep A warm until confidence window passes.
- If issues: revert DNS/LB back to A.
- If DB diverged: decide whether to accept short downtime to re‑sync or to operate in degraded mode temporarily.
- Document incident and corrective actions.

---

## 10) Post‑cutover tasks

- Update documentation with new IPs/hostnames and runbooks.
- Ensure backups on B are running and valid.
- Ensure monitoring and alerts target B.
- Remove any temporary firewall holes and maintenance flags.
- After the confidence window, securely decommission A: wipe disks, remove credentials, update inventories.

---

## 11) Automation examples (optional)

### 11.1 Ansible inventory and playbook (sketch)

```ini
# /etc/ansible/hosts
[old]
a.example.com

[new]
b.example.com
```

```yaml
# deploy.yml
- hosts: new
  become: true
  tasks:
    - name: Ensure base packages
      apt:
        name: ["curl", "git", "rsync", "nginx"]
        state: present
        update_cache: yes

    - name: Create app user and dirs
      file:
        path: "/srv/myapp/{{ item }}"
        state: directory
        owner: myapp
        group: myapp
        mode: "0750"
      loop: ["shared", "releases", "logs", "tmp"]

    - name: Deploy systemd service
      template:
        src: templates/myapp.service.j2
        dest: /etc/systemd/system/myapp.service
      notify: ["restart myapp"]

  handlers:
    - name: restart myapp
      systemd:
        name: myapp
        state: restarted
        daemon_reload: yes
```

### 11.2 Docker Compose (alternative runtime)

```yaml
version: "3.9"
services:
  app:
    image: registry.example.com/myapp:2025-08-08_1200
    env_file: /srv/myapp/shared/.env
    ports:
      - "127.0.0.1:3000:3000"
    restart: always
    volumes:
      - /srv/myapp/shared/uploads:/app/uploads:rw
```

Nginx `proxy_pass http://127.0.0.1:3000;` remains the same.

---

## 12) Operational checklists

### 12.1 Pre‑migration
- Access and sudo on A and B confirmed
- Backups taken and restore tested
- Capacity verified
- Firewalls configured
- DNS TTL reduced
- Target OS and runtimes installed
- Secrets and environment prepared
- Monitoring, logging, backups planned
- Cutover and rollback written

### 12.2 Day‑of migration
- Final backups created
- Maintenance mode enabled (if needed)
- Final rsync and DB sync performed
- Services started on B and health green
- Traffic switched (DNS/LB)
- Smoke tests pass externally
- Logs and metrics normal

### 12.3 Post‑migration
- Remove maintenance mode
- Monitor for errors for 24–48h
- Enable/verify backups on B
- Decommission A when ready
- Update all documentation and diagrams

---

## 13) Troubleshooting quick reference

- Port conflicts: `ss -tulpn | grep -E ":(80|443|3000)\b" | cat`
- File permissions: target user/group and umask; `namei -l /srv/myapp/current`
- SELinux/AppArmor: check denials (`ausearch -m avc -ts recent`)
- Nginx errors: `/var/log/nginx/error.log`
- App errors: `/srv/myapp/logs/app.err`
- Systemd failures: `journalctl -u myapp -b --no-pager | tail -n 200`
- DNS cache: vary TTL; flush local caches; use `dig +trace example.com`
- TLS issues: `openssl s_client -connect example.com:443 -servername example.com -tlsextdebug -status`

---

## 14) Appendix: Templates and commands

### 14.1 Systemd unit template (Node example)
```ini
[Unit]
Description=%i service
After=network-online.target
Wants=network-online.target

[Service]
User=%i
Group=%i
WorkingDirectory=/srv/%i/current
EnvironmentFile=/srv/%i/shared/.env
ExecStart=/usr/bin/node /srv/%i/current/server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

### 14.2 Logrotate snippet
```conf
# /etc/logrotate.d/myapp
/srv/myapp/logs/*.log {
  daily
  rotate 14
  compress
  delaycompress
  missingok
  notifempty
  create 0640 myapp myapp
  sharedscripts
  postrotate
    systemctl kill -s HUP myapp.service || true
  endscript
}
```

### 14.3 Rsync with exclusions
```bash
rsync -aHAX --delete --info=progress2 -e ssh \
  --exclude ".cache/" --exclude "node_modules/" \
  root@A.EXAMPLE.COM:/srv/myapp/ /srv/myapp/
```

### 14.4 Health check script
```bash
#!/usr/bin/env bash
set -euo pipefail
HOST="example.com"
for path in "/healthz" "/" "/login"; do
  code=$(curl -sk -o /dev/null -w "%{http_code}" https://$HOST$path)
  echo "$path => $code"
  [[ "$code" =~ ^2|3 ]] || { echo "FAIL: $path"; exit 1; }
done
echo "All good"
```

---

## 15) Notes on compliance and auditing

- Keep a change record with timestamps, commands run, and diffs to config.
- Capture pre/post state: versions, checksums, DB sizes, key metrics.
- Store this runbook and any red‑team/QA sign‑offs alongside your infra code.

---

If you need this tailored to your exact stack (e.g., specific database versions, containers/Kubernetes, or cloud load balancers), adapt the templates above or integrate with your existing IaC (Terraform/Ansible) and CI/CD pipelines.