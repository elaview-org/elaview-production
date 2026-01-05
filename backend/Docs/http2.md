# Local Development Certificate (Self-Signed, HTTP/2)

This document describes how to generate a **self-signed TLS certificate**
for local development using **dotnet dev-certs**.

All files are contained under `./TLS`.

Domain used: `localhost`

---

## Prerequisites

- .NET SDK installed
- Commands run from the **project root**

---

## Directory Setup

```bash
mkdir -p TLS
```

---

## Step 1 — Generate Self-Signed Certificate

Run from the project root:

```bash
dotnet dev-certs https -ep ./TLS/dev-cert.pfx -p dev-password --trust
```

Flags explained:

* `-ep` — Export path for the certificate file
* `-p` — Password for the PFX file
* `--trust` — Install certificate in system trust store (optional but recommended)

---

## Step 2 — Certificate Files

On success, certificate is created at:

```
./TLS/dev-cert.pfx
```

This is a **self-signed certificate**:

* Valid for `localhost` only
* Trusted by your system (if `--trust` was used)
* HTTP/2 compatible
* Not suitable for HTTP/3 (requires publicly trusted cert)

---

## Step 3 — Update Environment Variables

Update your `.env` file:

```bash
SERVER_TLS_CERT_PATH=TLS/dev-cert.pfx
SERVER_TLS_CERT_PASSWORD=dev-password
```

---

## Step 4 — Start the Application

```bash
docker compose up --build -d
```

The application will start with HTTPS enabled on `https://localhost:7106`

---

## Verification

Test the endpoint:

```bash
curl -k https://localhost:7106/
```

Or open in browser:

```
https://localhost:7106
```

If you used `--trust`, your browser will accept the certificate without warnings.

---

## Renewal

Self-signed certificates expire after a period. To regenerate:

```bash
dotnet dev-certs https --clean
dotnet dev-certs https -ep ./TLS/dev-cert.pfx -p dev-password --trust
```

Then restart the application.

---

## Platform-Specific Trust Issues

### Windows

The `--trust` flag should work automatically.

### macOS

You may need to manually trust the certificate in Keychain Access:

1. Open Keychain Access
2. Find "localhost" certificate
3. Double-click and set to "Always Trust"

### Linux

The `--trust` flag may not work. Install manually:

```bash
dotnet dev-certs https -ep ~/.dotnet/dev-cert.crt --format PEM
sudo cp ~/.dotnet/dev-cert.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

---

## Notes

* Self-signed certificates only work for `localhost`
* Browsers will show warnings unless the certificate is trusted
* Not suitable for HTTP/3 (use Let's Encrypt as described in `http3.md`)
* Perfect for local development with HTTP/1.1 and HTTP/2
* No DNS configuration required