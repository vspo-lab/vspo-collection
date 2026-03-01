---
name: Infrastructure and Code Quality
description: Infrastructure, CI/CD (GitHub Actions), security scanning, Biome lint, knip.
---

# Trigger Conditions

- When editing files under `infrastructure/`
- When modifying CI/CD workflows (`.github/workflows/`)
- When running code quality checks (biome, knip, type-check)

# Reference Documents

- `docs/infra/ci-cd.md` - CI/CD pipeline (Workload Identity authentication)
- `docs/infra/multi-cloud-best-practices.md` - Infrastructure best practices for AWS/GCP/Azure/Cloudflare
- `docs/security/lint.md` - Security/lint rules
