# Repository Management Protocol

## Critical Classification System

### ✅ SAFE TO GITIGNORE (Generated/Build Outputs)
- `dist/` - Electron build outputs
- `build/` - React/Vite build outputs
- `out/` - Next.js build outputs
- `lib/main/` - Compiled Electron main process
- `lib/preload/` - Compiled Electron preload scripts
- `lib/utils/` - Compiled utility modules

### ❌ NEVER GITIGNORE (Runtime Dependencies)
- `lib/claude-webui-server/` - Backend server code and dependencies
- `lib/conveyor/` - Core application modules
- Any directory containing source code needed at runtime
- Any directory with package.json that gets npm installed

### 🔍 Size Management Best Practices

#### Before Removing Large Files:
1. **Identify file type**: `file <filename>`
2. **Check if runtime dependency**: Does production need this to run?
3. **Verify it's truly generated**: Can it be recreated with `npm run build`?
4. **Test production build**: After gitignore changes, always test production

#### Safe Size Reduction Methods:
1. **Use Git LFS for large assets** (images, videos, binaries)
2. **npm prune --production** for unused dev dependencies
3. **Remove actual build outputs** only
4. **Use .gitkeep for empty dirs** instead of excluding entire dirs

#### Emergency Size Issues:
1. **Use git-filter-branch** to remove specific large files from history
2. **Never bulk-remove directories** without understanding their purpose
3. **Always backup before major gitignore changes**

## Production Verification Checklist

Before any gitignore changes:
- [ ] Test production build locally
- [ ] Verify backend starts in production mode
- [ ] Check all API endpoints respond
- [ ] Test complete user workflow

## Recovery Protocol

If production breaks after gitignore changes:
1. Identify exactly what was excluded
2. Restore files with `git add -f <path>`
3. Update gitignore to be more specific
4. Test production build again
5. Document what went wrong for future prevention