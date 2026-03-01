# Multi-Cloud Infrastructure Best Practices (AWS / GCP / Azure / Cloudflare)

## Overview

This document provides practical guidelines for designing and operating infrastructure on AWS / GCP / Azure / Cloudflare, organized based on primary sources (official documentation) from each cloud provider.
Survey date: 2026-02-28

## Common Principles (Shared Across All 4 Clouds)

1. **Adopt a Well-Architected framework as the top-level guiding principle**
   - Start by defining non-functional requirements (security, availability, cost, operations) using each cloud's official framework.
2. **Build the Landing Zone / foundation layer first**
   - Implement account/subscription/project separation, IAM, networking, and log aggregation upfront.
3. **Make IaC the sole path for changes**
   - Manage declaratively with Terraform, etc., and limit manual changes to exceptional operations only.
4. **Separate State and permissions**
   - Isolate State per environment, and enforce short-lived credentials (e.g., OIDC) with least-privilege for CI/CD.
5. **Embed policy/audit/scanning into the pipeline**
   - Standardize Policy as Code, static analysis, and centralized audit log aggregation.

## Cloud-Specific Best Practices

### AWS

1. **Design Standards**
   - Use the AWS Well-Architected Framework (2024-11-06 edition) as the design review baseline.
2. **Organization Design (Landing Zone / Multi-account)**
   - Base the design on AWS Control Tower + AWS Organizations, assuming multi-account by default.
   - Workload isolation should be based on "multiple accounts," avoiding workload placement in the management account.
3. **Terraform Operations**
   - Standardize the following per AWS Prescriptive Guidance:
     - Short-lived credentials via OIDC integration (GitHub Actions/GitLab)
     - Least-privilege IAM, leveraging Secrets Manager
     - S3 remote backend + per-environment backend separation
     - State versioning/audit logging (CloudTrail) and version checks in CI

### GCP

1. **Design Standards**
   - Adopt the Google Cloud Well-Architected Framework (Last reviewed: 2026-01-28).
2. **Foundation Design**
   - Refer to the Enterprise foundations blueprint to standardize organizational hierarchy, organization policies, log aggregation, and secret management.
3. **Terraform Operations**
   - Follow Terraform best practices (general style / reusable modules), enforcing:
     - Unified naming conventions (identifier consistency)
     - Purpose-based file splitting (avoid over-splitting)
     - Separation of modules and root configuration, placing supplementary documentation in `docs/`

### Azure

1. **Design Standards**
   - Lock down non-functional requirements using the Azure Well-Architected Framework's 5 Pillars (Reliability / Security / Cost Optimization / Operational Excellence / Performance Efficiency).
2. **Landing Zone Design**
   - Separate Platform Landing Zone and Application Landing Zone, governing through management groups and policy inheritance.
3. **Terraform Operations**
   - Prioritize Azure Verified Modules (AVM) for Platform Landing Zones (2025-01-21) and the Azure landing zone accelerator.
   - Bootstrap the repository/pipeline/State management foundation first, then update exclusively via CI/CD going forward.

### Cloudflare

1. **Terraform Application Policy**
   - Follow Cloudflare's official Terraform Best Practices, managing target resources centrally through Terraform.
2. **Configuration Separation**
   - Separate directories by account, zone, and product to clarify ownership and State scope.
   - For environments (staging/QA/UAT/prod), account and domain separation is recommended.
3. **Authentication and State Management**
   - Use Account API Tokens appropriate to the use case, minimizing permissions (explicitly selecting Read/Edit).
   - Use R2 as a remote backend as needed, migrating away from local State.

## Implementation Checklist (Minimum Set)

1. A "design standards framework" has been selected for each cloud
2. Initial Landing Zone construction (organizational structure, networking, IAM, audit logs) is complete
3. Environment separation (dev/stg/prod) and State separation are implemented in the IaC repository
4. `plan -> review -> apply` and security scanning are implemented in CI/CD
5. Migration to short-lived credentials (OIDC, etc.) is complete, and long-lived secrets have been eliminated
6. Operational procedures for detecting exceptional manual changes and remediating drift are defined

## References (Primary Sources)

### AWS
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [Best practices for using the Terraform AWS Provider (AWS Prescriptive Guidance)](https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/introduction.html)
- [Landing zone (AWS Prescriptive Guidance)](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-migration/aws-landing-zone.html)
- [Organizing Your AWS Environment Using Multiple Accounts (AWS Whitepaper, Publication date: 2025-04-30)](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)

### GCP
- [Google Cloud Well-Architected Framework (Last reviewed: 2026-01-28)](https://cloud.google.com/architecture/framework)
- [Best practices for general style and structure (Terraform on Google Cloud, Last updated: 2026-02-25)](https://cloud.google.com/docs/terraform/best-practices-for-terraform)
- [Best practices for reusable modules (Terraform on Google Cloud, Last updated: 2026-02-25)](https://docs.cloud.google.com/docs/terraform/best-practices/reusable-modules)
- [Enterprise foundations blueprint (Last updated: 2025-05-15)](https://cloud.google.com/architecture/security-foundations)

### Azure
- [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
- [What is an Azure landing zone? (Last updated: 2025-12-15)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/)
- [Platform landing zone implementation options (Last updated: 2025-12-15)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/implementation-options)
- [Azure Verified Modules for Platform Landing Zones (ALZ) (Article date: 2025-01-21)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/terraform-landing-zone)

### Cloudflare
- [Cloudflare Terraform provider overview (Last updated: 2025-03-14)](https://developers.cloudflare.com/terraform/)
- [Cloudflare Terraform best practices (Last updated: 2025-05-29)](https://developers.cloudflare.com/terraform/advanced-topics/best-practices/)
- [Remote R2 backend (Last updated: 2025-11-07)](https://developers.cloudflare.com/terraform/advanced-topics/remote-backend/)
- [Create API token (Last updated: 2026-02-09)](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [Cloudflare Reference Architectures (Last updated: 2024-12-30)](https://developers.cloudflare.com/reference-architecture/)
