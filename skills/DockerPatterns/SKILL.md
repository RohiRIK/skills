---
name: DockerPatterns
description: "Reference for Docker and Docker Compose local dev patterns. USE WHEN writing a Dockerfile or compose file, or containerizing local dev."
category: reference
effort: low
domain: ops
user-invocable: false
---

# Docker Patterns

Docker and Docker Compose best practices for containerized development.

## When to Activate

- Setting up Docker Compose for local development
- Designing multi-container architectures
- Troubleshooting container networking or volume issues
- Reviewing Dockerfiles for security and size
- Migrating from local dev to containerized workflow

## Reference

Load the file matching the task:

| Topic | File |
|-------|------|
| Compose stack, multi-stage Dockerfiles, override files | `Compose.md` |
| Service discovery, custom networks, volume strategies | `Networking.md` |
| Dockerfile hardening, compose security, secrets, `.dockerignore` | `Security.md` |
| Logs, exec, inspect, rebuild, network debugging | `Debugging.md` |

## Anti-Patterns

```
# BAD: Using docker compose in production without orchestration
# Use Kubernetes, ECS, or Docker Swarm for production multi-container workloads

# BAD: Storing data in containers without volumes
# Containers are ephemeral -- all data lost on restart without volumes

# BAD: Running as root
# Always create and use a non-root user

# BAD: Using :latest tag
# Pin to specific versions for reproducible builds

# BAD: One giant container with all services
# Separate concerns: one process per container

# BAD: Putting secrets in docker-compose.yml
# Use .env files (gitignored) or Docker secrets
```

## Gotchas

- Order Dockerfile layers from least- to most-frequently-changed so the build cache survives code edits; copying source before installing deps busts the cache every build.
- Bind-mount source for local dev, but never bake secrets into an image layer — they persist in history even if later removed.

## Examples

**Example 1: Local dev compose**
```
User: "set up docker-compose for my app + postgres"
→ service definitions, volume for db, source bind-mount, healthcheck
```

**Example 2: Slim image**
```
User: "my image is huge"
→ multi-stage build, layer ordering, .dockerignore
```
