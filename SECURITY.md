# Security Controls

## CSRF Protection

Authentication routes use Better Auth origin validation through
`baseURL` and `trustedOrigins`.

Custom state-changing API routes validate:

- The `Origin` or `Referer` header
- The request origin against an explicit allowlist
- The `Sec-Fetch-Site` header
- Authentication and role authorization where required

State-changing requests using POST, PATCH, PUT, or DELETE from
untrusted origins are rejected with HTTP 403.

Allowed development origin:

- http://localhost:3000

Production origins are configured using:

- BETTER_AUTH_URL
- NEXT_PUBLIC_APP_URL
