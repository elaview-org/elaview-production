# Handy Commands

### Login

```bash
curl -i -k -X POST http://localhost:7106/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@email.com","password":"admin123"}'
```