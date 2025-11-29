# Vue Component Patterns

## Modern Vue Component Structure

**Vue 3 Best Practices:**
- Use `<script setup lang="ts">` syntax (default)
- Composition API over Options API
- Single File Components (.vue)
- `defineProps` and `defineEmits` with TypeScript
- Proper reactivity usage

**Key Concepts:**
- Props down, events up pattern
- Provide/inject for deep prop drilling
- Slots for flexible component composition
- Teleport for portal content
- Keep components small and focused

## Component Structure Template

```vue
<template>
  <div>
    <h2>{{ props.title }}</h2>
    <button @click="handleClick">
      {{ props.buttonText }}
    </button>
    <slot name="content" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

interface Props {
  title: string;
  buttonText?: string;
  count?: number;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Click me',
  count: 0,
  isActive: false,
});

interface Emits {
  update: [value: string];
  delete: [id: number];
  click: [event: MouseEvent];
}

const emit = defineEmits<Emits>();

const localState = ref<string>('');
const isLoading = ref<boolean>(false);

const formattedCount = computed(() => props.count.toLocaleString());
const isReady = computed(() => !isLoading.value && localState.value);

const handleClick = (event: MouseEvent) => {
  emit('click', event);
  localState.value = 'clicked';
};

const handleUpdate = (newValue: string) => {
  localState.value = newValue;
  emit('update', newValue);
};

watch(() => props.count, (newCount) => {
  console.log(`Count changed to: ${newCount}`);
});

onMounted(() => {
  console.log('Component mounted');
});
</script>
```

## Advanced Patterns

### 1. Provide/Inject Pattern

**Parent Component:**
```vue
<script setup lang="ts">
import { provide, ref } from 'vue';

const theme = ref<'light' | 'dark'>('light');
const user = ref({ name: 'John', id: 1 });

provide('theme', theme);
provide('user', user);
</script>
```

**Child Component:**
```vue
<script setup lang="ts">
import { inject } from 'vue';

const theme = inject<Ref<'light' | 'dark'>>('theme');
const user = inject<Ref<User>>('user');
</script>
```

### 2. Teleport for Portals

```vue
<template>
  <Teleport to="body">
    <div class="modal-backdrop">
      <div class="modal-content">
        <h3>Modal Title</h3>
        <slot />
        <button @click="$emit('close')">Close</button>
      </div>
    </div>
  </Teleport>
</template>
```

### 3. Dynamic Components

```vue
<template>
  <component
    :is="currentComponent"
    v-bind="currentProps"
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ComponentA from './ComponentA.vue';
import ComponentB from './ComponentB.vue';

const currentTab = ref<'A' | 'B'>('A');

const currentComponent = computed(() => ({
  A: ComponentA,
  B: ComponentB,
}[currentTab.value]));
</script>
```

### 4. Async Components

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorMessage,
  delay: 200,
  timeout: 3000,
});
</script>
```

## Props and Emits Best Practices

### Props Validation

```typescript
interface UserProps {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isActive?: boolean;
  role: 'admin' | 'user' | 'guest';
}

const props = defineProps<UserProps>();

const props = withDefaults(defineProps<{
  title: string;
  count?: number;
  visible?: boolean;
}>(), {
  count: 0,
  visible: true,
});
```

### Emits Validation

```typescript
const emit = defineEmits<{
  update: [value: string];
  'update:name': [name: string];
  change: [id: number, value: string];
  close: [];
  'modal-open': [];
}>();
```

## Slot Patterns

### Named Slots

```vue
<template>
  <div class="card">
    <header>
      <slot name="header">
        <h3>Default Header</h3>
      </slot>
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <slot name="footer" :data="footerData" />
    </footer>
  </div>
</template>
```

### Scoped Slots

```vue
<template>
  <div>
    <slot
      v-for="(item, index) in items"
      :key="item.id"
      :item="item"
      :index="index"
    />
  </div>
</template>
```

## Performance Tips

1. **Use `v-memo` for expensive list items**
2. **Lazy load heavy components with `defineAsyncComponent`**
3. **Use `v-show` instead of `v-if` for frequent toggles**
4. **Implement proper key strategies for lists**
5. **Use computed properties for expensive calculations**
6. **Avoid unnecessary re-renders with proper reactivity**

## Common Pitfalls to Avoid

1. **Don't mutate props directly**
2. **Avoid deep watchers when possible**
3. **Don't use reactive for primitive values**
4. **Be careful with reactive destructuring**
5. **Avoid creating functions in templates**
6. **Don't overuse provide/inject**