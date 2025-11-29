---
name: error-tracking
description: Add comprehensive error handling and monitoring to Vue frontend applications. Use this skill when adding error handling, creating Vue components, managing API calls, or tracking user interactions. ALL ERRORS MUST BE PROPERLY HANDLED - no exceptions.
---

# Vue Frontend Error Handling Skill

## Purpose
This skill provides comprehensive error handling patterns and monitoring strategies for Vue frontend applications following Vue 3 + TypeScript patterns.

## When to Use This Skill
- Adding error handling to Vue components
- Creating composables or utilities
- Managing API calls and HTTP requests
- Handling user interactions
- Implementing error boundaries
- Adding logging and monitoring

## 🚨 CRITICAL RULE

**ALL ERRORS MUST BE PROPERLY HANDLED** - No exceptions. Never use console.error alone without proper error handling.

## Current Status

### Vue Frontend ✅ Ready for Implementation
- Error handling patterns available
- Error boundaries can be implemented
- Component lifecycle error handling available
- Logging and monitoring strategies established

## Error Handling Patterns for Vue

### 1. Vue App Initialization with Error Handling

**Location**: `src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// ✅ CORRECT - Configure global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, {
    component: instance?.$options.name || 'Unknown',
    errorInfo: info,
    timestamp: new Date().toISOString()
  })

  // Log to external service if needed
  logErrorToService(err, {
    component: instance?.$options.name,
    errorInfo: info,
    userAgent: navigator.userAgent,
    url: window.location.href
  })
}

// ✅ CORRECT - Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason, {
    timestamp: new Date().toISOString(),
    promise: event.promise
  })

  logErrorToService(event.reason, {
    type: 'unhandledrejection',
    timestamp: new Date().toISOString()
  })
})

// ✅ CORRECT - Handle global errors
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', message, {
    source,
    lineno,
    colno,
    timestamp: new Date().toISOString()
  })

  logErrorToService(error || new Error(message?.toString() || 'Unknown error'), {
    type: 'window.onerror',
    source,
    lineno,
    colno
  })
}

app.mount('#app')

// Optional: External logging service integration
function logErrorToService(error: Error, context: any) {
  // Implement your own logging service
  // Examples: send to your backend, log to console in dev, etc.
  if (import.meta.env.DEV) {
    console.warn('Would log to service:', { error, context })
  }
}
```

### 2. Vue Component Error Handling

```vue
<script setup lang="ts">
import { ref } from 'vue'

// ✅ CORRECT - Handle errors with context
const data = ref(null)
const error = ref(null)
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('/api/data')

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    data.value = await response.json()
  } catch (err) {
    error.value = err

    // Log error with context
    logComponentError(err, 'MyComponent', 'fetchData', {
      url: '/api/data',
      timestamp: new Date().toISOString()
    })
  } finally {
    loading.value = false
  }
}

// ✅ CORRECT - Use onErrorCaptured lifecycle hook
import { onErrorCaptured } from 'vue'

onErrorCaptured((err, component, info) => {
  logComponentError(err, component?.$options.name || 'Unknown', 'onErrorCaptured', {
    errorInfo: info,
    componentName: component?.$options.name
  })

  // Return false to prevent the error from propagating
  return false
})

// Component error logging utility
function logComponentError(err: Error, componentName: string, action: string, context: any) {
  console.error('Component error:', err, {
    component: componentName,
    action,
    context,
    timestamp: new Date().toISOString()
  })

  // Optional: Send to external logging service
  logErrorToService(err, {
    component: componentName,
    action,
    ...context
  })
}
</script>

<template>
  <div>
    <div v-if="error" class="error">
      <h3>Error occurred</h3>
      <p>{{ error.message }}</p>
      <button @click="fetchData">Retry</button>
    </div>
    <div v-else-if="loading">
      Loading...
    </div>
    <div v-else-if="data">
      {{ data }}
    </div>
  </div>
</template>

<style scoped>
.error {
  padding: 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  margin: 1rem 0;
}

.error button {
  background: #c00;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### 3. API Service Error Handling

**Location**: `src/services/api.ts`

```typescript
export class ApiService {
  private baseURL = '/api'

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const startTime = Date.now()
    const url = `${this.baseURL}${endpoint}`

    try {
      console.info(`API Request: ${options?.method || 'GET'} ${url}`)

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`)

        // Log API error with context
        logApiError(error, endpoint, options?.method || 'GET', {
          url,
          status: response.status,
          statusText: response.statusText,
          duration: Date.now() - startTime
        })

        throw error
      }

      const data = await response.json()

      // Log successful request (in development)
      if (import.meta.env.DEV) {
        console.info(`API Success: ${options?.method || 'GET'} ${url} (${Date.now() - startTime}ms)`)
      }

      return data
    } catch (error) {
      // Log API errors with detailed context
      logApiError(error as Error, endpoint, options?.method || 'GET', {
        url,
        duration: Date.now() - startTime,
        options,
        timestamp: new Date().toISOString()
      })

      throw error // Re-throw to let caller handle
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// API error logging utility
function logApiError(error: Error, endpoint: string, method: string, context: any) {
  console.error('API Error:', error.message, {
    endpoint,
    method,
    ...context
  })

  // Optional: Send to external logging service
  logErrorToService(error, {
    type: 'api-error',
    endpoint,
    method,
    ...context
  })
}
```

### 4. Composable Error Handling

**Location**: `src/composables/useErrorHandling.ts`

```typescript
import { ref } from 'vue'

export function useErrorHandling() {
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const execute = async <T>(
    operation: () => Promise<T>,
    context?: {
      operation?: string
      component?: string
      additionalInfo?: Record<string, any>
    }
  ): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await operation()
      return result
    } catch (err) {
      error.value = err as Error

      // Log error with provided context
      logComposableError(err as Error, {
        operation: context?.operation || 'unknown',
        component: context?.component || 'unknown',
        ...context?.additionalInfo
      })

      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    error,
    loading,
    execute,
    clearError
  }
}

// Composable error logging utility
function logComposableError(error: Error, context: any) {
  console.error('Composable error:', error, {
    context,
    timestamp: new Date().toISOString()
  })

  // Optional: Send to external logging service
  logErrorToService(error, {
    type: 'composable-error',
    context
  })
}
```

### 5. Performance Monitoring

```typescript
// ✅ CORRECT - Track component performance
const measureComponentPerformance = <T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now()

  return operation().finally(() => {
    const duration = Date.now() - startTime
    console.info(`Component operation ${operationName} completed in ${duration}ms`)

    if (duration > 1000) { // Warn for slow operations
      console.warn(`Slow component operation detected: ${operationName} (${duration}ms)`)
    }
  })
}

// ✅ CORRECT - Track API performance
const measureApiPerformance = async <T>(
  endpoint: string,
  operation: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now()

  try {
    return await operation()
  } finally {
    const duration = Date.now() - startTime
    console.info(`API call ${endpoint} completed in ${duration}ms`)

    if (duration > 2000) { // Warn for slow API calls
      console.warn(`Slow API call detected: ${endpoint} (${duration}ms)`)
    }
  }
}
```

### 6. Error Boundary Component

**Location**: `src/components/ErrorBoundary.vue`

```vue
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref<Error | null>(null)

onErrorCaptured((err, component, info) => {
  hasError.value = true
  error.value = err

  // Log error boundary errors
  console.error('ErrorBoundary caught error:', err, {
    component: component?.$options.name || 'Unknown',
    errorInfo: info
  })

  // Log to external service
  logErrorToService(err, {
    type: 'error-boundary',
    component: component?.$options.name,
    errorInfo: info,
    timestamp: new Date().toISOString()
  })

  return false
})

const retry = () => {
  hasError.value = false
  error.value = null
}
</script>

<template>
  <slot v-if="!hasError" />
  <div v-else class="error-boundary">
    <h2>Something went wrong</h2>
    <p>We apologize for the inconvenience. The error has been reported to our team.</p>
    <button @click="retry">Try Again</button>
  </div>
</template>

<style scoped>
.error-boundary {
  padding: 2rem;
  text-align: center;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  margin: 1rem 0;
}

.error-boundary button {
  background: #c00;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.error-boundary button:hover {
  background: #900;
}
</style>
```

## Error Levels

Use appropriate severity levels:

- **fatal**: Application is unusable (critical Vue app failures)
- **error**: Operation failed, needs immediate attention (API failures, component crashes)
- **warning**: Recoverable issues, degraded performance (slow API calls, non-critical errors)
- **info**: Informational messages, successful operations
- **debug**: Detailed debugging information (dev only)

## Required Context

```typescript
function logErrorWithContext(error: Error, context: any) {
  console.error('Application error:', error, {
    context,
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    userAgent: navigator.userAgent,
    url: window.location.href
  })

  // Add component-specific context
  const enhancedContext = {
    ...context,
    route: window.location.pathname,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    onlineStatus: navigator.onLine
  }

  // Optional: Send to external logging service
  logErrorToService(error, enhancedContext)
}
```

## Environment Configuration

### Environment Variables

```bash
# .env.development
VITE_LOG_LEVEL=debug
VITE_API_TIMEOUT=10000

# .env.production
VITE_LOG_LEVEL=error
VITE_API_TIMEOUT=5000

# .env.staging
VITE_LOG_LEVEL=warning
VITE_API_TIMEOUT=7500
```

### Vite Configuration

**Location**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  build: {
    sourcemap: true // Enable source maps for better error tracking
  }
})
```

## Common Mistakes to Avoid

❌ **NEVER** use console.error without proper context
❌ **NEVER** swallow errors silently in Vue components
❌ **NEVER** expose sensitive data in error context (passwords, tokens)
❌ **NEVER** forget to handle async operation errors in composables
❌ **NEVER** skip error boundary implementation for critical components
❌ **NEVER** forget to remove sensitive information from user data sent to external services

## Implementation Checklist

When adding error handling to Vue components:

- [ ] Added proper try/catch blocks with logging
- [ ] All errors include meaningful context (component name, action, etc.)
- [ ] Used appropriate error level
- [ ] No sensitive data in error messages
- [ ] Added performance tracking for slow operations
- [ ] Implemented error boundaries where appropriate
- [ ] Added global error handler in main.ts
- [ ] Tested error handling paths in components
- [ ] Configured user context for better error tracking

## Key Files for Vue Project

### Core Integration
- `src/main.ts` - Global error handlers and app initialization
- `src/services/api.ts` - API error handling and logging
- `src/composables/useErrorHandling.ts` - Reusable error handling composable
- `src/components/ErrorBoundary.vue` - Error boundary component

### Configuration
- `.env.development` - Development logging configuration
- `.env.production` - Production logging configuration
- `vite.config.ts` - Build configuration with source maps

## Testing Error Handling

### Manual Testing

```typescript
// Add to any component for testing
const testErrorHandling = () => {
  try {
    throw new Error('Test error from Vue component')
  } catch (err) {
    logComponentError(err as Error, 'TestComponent', 'testErrorHandling', {
      timestamp: new Date().toISOString()
    })
  }
}
```

### Error Boundary Testing

```vue
<!-- Add this to test error boundary -->
<template>
  <ErrorBoundary>
    <div>
      <button @click="triggerError">Trigger Error</button>
    </div>
  </ErrorBoundary>
</template>

<script setup>
const triggerError = () => {
  throw new Error('Test error for boundary')
}
</script>
```

## Related Skills

- Use **vue-dev-guidelines** for Vue component best practices
- Use **skill-developer** for creating custom error handling utilities

## Vue-Specific Considerations

1. **Component Lifecycle**: Handle errors in created, mounted, and other lifecycle hooks
2. **Reactive Data**: Include reactive state in error context for debugging
3. **Router Navigation**: Track routing errors and navigation failures
4. **State Management**: Include Pinia store state in error context when relevant
5. **User Interactions**: Track errors that occur during user interactions (clicks, form submissions)
6. **External Services**: Consider your own logging service or third-party alternatives