---
name: docker-patterns
description: "Use when reference for Docker and Docker Compose local dev patterns."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [reference]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='docker-patterns', file_path='references/compose.md') before taking any action."
---


# Docker Patterns

Docker and Docker Compose best practices for containerized development.
For activation triggers and anti-patterns see `references/activation-guide.md`.

## Reference

| Topic | File |
|-------|------|
| Compose stack, multi-stage Dockerfiles, override files | compose.md |
| Service discovery, custom networks, volume strategies | networking.md |
| Dockerfile hardening, compose security, secrets, `.dockerignore` | security.md |
| Logs, exec, inspect, rebuild, network debugging | debugging.md |

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
