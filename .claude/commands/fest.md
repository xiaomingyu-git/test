---
description: Execute full test suite with automatic error fixing - ESLint, build, project startup, and MCP Playwright browser testing with self-healing capabilities
argument-hint: Specify what to test (e.g., "test user login flow", "test CRUD operations", "test form validation", "test navigation menu")
---

Run complete end-to-end testing workflow with automatic error recovery. Uses MCP Playwright browser tools for real browser testing with custom test scenarios. Each step will auto-fix errors before proceeding.

Test what you specified: $ARGUMENTS

## Auto-Repair Testing Workflow

### 1. ESLint and TypeScript Auto-Fix
**Auto-fix strategies:**
- Run `npm run lint -- --fix` to automatically fix linting errors
- If TypeScript errors found, analyze and fix them manually
- Re-run checks until all errors are resolved
- Maximum 3 repair attempts per step

### 2. Build Auto-Repair
**Auto-fix strategies:**
- Check for missing dependencies: `npm install`
- Fix version conflicts: update package.json
- Resolve import/export issues
- Fix circular dependencies
- Clear cache: `rm -rf node_modules/.cache` and retry
- Maximum 3 repair attempts

### 3. Development Server Auto-Start
**Auto-fix strategies:**
- Check port conflicts and kill conflicting processes
- Clear dev server cache
- Restart with different port if needed
- Fix environment variable issues
- Maximum 3 repair attempts

### 4. MCP Playwright Browser Testing
**Testing strategies using MCP browser tools:**
- Use `mcp__playwright__browser_navigate` to navigate to pages
- Use `mcp__playwright__browser_snapshot` for accessibility testing
- Use `mcp__playwright__browser_click` for interaction testing
- Use `mcp__playwright__browser_fill_form` for form testing
- Use `mcp__playwright__browser_evaluate` for JavaScript execution
- Use `mcp__playwright__browser_take_screenshot` for visual testing
- Maximum 3 testing attempts per test scenario

### 5. Smart Process Cleanup
Auto-detect and clean all related processes after completion.

## Detailed Instructions

### Phase 1: Code Quality Auto-Repair
1. **Initial ESLint Check**: Run linting with `--fix` flag
2. **Auto-Fix Application**: Apply automatic fixes
3. **Manual Fix Analysis**: For remaining errors, analyze root cause
4. **Targeted Fixes**: Apply specific fixes for each error type
5. **Re-verification**: Re-run until clean
6. **TypeScript Check**: Run `tsc --noEmit` and fix any type errors

### Phase 2: Build Auto-Repair
1. **Dependency Check**: Verify all dependencies installed
2. **Build Attempt**: Run `npm run build`
3. **Error Analysis**: Parse build errors and categorize them
4. **Auto-Resolution**: Apply fixes for common build issues
5. **Cache Clearing**: Clear build cache and retry
6. **Environment Setup**: Fix any environment configuration

### Phase 3: Development Server Auto-Start
1. **Port Availability**: Check if default port is available
2. **Process Cleanup**: Kill any existing dev server processes
3. **Server Launch**: Start dev server with proper configuration
4. **Health Check**: Verify server responds to requests
5. **Readiness Wait**: Allow full startup completion

### Phase 4: Custom MCP Browser Testing
**Parse user test requirements and create custom test scenarios:**

1. **Browser Launch**: Open browser with Playwright MCP tools
2. **Application Navigation**: Navigate to `http://localhost:5173`
3. **Requirement Analysis**: Parse user input to understand test scope
4. **Custom Test Generation**: Create test scenarios based on user requirements
5. **Targeted Testing**: Execute specific tests for user-specified features
6. **Visual Verification**: Take screenshots before and after actions
7. **Results Validation**: Verify expected outcomes
8. **Error Scenario Testing**: Test edge cases related to user requirements

**Common test patterns based on user input:**
- **Login/Auth**: Test login forms, registration, password reset
- **CRUD Operations**: Test create, read, update, delete workflows
- **Forms**: Test form validation, submission, error handling
- **Navigation**: Test menu navigation, routing, breadcrumbs
- **Search/Filter**: Test search functionality, filtering, sorting
- **File Upload**: Test file upload, preview, validation
- **Responsive**: Test mobile/tablet/desktop layouts
- **Performance**: Test load times, responsiveness

### Phase 5: Intelligent Cleanup
1. **Process Detection**: Find all related running processes
2. **Graceful Shutdown**: Attempt graceful termination
3. **Force Cleanup**: Force kill remaining processes
4. **Resource Cleanup**: Clean temporary files and caches

## Auto-Repair Strategies

### ESLint Errors
```bash
# Auto-fix formatting and simple issues
npm run lint -- --fix

# Fix import ordering
npm run lint -- --fix --rule 'import/order: error'

# Fix unused variables and imports
npm run lint -- --fix --rule 'no-unused-vars: error'
```

### Build Errors
```bash
# Install missing dependencies
npm install

# Clear cache
rm -rf node_modules/.cache
npm run build

# Fix peer dependency conflicts
npm install --force
```

### Development Server Issues
```bash
# Kill processes on port 5173
npx kill-port 5173

# Clear Vite cache
rm -rf node_modules/.vite

# Start with alternative port
npm run dev -- --port 5174
```

### Custom Test Scenarios and MCP Tools

**Example 1: User wants to test "login flow"**
```javascript
// Navigate to login page
await mcp__playwright__browser_navigate({ url: 'http://localhost:5173/login' })

// Take initial screenshot
await mcp__playwright__browser_take_screenshot({ filename: 'login-page-initial.png' })

// Test form structure
await mcp__playwright__browser_snapshot()

// Fill login form
await mcp__playwright__browser_fill_form({
  fields: [
    { name: 'username', type: 'textbox', value: 'testuser@example.com' },
    { name: 'password', type: 'textbox', value: 'password123' }
  ]
})

// Submit form
await mcp__playwright__browser_click({ element: 'button', ref: 'login-submit' })

// Verify successful login
await mcp__playwright__browser_take_screenshot({ filename: 'login-success.png' })
```

**Example 2: User wants to test "CRUD operations"**
```javascript
// Navigate to list page
await mcp__playwright__browser_navigate({ url: 'http://localhost:5173/users' })

// Test Create operation
await mcp__playwright__browser_click({ element: 'button', ref: 'add-user-btn' })
await mcp__playwright__browser_fill_form({
  fields: [
    { name: 'name', type: 'textbox', value: 'New User' },
    { name: 'email', type: 'textbox', value: 'newuser@test.com' }
  ]
})
await mcp__playwright__browser_click({ element: 'button', ref: 'save-btn' })

// Test Read operation
await mcp__playwright__browser_snapshot()
await mcp__playwright__browser_take_screenshot({ filename: 'user-created.png' })

// Test Update operation
await mcp__playwright__browser_click({ element: 'button', ref: 'edit-user-1' })
await mcp__playwright__browser_fill_form({
  fields: [{ name: 'name', type: 'textbox', value: 'Updated User' }]
})
await mcp__playwright__browser_click({ element: 'button', ref: 'update-btn' })

// Test Delete operation
await mcp__playwright__browser_click({ element: 'button', ref: 'delete-user-1' })
```

**Example 3: User wants to test "form validation"**
```javascript
// Navigate to form
await mcp__playwright__browser_navigate({ url: 'http://localhost:5173/contact' })

// Test empty form submission
await mcp__playwright__browser_click({ element: 'button', ref: 'submit-btn' })
await mcp__playwright__browser_take_screenshot({ filename: 'validation-errors.png' })

// Test invalid email format
await mcp__playwright__browser_fill_form({
  fields: [{ name: 'email', type: 'textbox', value: 'invalid-email' }]
})
await mcp__playwright__browser_click({ element: 'button', ref: 'submit-btn' })
await mcp__playwright__browser_snapshot()

// Test successful form submission
await mcp__playwright__browser_fill_form({
  fields: [
    { name: 'name', type: 'textbox', value: 'Valid Name' },
    { name: 'email', type: 'textbox', value: 'valid@email.com' },
    { name: 'message', type: 'textbox', value: 'Test message' }
  ]
})
await mcp__playwright__browser_click({ element: 'button', ref: 'submit-btn' })
await mcp__playwright__browser_take_screenshot({ filename: 'form-success.png' })
```

## Success Criteria

- ✅ **Auto-Repair Enabled**: All errors automatically fixed
- ✅ **Custom Test Input**: Accepts user-specified test requirements
- ✅ **MCP Browser Testing**: Uses Playwright MCP tools for real browser testing
- ✅ **Smart Test Generation**: Creates test scenarios based on user input
- ✅ **Persistent Retry**: Continue until success or max attempts
- ✅ **Visual Verification**: Screenshots before/after each test action
- ✅ **Targeted Testing**: Tests only what user specified
- ✅ **Comprehensive Coverage**: Covers CRUD, forms, navigation, validation, etc.

## Error Recovery Logic

```
FOR each phase:
  DO
    attempt = 1
    WHILE attempt <= maxAttempts AND NOT success:
      Execute step
      IF success:
        Log success and continue to next phase
      ELSE:
        Analyze error type
        Apply auto-fix strategy
        Increment attempt
        Wait 2 seconds between attempts
    END WHILE

    IF NOT success after maxAttempts:
      Log failure with detailed error report
      Provide manual intervention suggestions
      Skip subsequent dependent steps
  END
END FOR
```

## Output Format

```
🔄 AUTO-REPAIR TESTING WORKFLOW
===============================

Phase 1: ESLint & TypeScript
  Attempt 1: [FIXING] - Auto-fixing 23 linting errors
  Attempt 2: [FIXING] - Resolving 5 TypeScript errors
  Attempt 3: [SUCCESS] - All code quality checks passed

Phase 2: Build Process
  Attempt 1: [FIXING] - Installing missing dependencies
  Attempt 2: [SUCCESS] - Build completed successfully

Phase 3: Development Server
  Attempt 1: [FIXING] - Clearing port conflicts
  Attempt 2: [SUCCESS] - Server started on http://localhost:5173

Phase 4: Custom MCP Browser Testing ($ARGUMENTS)
  Test Analysis: [SUCCESS] - Parsed requirement: "$ARGUMENTS"
  Test Generation: [SUCCESS] - Created custom test scenarios
  Browser Launch: [SUCCESS] - Browser opened via MCP
  Navigation: [SUCCESS] - Loaded http://localhost:5173
  Custom Tests: [RUNNING]
    Scenario 1: [SUCCESS] - Tested user-specified feature
    Scenario 2: [SUCCESS] - Validated expected outcomes
    Screenshots: [CAPTURED] - Before/after test evidence
  Result: [SUCCESS] - Custom tests passed for "$ARGUMENTS"

Phase 5: Cleanup
  Processes: [CLEANING] - Terminated 3 processes
  Resources: [CLEANING] - Cleared temporary files
  Result: [SUCCESS]

🎉 WORKFLOW COMPLETED SUCCESSFULLY
```

This command ensures complete project validation with intelligent error recovery, fixing issues automatically until the entire workflow succeeds.