# Vue Single Instance Application Skills

Production-tested skills for Claude Code that auto-activate based on Vue 3 frontend context.

---

## What Are Skills?

Skills are modular knowledge bases that Claude loads when needed. They provide:
- Domain-specific guidelines
- Best practices
- Code examples
- Anti-patterns to avoid

**Problem:** Skills don't activate automatically by default.

**Solution:** This configuration includes the hooks + rules to make them activate for Vue projects.

---

## Available Skills for Vue Projects

### skill-developer (Meta-Skill)
**Purpose:** Creating and managing Claude Code skills

**Files:** 7 resource files (426 lines total)

**Use when:**
- Creating new skills
- Understanding skill structure
- Working with skill-rules.json
- Debugging skill activation

**Customization:** ✅ None - copy as-is

**[View Skill →](skill-developer/)**

---

### vue-dev-guidelines (Guardrail)
**Purpose:** Vue 3 + Vite + Element Plus + Composition API + TypeScript best practices

**Files:** Complete Vue development guidelines

**Covers:**
- Vue 3 Composition API patterns
- Element Plus component usage
- Vite build configuration
- TypeScript best practices for Vue
- Modern Vue patterns (script setup, composables)
- Vue Router integration
- Pinia state management

**Use when:**
- Creating Vue components
- Setting up composables
- Styling with Element Plus
- Vue project structure
- Component lifecycle management

**Customization:** ⚠️ Update `pathPatterns` in skill-rules.json to match your Vue directories

**Example pathPatterns:**
```json
{
  "pathPatterns": [
    "src/**/*.vue",         // Vue components
    "src/**/*.ts",          // TypeScript files
    "components/**/*.vue",  // Component directory
    "composables/**/*.ts",  // Composables
    "router/**/*.ts"        // Vue Router files
  ]
}
```

**Note:** This skill is configured as a **guardrail** (enforcement: "block") to enforce Vue best practices.

**[View Skill →](vue-dev-guidelines/)**

---

### error-tracking
**Purpose:** Vue frontend error tracking and performance monitoring using Sentry

**Files:** 1 main file (~585 lines)

**Covers:**
- Vue 3 + Sentry integration
- Component error handling (onErrorCaptured)
- Global error handlers
- Error boundaries
- API error tracking
- Performance monitoring
- User context management
- Frontend-specific error patterns

**Use when:**
- Setting up Sentry for Vue apps
- Adding error handling to components
- Implementing error boundaries
- Tracking API errors
- Performance monitoring
- User interaction errors

**Customization:** ⚠️ Update environment variables and Sentry DSN

**Key Integration Points:**
- `src/main.ts` - Sentry initialization
- `src/components/ErrorBoundary.vue` - Error boundary component
- `src/composables/useErrorHandling.ts` - Reusable error handling
- `src/services/api.ts` - API error tracking

**[View Skill →](error-tracking/)**

---

## How to Use These Skills in Your Vue Project

### Current Configuration

This project is already configured with 3 Vue-specific skills:

1. **skill-developer** - For creating custom skills
2. **vue-dev-guidelines** - Vue development best practices (guardrail)
3. **error-tracking** - Sentry error tracking for Vue

### Skill Activation

Skills activate automatically based on:
- **Keywords** in user prompts ("vue component", "composable", "error handling")
- **File patterns** (editing `.vue` or `.ts` files)
- **Content patterns** (code contains Vue-specific syntax)

**Example:**
```
User: "Create a new Vue component with Element Plus"

→ vue-dev-guidelines skill activates automatically
```

### Adding Custom Skills

To add a custom skill for Vue:

**Step 1: Create skill directory**
```bash
mkdir -p .claude/skills/my-vue-skill
```

**Step 2: Create SKILL.md**
```markdown
---
name: my-vue-skill
description: Custom Vue functionality
---

# My Vue Skill

## Purpose
[Description]

## Usage
[Patterns and examples]
```

**Step 3: Update skill-rules.json**
```json
{
  "my-vue-skill": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "high",
    "promptTriggers": {
      "keywords": ["my vue feature", "custom vue pattern"],
      "intentPatterns": ["(create|add).*my vue feature"]
    },
    "fileTriggers": {
      "pathPatterns": ["src/**/*.vue", "src/**/*.ts"]
    }
  }
}
```

**Step 4: Test**
- Edit a Vue file
- Your skill should appear in suggestions

---

## skill-rules.json Configuration for Vue

### What It Does

Defines when skills should activate based on:
- **Keywords** in user prompts ("vue component", "composable", "element plus")
- **Intent patterns** (regex matching user intent)
- **File path patterns** (editing Vue files)
- **Content patterns** (code contains Vue syntax)

### Current Vue Configuration

```json
{
  "skills": {
    "skill-developer": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high"
    },
    "vue-dev-guidelines": {
      "type": "guardrail",
      "enforcement": "block",
      "priority": "high"
    },
    "error-tracking": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high"
    }
  }
}
```

### Vue-Specific Triggers

**Vue file patterns:**
- `src/**/*.vue` - Vue components
- `src/**/*.ts` - TypeScript files
- `components/**/*.vue` - Component directory
- `composables/**/*.ts` - Vue composables

**Vue content patterns:**
- `<script setup` - Vue 3 composition API
- `defineProps`/`defineEmits` - Component props/events
- `ElButton`, `ElForm` - Element Plus components
- `onErrorCaptured` - Vue error handling

### Enforcement Levels

- **suggest**: Skill appears as suggestion, doesn't block
- **block**: Must use skill before proceeding (guardrail)

**Current "block" usage:**
- `vue-dev-guidelines` - Enforces Vue best practices

**Current "suggest" usage:**
- `skill-developer` - Skill creation guidance
- `error-tracking` - Error handling patterns

---

## Creating Your Own Vue Skills

See the **skill-developer** skill for complete guide on:
- Skill YAML frontmatter structure
- Resource file organization
- Trigger pattern design
- Testing skill activation

**Vue Skill Template:**
```markdown
---
name: my-vue-skill
description: Vue-specific functionality or pattern
---

# My Vue Skill

## Purpose
[Why this Vue skill exists]

## When to Use This Skill
[Vue-specific activation scenarios]

## Vue Patterns
[Vue 3 + Composition API patterns]

## Resource Files
- [vue-patterns.md](resources/vue-patterns.md)
- [examples.md](resources/examples.md)
```

---

## Troubleshooting Vue Skills

### Skill isn't activating

**Check:**
1. Is skill directory in `.claude/skills/`?
2. Is skill listed in `skill-rules.json`?
3. Do `pathPatterns` match your Vue files?
4. Are hooks installed and working?

**Debug for Vue:**
```bash
# Check skill exists
ls -la .claude/skills/

# Validate skill-rules.json
cat .claude/skills/skill-rules.json | jq .

# Check Vue files match patterns
find src -name "*.vue" -o -name "*.ts"
```

### Vue-specific Issues

**vue-dev-guidelines activates too often:**
- Add `// @skip-vue-validation` comment to skip checks
- Check if patterns are too broad in skill-rules.json

**error-tracking not activating:**
- Ensure Vue error handling patterns exist in code
- Check for `onErrorCaptured`, `app.config.errorHandler` usage

### Skill never activates

Update skill-rules.json:
- Add Vue-specific keywords ("component", "composable", "Element Plus")
- Broaden `pathPatterns` to include Vue directories
- Add Vue-specific `contentPatterns`

---

## Best Practices for Vue Projects

### Skill Customization

**For Vue Single Instance Projects:**
- Focus on `src/` directory structure
- Include Vue-specific file extensions (`.vue`, `.ts`)
- Add Element Plus component patterns
- Include Vue Router and Pinia patterns

**Common Vue pathPatterns:**
```json
{
  "pathPatterns": [
    "src/**/*.vue",
    "src/**/*.ts",
    "components/**/*.vue",
    "composables/**/*.ts",
    "views/**/*.vue"
  ]
}
```

**Common Vue contentPatterns:**
```json
{
  "contentPatterns": [
    "<script setup",
    "defineProps",
    "import.*from.*vue",
    "El[A-Z].*from.*element-plus"
  ]
}
```

---

## Current Project Status

This Vue project is fully configured with:
- ✅ **3 active skills** tailored for Vue development
- ✅ **Hooks system** for automatic skill activation
- ✅ **Guardrails** to enforce Vue best practices
- ✅ **Error tracking** ready for Sentry integration

**Ready to use:**
1. Start creating Vue components - `vue-dev-guidelines` will activate
2. Add error handling - `error-tracking` will provide patterns
3. Need custom skills - `skill-developer` guides creation

**Next steps:**
1. Test skill activation by editing a Vue file
2. Add custom skills for project-specific patterns
3. Customize triggers based on your Vue workflow
