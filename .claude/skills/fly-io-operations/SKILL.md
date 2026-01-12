---
name: fly-io-operations
description: SSH into Fly.io machines, upload files via SFTP, manage deployments, check machine status. Use when deploying, debugging remote servers, uploading files to Fly.io, or any operation on my-jarvis-dev.
allowed-tools: Bash
---

# Fly.io Operations

Reliable SSH, file uploads, and machine management for Fly.io apps.

## Core Principle

**Use the right tool for each job.** Don't pipe files through SSH or chain complex commands.

## Operations Reference

### 1. Simple Commands - SSH Console

Use `fly ssh console` with the `-C` flag for single commands:

```bash
# List files
fly ssh console -a my-jarvis-dev -C "ls -la /home/node/"

# Delete a file
fly ssh console -a my-jarvis-dev -C "rm /home/node/somefile"

# Create a directory
fly ssh console -a my-jarvis-dev -C "mkdir -p /home/node/guides"

# Check file contents
fly ssh console -a my-jarvis-dev -C "cat /home/node/CLAUDE.md"

# Fix ownership
fly ssh console -a my-jarvis-dev -C "chown -R node:node /home/node/guides"
```

### 2. File Uploads - SFTP Shell

**ALWAYS use sftp for file uploads.** Never pipe content through ssh.

```bash
# Upload a single file
echo "put /local/path/file.md /home/node/file.md" | fly sftp shell -a my-jarvis-dev

# Upload to a subdirectory
echo "put /local/path/guide.md /home/node/guides/guide.md" | fly sftp shell -a my-jarvis-dev
```

**If file already exists:** Delete first, then upload:
```bash
fly ssh console -a my-jarvis-dev -C "rm /home/node/CLAUDE.md"
echo "put /local/CLAUDE.md /home/node/CLAUDE.md" | fly sftp shell -a my-jarvis-dev
```

### 3. Machine Status - Start Before Operating

Fly.io machines auto-stop. Always check status first:

```bash
# Check status
fly status -a my-jarvis-dev

# Start a stopped machine (get machine ID from status)
fly machine start <machine-id> -a my-jarvis-dev

# Wait for startup
sleep 15
```

## Critical Rules

| DO | DON'T |
|----|-------|
| Use sftp for file uploads | Pipe files through ssh |
| Run single commands with `-C` | Chain commands with `&&` in ssh |
| Check machine status first | Assume machine is running |
| Fix ownership after uploads | Leave files owned by root |
| Delete before re-uploading | Expect sftp to overwrite |

## Common Issues

### "No started VMs" Error
```bash
fly machine start <machine-id> -a my-jarvis-dev && sleep 15
```

### File Exists Error on Upload
Delete first, then upload:
```bash
fly ssh console -a my-jarvis-dev -C "rm /home/node/file.md"
echo "put /local/file.md /home/node/file.md" | fly sftp shell -a my-jarvis-dev
```

### Wrong Ownership After Upload
Files uploaded via sftp are owned by root. Fix:
```bash
fly ssh console -a my-jarvis-dev -C "chown node:node /home/node/file.md"
```
