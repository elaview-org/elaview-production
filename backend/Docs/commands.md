# Handy Commands

### Login

```bash
curl -i -k -X POST http://localhost:7106/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@email.com","password":"admin123"}'
```

### EF Core Migrations

```bash
dotnet ef migrations add MigrationName --output-dir Shared/Migrations
dotnet ef database update
```

### Start with a fresh development database

```bash
dotnet ef migrations add MyMigrationName --project ElaviewBackend.csproj --output-dir Shared/Migrations
dotnet ef database drop -f
dotnet ef database update
docker compose up -d server
```

### Local TLS Certificate (Let’s Encrypt, DNS-01, HTTP/3)

This document describes how to generate a **publicly trusted TLS 1.3 certificate**
for local development using **certbot (DNS-01)**.

All files are contained under `./TLS`.

Domain used in this example: `dev.example.com`

---

#### Prerequisites

- Control over DNS for the domain
- Ability to add/remove TXT records
- Linux / macOS / WSL
- `certbot` installed
- Commands run from the **project root**

---

#### Directory Setup

```bash
mkdir -p TLS
````

---

#### Step 1 — Install certbot

##### Ubuntu / Debian / WSL

```bash
sudo apt update
sudo apt install certbot
```

##### macOS

```bash
brew install certbot
```

---

#### Step 2 — Request Certificate (DNS-01, manual)

Run from the project root:

```bash
certbot certonly \
  --manual \
  --preferred-challenges dns \
  --config-dir ./TLS/certbot-config \
  --work-dir ./TLS/certbot-work \
  --logs-dir ./TLS/certbot-logs \
  -d dev.example.com
```

---

#### Step 3 — Add DNS TXT Record

Certbot will prompt with:

```
_acme-challenge.dev.example.com
Value: <TOKEN>
```

Add this record in your DNS provider:

* Type: TXT
* Name: `_acme-challenge.dev.example.com`
* Value: `<TOKEN>`
* TTL: 60 (or lowest allowed)

Verify propagation:

```bash
dig TXT _acme-challenge.dev.example.com
```

Once visible, return to certbot and press **Enter**.

---

#### Step 4 — Certificate Files

On success, certificates are created at:

```
./TLS/certbot-config/live/dev.example.com/
  ├── cert.pem
  ├── chain.pem
  ├── fullchain.pem
  └── privkey.pem
```

This is a **real Let’s Encrypt certificate**:

* Publicly trusted
* TLS 1.3 capable
* HTTP/3 compatible

---

#### Step 5 — Convert to PFX for .NET / Kestrel

```bash
openssl pkcs12 -export \
  -out ./TLS/dev.example.com.dev.pfx \
  -inkey ./TLS/certbot-config/live/dev.example.com/privkey.pem \
  -in ./TLS/certbot-config/live/dev.example.com/fullchain.pem
```

You will be prompted for a password.

Result:

```
./TLS/dev.example.com.dev.pfx
```

---

#### Step 6 — Local Domain Mapping

Add to hosts file:

```
127.0.0.1 dev.example.com
::1       dev.example.com
```

This ensures the domain resolves **locally only**.

---

#### Renewal

Manual renewal (same layout):

```bash
certbot certonly \
  --manual \
  --preferred-challenges dns \
  --config-dir ./TLS/certbot-config \
  --work-dir ./TLS/certbot-work \
  --logs-dir ./TLS/certbot-logs \
  -d dev.example.com
```

After renewal, re-run the PFX export step.

---

#### Notes

* Multiple certificates per domain are normal
* Production certificates are not reused
* HTTP/3 requires a trusted certificate (no exceptions)
* DNS-01 is the correct approach for local dev with real domains