# Vue Composables Guide

## What are Composables?

Composables are functions that leverage Vue's Composition API to encapsulate and reuse stateful logic. They are the Vue 3 equivalent of React's custom hooks.

## Standard Pattern

### Naming Convention
- Use `use` prefix
- Be descriptive: `useUserData`, `useFetchData`, `useModal`

### Structure Template

```typescript
// @composables/useCounter.ts
import { ref, computed, watch, type Ref } from 'vue';

export interface UseCounterOptions {
  initial?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface UseCounterReturn {
  count: Readonly<Ref<number>>;
  increment: () => void;
  decrement: () => void;
  reset: (value?: number) => void;
  canIncrement: Readonly<Ref<boolean>>;
  canDecrement: Readonly<Ref<boolean>>;
  doubled: Readonly<Ref<number>>;
}

export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const {
    initial = 0,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
  } = options;

  // State
  const count = ref(initial);

  // Computed
  const canIncrement = computed(() => count.value + step <= max);
  const canDecrement = computed(() => count.value - step >= min);
  const doubled = computed(() => count.value * 2);

  // Methods
  const increment = () => {
    if (canIncrement.value) {
      count.value += step;
    }
  };

  const decrement = () => {
    if (canDecrement.value) {
      count.value -= step;
    }
  };

  const reset = (value = initial) => {
    if (value >= min && value <= max) {
      count.value = value;
    }
  };

  // Watch for changes
  watch(count, (newValue) => {
    console.log(`Count changed to: ${newValue}`);
  });

  return {
    count: readonly(count),
    increment,
    decrement,
    reset,
    canIncrement: readonly(canIncrement),
    canDecrement: readonly(canDecrement),
    doubled: readonly(doubled),
  };
}
```

## Common Composable Patterns

### 1. Data Fetching

```typescript
// @composables/useFetch.ts
import { ref, computed, watch, type Ref } from 'vue';

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
  const {
    immediate = true,
    onSuccess,
    onError,
  } = options;

  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async () => {
    const finalUrl = typeof url === 'string' ? url : url.value;

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(finalUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json() as T;
      data.value = result;
      onSuccess?.(result);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      onError?.(error.value);
    } finally {
      loading.value = false;
    }
  };

  const refresh = () => execute();

  if (immediate) {
    execute();
  }

  // Watch URL changes if it's a ref
  if (typeof url === 'object') {
    watch(url, refresh);
  }

  return {
    data,
    loading: readonly(loading),
    error,
    execute,
    refresh,
  };
}
```

### 2. Local Storage

```typescript
// @composables/useLocalStorage.ts
import { ref, watch, type Ref } from 'vue';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [Ref<T>, (value: T) => void] {
  const storedValue = localStorage.getItem(key);
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue;

  const value = ref<T>(initialValue);

  // Update localStorage when value changes
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  const setValue = (newValue: T) => {
    value.value = newValue;
  };

  return [value, setValue];
}
```

### 3. Modal Management

```typescript
// @composables/useModal.ts
import { ref, type Ref } from 'vue';

export interface UseModalReturn<T = any> {
  isOpen: Readonly<Ref<boolean>>;
  data: Ref<T | null>;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
}

export function useModal<T = any>(): UseModalReturn<T> {
  const isOpen = ref(false);
  const data = ref<T | null>(null);

  const open = (modalData?: T) => {
    data.value = modalData || null;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    // Clear data after animation
    setTimeout(() => {
      data.value = null;
    }, 300);
  };

  const toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };

  return {
    isOpen: readonly(isOpen),
    data,
    open,
    close,
    toggle,
  };
}
```

### 4. Window Size

```typescript
// @composables/useWindowSize.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export interface UseWindowSizeReturn {
  width: Readonly<Ref<number>>;
  height: Readonly<Ref<number>>;
  isMobile: Readonly<Ref<boolean>>;
  isTablet: Readonly<Ref<boolean>>;
  isDesktop: Readonly<Ref<boolean>>;
}

export function useWindowSize(): UseWindowSizeReturn {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const updateSize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
  });

  const isMobile = computed(() => width.value < 768);
  const isTablet = computed(() => width.value >= 768 && width.value < 1024);
  const isDesktop = computed(() => width.value >= 1024);

  return {
    width: readonly(width),
    height: readonly(height),
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop),
  };
}
```

### 5. Debounce

```typescript
// @composables/useDebounce.ts
import { ref, watch, type Ref } from 'vue';

export function useDebounce<T>(
  value: Ref<T> | (() => T),
  delay: number
): Readonly<Ref<T>> {
  const debouncedValue = ref(value() as T);

  let timeoutId: NodeJS.Timeout;

  watch(
    () => (typeof value === 'function' ? value() : value.value),
    (newValue) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue;
      }, delay);
    },
    { immediate: true }
  );

  return readonly(debouncedValue);
}
```

### 6. Authentication

```typescript
// @composables/useAuth.ts
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Simulate API call
      const response = await authApi.login(credentials);
      user.value = response.user;
      router.push('/dashboard');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    router.push('/login');
  };

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
}
```

## Using Composables in Components

```vue
<template>
  <div>
    <h2>Counter: {{ counter.count }}</h2>
    <button @click="counter.increment">+</button>
    <button @click="counter.decrement">-</button>
    <p>Doubled: {{ counter.doubled }}</p>
    <p>Window size: {{ windowSize.width }}x{{ windowSize.height }}</p>
    <p v-if="windowSize.isMobile">Mobile view</p>
  </div>
</template>

<script setup lang="ts">
import { useCounter } from '@composables/useCounter';
import { useWindowSize } from '@composables/useWindowSize';

const counter = useCounter({ initial: 10, min: 0, max: 100 });
const windowSize = useWindowSize();
</script>
```

## Best Practices

### 1. Accept Refs as Arguments

```typescript
// Good - accepts refs for reactivity
export function useCounter(initial: Ref<number> | number) {
  const count = ref(typeof initial === 'object' ? initial.value : initial);
  // ...
}

// Usage
const initialCount = ref(10);
const counter = useCounter(initialCount);
```

### 2. Return Readonly Refs

```typescript
export function useCounter() {
  const count = ref(0);

  return {
    count: readonly(count), // Prevent external mutation
    increment: () => count.value++,
  };
}
```

### 3. Handle Cleanup

```typescript
export function useInterval(callback: () => void, delay: number) {
  const intervalId = ref<NodeJS.Timeout>();

  const start = () => {
    intervalId.value = setInterval(callback, delay);
  };

  const stop = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
  };

  onUnmounted(stop);

  return { start, stop };
}
```

### 4. Type Safety

```typescript
export interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseApiReturn<T> {
  data: Ref<T | null>;
  loading: Readonly<Ref<boolean>>;
  error: Ref<Error | null>;
  refetch: () => Promise<void>;
}
```

### 5. Error Handling

```typescript
export function useAsyncOperation<T, P extends any[]>(
  asyncFn: (...args: P) => Promise<T>
) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (...args: P) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await asyncFn(...args);
      data.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading: readonly(loading),
    error,
    execute,
  };
}
```

## Testing Composables

```typescript
// useCounter.spec.ts
import { ref } from 'vue';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const counter = useCounter();
    expect(counter.count.value).toBe(0);
  });

  it('should initialize with provided value', () => {
    const counter = useCounter({ initial: 5 });
    expect(counter.count.value).toBe(5);
  });

  it('should increment correctly', () => {
    const counter = useCounter({ initial: 5, max: 10 });
    counter.increment();
    expect(counter.count.value).toBe(6);
  });

  it('should respect max value', () => {
    const counter = useCounter({ initial: 9, max: 10 });
    counter.increment();
    counter.increment();
    expect(counter.count.value).toBe(10);
  });
});
```