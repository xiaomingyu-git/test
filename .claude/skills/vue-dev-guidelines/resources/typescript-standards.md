# TypeScript Standards

TypeScript best practices for type safety and maintainability in Vue.js applications.

## 🔧 Automatic Error Resolution

### Overview

This project includes an intelligent TypeScript error auto-resolution system that automatically detects and fixes common TypeScript errors during development. This system works alongside the manual standards described below.

### Auto-Fix Capabilities

The system can automatically resolve:

- **Unused Variables (TS6133)**: Prefix unused parameters, remove unused imports
- **Implicit Any Types (TS7005)**: Add type annotations, infer common types
- **Duplicate Declarations (TS2580)**: Auto-rename conflicting variables
- **Import Issues**: Clean up unused imports while preserving functionality

### Integration with Development

The auto-fix system integrates seamlessly with your workflow:

```typescript
// Before (auto-detected error)
function handleUser(user: any, data: any) {
  const unused = "this will be flagged";
  return user.name;
}

// After auto-fix
function handleUser(_user: { name: string }, data: unknown) {
  // const unused = "this will be commented out";
  return _user.name;
}
```

### Configuration

Control auto-fix behavior via `.claude/auto-fix-config.json`:

```json
{
  "autoFixEnabled": true,
  "runOnStop": true,
  "fixStrategies": {
    "unusedVariables": { "enabled": true },
    "implicitAny": { "enabled": true },
    "duplicateDeclarations": { "enabled": true }
  }
}
```

### Best Practices with Auto-Fix

1. **Review Changes**: Always review auto-applied fixes before committing
2. **Test Functionality**: Ensure auto-fixes don't break functionality
3. **Customize Rules**: Adjust configuration based on project needs
4. **Manual Override**: Manually fix complex type issues

**Note**: The auto-fix system handles common patterns but doesn't replace understanding TypeScript fundamentals. Use it as a productivity tool, not a crutch.

---

## Strict Mode

### Configuration

TypeScript strict mode is **enabled** in the project:

```json
// tsconfig.json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true
    }
}
```

**This means:**
- No implicit `any` types
- Null/undefined must be handled explicitly
- Type safety enforced

---

## No `any` Type

### The Rule

```typescript
// ❌ NEVER use any
function handleData(data: any) {
    return data.something;
}

// ✅ Use specific types
interface MyData {
    something: string;
}

function handleData(data: MyData) {
    return data.something;
}

// ✅ Or use unknown for truly unknown data
function handleUnknown(data: unknown) {
    if (typeof data === 'object' && data !== null && 'something' in data) {
        return (data as MyData).something;
    }
}
```

**If you truly don't know the type:**
- Use `unknown` (forces type checking)
- Use type guards to narrow
- Document why type is unknown

---

## Explicit Return Types

### Function Return Types

```typescript
// ✅ CORRECT - Explicit return type
function getUser(id: number): Promise<User> {
    return apiClient.get(`/users/${id}`);
}

function calculateTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ AVOID - Implicit return type (less clear)
function getUser(id: number) {
    return apiClient.get(`/users/${id}`);
}
```

### Component Return Types

```typescript
// Vue 3 components with script setup don't need explicit return types
// But composables should have explicit types
function useUser(id: number) {
    const user = ref<User | null>(null);
    const isLoading = ref(true);

    const fetchUser = async () => {
        isLoading.value = true;
        try {
            user.value = await apiClient.getUser(id);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        user: readonly(user),
        isLoading: readonly(isLoading),
        fetchUser
    };
}
```

### Composable Return Types

```typescript
// ✅ Define explicit return type interfaces
interface UseUserReturn {
    user: Readonly<Ref<User | null>>;
    isLoading: Readonly<Ref<boolean>>;
    error: Ref<Error | null>;
    fetchUser: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

export function useUser(id: number): UseUserReturn {
    // Implementation
}
```

---

## Type Imports

### Use 'type' Keyword

```typescript
// ✅ CORRECT - Explicitly mark as type import
import type { User } from '@/types/user';
import type { Product } from '@/types/product';
import type { Component } from 'vue';

// ❌ AVOID - Mixed value and type imports
import { User } from '@/types/user';  // Unclear if type or value
```

**Benefits:**
- Clearly separates types from values
- Better tree-shaking
- Prevents circular dependencies
- TypeScript compiler optimization

---

## Component Type Definitions

### defineProps with TypeScript

```typescript
/**
 * Props for UserCard component
 */
interface UserCardProps {
    /** The user to display */
    user: User;

    /** Optional callback when action completes */
    onAction?: (user: User) => void;

    /** Display mode for the component */
    mode?: 'view' | 'edit';

    /** Additional CSS classes */
    class?: string;
}

const props = withDefaults(defineProps<UserCardProps>(), {
    mode: 'view',
    onAction: undefined,
    class: '',
});
```

### defineEmits with TypeScript

```typescript
interface UserCardEmits {
    /** Emitted when user profile is edited */
    edit: [user: User];

    /** Emitted when user is deleted */
    delete: [userId: number];

    /** Emitted when an action occurs */
    action: [action: string, user: User];
}

const emit = defineEmits<UserCardEmits>();

// Usage
const handleEdit = (user: User) => {
    emit('edit', user);
};

const handleDelete = (userId: number) => {
    emit('delete', userId);
};
```

### Generic Components

```typescript
interface ListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => VNode;
    keyExtractor: (item: T) => string | number;
}

export default defineComponent({
    props: {
        items: Array as PropType<any[]>,
        renderItem: Function as PropType<(item: any, index: number) => VNode>,
        keyExtractor: Function as PropType<(item: any) => string | number>,
    },
    setup<T>(props: ListProps<T>) {
        // Component logic
    }
});
```

---

## Composable Typing

### Input/Output Types

```typescript
export interface UseFetchOptions<T> {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

export interface UseFetchReturn<T> {
    data: Ref<T | null>;
    loading: Readonly<Ref<boolean>>;
    error: Ref<Error | null>;
    execute: () => Promise<void>;
    refresh: () => Promise<void>;
}

export function useFetch<T>(
    url: string | Ref<string>,
    options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
    // Implementation
}
```

### Generic Composables

```typescript
function usePagination<T>(items: Ref<T[]>, itemsPerPage = 10) {
    const currentPage = ref(1);

    const paginatedItems = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.value.slice(start, end);
    });

    const totalPages = computed(() =>
        Math.ceil(items.value.length / itemsPerPage)
    );

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    return {
        currentPage,
        totalPages,
        paginatedItems,
        nextPage,
        prevPage,
    };
}
```

---

## Pinia Store Typing

### Store Type Definition

```typescript
// @stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/user';

export const useUserStore = defineStore('user', () => {
    // State
    const user = ref<User | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const isAuthenticated = computed(() => !!user.value);
    const userName = computed(() => user.value?.name || 'Guest');

    // Actions
    const setUser = (userData: User): void => {
        user.value = userData;
    };

    const clearUser = (): void => {
        user.value = null;
    };

    const login = async (credentials: LoginCredentials): Promise<void> => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await authApi.login(credentials);
            setUser(response.user);
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Login failed';
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        // State (readonly for external access)
        user: readonly(user),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Getters
        isAuthenticated,
        userName,

        // Actions
        setUser,
        clearUser,
        login,
    };
});
```

### Store Augmentation

```typescript
// @stores/index.ts - Global store types
import type { useUserStore } from './user';

declare module 'pinia' {
    export interface PiniaCustomStateProperties {
        userStore: ReturnType<typeof useUserStore>;
    }
}
```

---

## Utility Types

### Partial<T>

```typescript
// Make all properties optional
type UserUpdate = Partial<User>;

function updateUser(id: number, updates: Partial<User>) {
    // updates can have any subset of User properties
}
```

### Pick<T, K>

```typescript
// Select specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;

const preview: UserPreview = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    // Other User properties not allowed
};
```

### Omit<T, K>

```typescript
// Exclude specific properties
type UserWithoutPassword = Omit<User, 'password' | 'passwordHash'>;

const publicUser: UserWithoutPassword = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    // password and passwordHash not allowed
};
```

### Required<T>

```typescript
// Make all properties required
type RequiredConfig = Required<Config>;  // All optional props become required
```

### Record<K, V>

```typescript
// Type-safe object/map
const userMap: Record<string, User> = {
    'user1': { id: 1, name: 'John' },
    'user2': { id: 2, name: 'Jane' },
};
```

---

## Type Guards

### Basic Type Guards

```typescript
function isUser(data: unknown): data is User {
    return (
        typeof data === 'object' &&
        data !== null &&
        'id' in data &&
        'name' in data
    );
}

// Usage
if (isUser(response)) {
    console.log(response.name);  // TypeScript knows it's User
}
```

### Vue-Specific Type Guards

```typescript
function isVueComponent(component: unknown): component is Component {
    return (
        typeof component === 'object' &&
        component !== null &&
        'setup' in component &&
        typeof component.setup === 'function'
    );
}
```

### Discriminated Unions

```typescript
type LoadingState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: Data }
    | { status: 'error'; error: Error };

function Component() {
    const state = ref<LoadingState>({ status: 'idle' });

    // TypeScript narrows type based on status
    if (state.value.status === 'success') {
        console.log(state.value.data);  // data available here
    }

    if (state.value.status === 'error') {
        console.error(state.value.error);  // error available here
    }
}
```

---

## Vue Router Typing

### Route Types

```typescript
import type { RouteLocationNormalizedLoaded } from 'vue-router';

interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    adminOnly?: boolean;
}

// Augment vue-router types
declare module 'vue-router' {
    interface RouteMeta extends RouteMeta {}
}
```

### Router Usage

```typescript
import { useRouter, useRoute } from 'vue-router';

export function useNavigation() {
    const router = useRouter();
    const route = useRoute();

    const navigateToUser = (userId: number) => {
        router.push({
            name: 'UserDetail',
            params: { id: userId.toString() }
        });
    };

    const currentUserId = computed(() =>
        Number(route.params.id)
    );

    return {
        router,
        route,
        navigateToUser,
        currentUserId
    };
}
```

---

## Event Handling Typing

### DOM Event Types

```typescript
const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
};

const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    // Form submission logic
};

const handleClick = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    console.log('Button clicked:', button.textContent);
};
```

### Custom Event Types

```typescript
interface CustomEventPayload {
    type: string;
    data: any;
}

const handleCustomEvent = (payload: CustomEventPayload) => {
    console.log(`Custom event: ${payload.type}`, payload.data);
};
```

---

## Type Assertions (Use Sparingly)

### When to Use

```typescript
// ✅ OK - When you know more than TypeScript
const element = document.getElementById('my-element') as HTMLInputElement;
const value = element.value;

// ✅ OK - API response that you've validated
const response = await api.getData();
const user = response.data as User;  // You know the shape

// ✅ OK - Vue template refs
const inputRef = ref<HTMLInputElement | null>(null);

// ✅ OK - Route parameters
const userId = Number(route.params.id as string);
```

### When NOT to Use

```typescript
// ❌ AVOID - Circumventing type safety
const data = getData() as any;  // WRONG - defeats TypeScript

// ❌ AVOID - Unsafe assertion
const value = unknownValue as string;  // Might not actually be string
```

---

## Null/Undefined Handling

### Optional Chaining

```typescript
// ✅ CORRECT
const name = user?.profile?.name;

// Equivalent to:
const name = user && user.profile && user.profile.name;
```

### Nullish Coalescing

```typescript
// ✅ CORRECT
const displayName = user?.name ?? 'Anonymous';

// Only uses default if null or undefined
// (Different from || which triggers on '', 0, false)
```

### Non-Null Assertion (Use Carefully)

```typescript
// ✅ OK - When you're certain value exists
const element = templateRef.value!;

// ⚠️ CAREFUL - Only use when you KNOW it's not null
// Better to check explicitly:
if (templateRef.value) {
    // Use element
}
```

---

## Vue-Specific Type Patterns

### Template Refs

```typescript
// Single element
const inputRef = ref<HTMLInputElement | null>(null);

// Multiple elements
const itemRefs = ref<HTMLElement[]>([]);

// Component refs
const childComponentRef = ref<InstanceType<typeof ChildComponent> | null>(null);

// Usage in template
// <input ref="inputRef" />
// <ChildComponent ref="childComponentRef" />
```

### Provide/Inject Typing

```typescript
// Provider
const theme = ref<'light' | 'dark'>('light');

provide('theme', readonly(theme));

// Injector
const theme = inject<Ref<'light' | 'dark'>>('theme');

// With default value
const theme = inject<Ref<'light' | 'dark'>>('theme', ref('light'));
```

### Directive Typing

```typescript
import type { Directive } from 'vue';

const vFocus: Directive<HTMLInputElement> = {
    mounted(el) {
        el.focus();
    }
};

// Generic directive
const vLazyLoad: Directive<HTMLElement, string> = {
    mounted(el, binding) {
        // binding.value is typed as string
    }
};
```

---

## Summary

**TypeScript Checklist:**
- ✅ Strict mode enabled
- ✅ No `any` type (use `unknown` if needed)
- ✅ Explicit return types on functions
- ✅ Use `import type` for type imports
- ✅ JSDoc comments on prop interfaces
- ✅ Utility types (Partial, Pick, Omit, Required, Record)
- ✅ Type guards for narrowing
- ✅ Optional chaining and nullish coalescing
- ✅ Vue-specific typing patterns
- ❌ Avoid type assertions unless necessary

**See Also:**
- [component-patterns.md](component-patterns.md) - Component typing
- [composables-guide.md](composables-guide.md) - Composable typing
- [state-management.md](state-management.md) - Store typing