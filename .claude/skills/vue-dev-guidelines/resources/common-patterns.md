# Common Patterns

Frequently used patterns for ref/reactive UI state and Pinia global state in Vue 3 applications.

---

## ref and reactive for UI State

### Local Component State with ref

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

// ✅ CORRECT - ref for primitive values
const loading = ref(false);
const error = ref<string | null>(null);
const count = ref(0);

// ✅ CORRECT - ref for computed properties
const isComplete = computed(() => count.value >= 10);

const increment = () => {
  count.value++;
};

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.getData();
    count.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch data';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <el-button @click="fetchData" :loading="loading">
      Fetch Data
    </el-button>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <p>Count: {{ count }}</p>
    <p v-if="isComplete">Complete!</p>
  </div>
</template>
```

### Object State with reactive

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue';

// ✅ CORRECT - reactive for objects
const formState = reactive({
  name: '',
  email: '',
  age: 0,
  preferences: {
    theme: 'light',
    notifications: true
  }
});

// ✅ CORRECT - watch reactive objects
watch(
  () => formState.name,
  (newName) => {
    console.log('Name changed:', newName);
  }
);

const resetForm = () => {
  formState.name = '';
  formState.email = '';
  formState.age = 0;
};

const updatePreferences = () => {
  formState.preferences.theme = 'dark';
};
</script>

<template>
  <el-form :model="formState">
    <el-form-item label="Name">
      <el-input v-model="formState.name" />
    </el-form-item>

    <el-form-item label="Email">
      <el-input v-model="formState.email" type="email" />
    </el-form-item>

    <el-form-item label="Age">
      <el-input-number v-model="formState.age" />
    </el-form-item>

    <el-form-item>
      <el-space>
        <el-button @click="resetForm">Reset</el-button>
        <el-button @click="updatePreferences">Dark Theme</el-button>
      </el-space>
    </el-form-item>
  </el-form>
</template>
```

### Computed Properties and Derived State

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const items = ref([
  { id: 1, name: 'Item 1', price: 100, category: 'A' },
  { id: 2, name: 'Item 2', price: 200, category: 'B' },
  { id: 3, name: 'Item 3', price: 150, category: 'A' },
]);

const selectedCategory = ref<string>('all');
const searchQuery = ref('');

// ✅ CORRECT - computed for derived state
const filteredItems = computed(() => {
  let filtered = items.value;

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(item => item.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

const totalPrice = computed(() =>
  filteredItems.value.reduce((sum, item) => sum + item.price, 0)
);

const itemCount = computed(() => filteredItems.value.length);
</script>

<template>
  <el-card>
    <template #header>
      <h3>Items List ({{ itemCount }})</h3>
    </template>

    <el-space style="margin-bottom: 1rem">
      <el-select v-model="selectedCategory">
        <el-option label="All" value="all" />
        <el-option label="Category A" value="A" />
        <el-option label="Category B" value="B" />
      </el-select>

      <el-input
        v-model="searchQuery"
        placeholder="Search items..."
        clearable
        style="width: 200px"
      />
    </el-space>

    <el-table :data="filteredItems">
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="category" label="Category" />
      <el-table-column prop="price" label="Price" />
    </el-table>

    <div style="margin-top: 1rem; text-align: right">
      <strong>Total: ${{ totalPrice }}</strong>
    </div>
  </el-card>
</template>
```

---

## Pinia for Global Client State (Minimal)

### Basic Pinia Store

```typescript
// @stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // ✅ MINIMAL - Only essential global state
  const token = ref<string | null>(null);
  const user = ref<{ id: number; name: string; email: string } | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await authApi.login(credentials);
    token.value = response.token;
    user.value = response.user;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
  };
});
```

### App Configuration Store

```typescript
// @stores/app.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  // ✅ MINIMAL - Only app-level configuration
  const theme = ref<'light' | 'dark'>('light');
  const loading = ref(false);

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading;
  };

  return {
    theme: readonly(theme),
    loading: readonly(loading),
    setTheme,
    setLoading,
  };
});
```

### Using Pinia in Components

```vue
<script setup lang="ts">
import { useAuthStore, useAppStore } from '@/stores';

const authStore = useAuthStore();
const appStore = useAppStore();

// Access state
const { isAuthenticated, user } = authStore;
const { theme } = appStore;

// Use actions
const handleLogin = async () => {
  await authStore.login({ email: 'user@example.com', password: 'password' });
};

const toggleTheme = () => {
  const newTheme = theme.value === 'light' ? 'dark' : 'light';
  appStore.setTheme(newTheme);
};
</script>

<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>User Status</h3>
        <el-button @click="toggleTheme">
          {{ theme === 'light' ? '🌙' : '☀️' }} {{ theme }}
        </el-button>
      </div>
    </template>

    <div v-if="isAuthenticated">
      <p>Welcome, {{ user?.name }}!</p>
      <p>Email: {{ user?.email }}</p>
      <el-button @click="authStore.logout">Logout</el-button>
    </div>

    <div v-else>
      <p>Please log in</p>
      <el-button @click="handleLogin">Login</el-button>
    </div>

    <div v-if="appStore.loading" style="margin-top: 1rem;">
      <el-loading-text>App loading...</el-loading-text>
    </div>
  </el-card>
</template>
```

---

## Summary

**Common Patterns:**
- ✅ ref and reactive for UI state
- ✅ Pinia for global client state (minimal)

**Key Vue 3 Features Used:**
- `ref` and `reactive` for state management
- `computed` for derived state
- `watch` for state observation
- Pinia for global state

**See Also:**
- [composables-guide.md](composables-guide.md) - Composable patterns
- [component-patterns.md](component-patterns.md) - Component structure and Element Plus
- [state-management.md](state-management.md) - Pinia patterns
- [styling-guide.md](styling-guide.md) - Element Plus styling