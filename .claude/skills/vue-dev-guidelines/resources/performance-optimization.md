# Vue Performance Optimization

## Overview

Performance optimization in Vue.js applications involves optimizing rendering, reactivity, memory usage, and loading times. This guide covers best practices and techniques for building high-performance Vue applications.

## Rendering Optimization

### 1. Lazy Loading Components

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// Basic lazy loading
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'));

// With loading and error states
const DataGrid = defineAsyncComponent({
  loader: () => import('./DataGrid.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorMessage,
  delay: 200,
  timeout: 3000,
});

// Suspense wrapper for async components
</script>

<template>
  <div>
    <Suspense>
      <template #default>
        <HeavyChart :data="chartData" />
      </template>
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </div>
</template>
```

### 2. v-memo for Template Optimization

```vue
<template>
  <!-- Memoize entire list items - only re-render when id or status changes -->
  <div
    v-for="item in items"
    :key="item.id"
    v-memo="[item.id, item.status]"
    :class="{ active: item.status === 'active' }"
  >
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
    <!-- Expensive child component -->
    <ExpensiveComponent :data="item.complexData" />
  </div>

  <!-- Memoize specific expensive part -->
  <div>
    <h2>Dashboard</h2>
    <div v-memo="[refreshTrigger]">
      <ExpensiveCalculation :data="largeDataSet" />
    </div>
    <button @click="refreshTrigger++">Refresh Data</button>
  </div>
</template>
```

### 3. v-show vs v-if

```vue
<template>
  <!-- Use v-show for frequent toggling (remains in DOM) -->
  <div v-show="isVisible" class="modal">
    Modal content that toggles frequently
  </div>

  <!-- Use v-if for infrequent toggling (added/removed from DOM) -->
  <div v-if="showDetails" class="details-panel">
    Heavy content that's rarely shown
  </div>
</template>
```

### 4. Key Strategies for Lists

```vue
<template>
  <!-- Good: Use stable, unique IDs -->
  <div v-for="user in users" :key="user.id">
    {{ user.name }}
  </div>

  <!-- Bad: Using array index as key (causes issues with reordering) -->
  <div v-for="(user, index) in users" :key="index">
    {{ user.name }}
  </div>

  <!-- For complex data, use compound keys -->
  <div v-for="item in items" :key="`${item.type}-${item.id}`">
    {{ item.name }}
  </div>
</template>
```

## Reactivity Optimization

### 1. Efficient State Updates

```vue
<script setup lang="ts">
// ❌ Bad - creates new object every time
const inefficientUpdate = () => {
  user.value = { ...user.value, name: newName };
};

// ✅ Good - update specific properties
const efficientUpdate = () => {
  user.value.name = newName;
};

// ❌ Bad - forces entire array to re-render
const addInefficientItem = () => {
  items.value = [...items.value, newItem];
};

// ✅ Good - use array methods that trigger minimal reactivity
const addEfficientItem = () => {
  items.value.push(newItem);
};

// For complex updates, use shallowRef for deep objects
const largeData = shallowRef<LargeObject>({});
const updateDeeply = () => {
  // Only triggers reactivity when explicitly updated
  largeData.value = newData;
};
</script>
```

### 2. Computed Properties

```vue
<script setup lang="ts">
// ✅ Use computed for expensive calculations
const expensiveFilteredList = computed(() => {
  return largeList.value
    .filter(item => item.active)
    .map(item => ({
      ...item,
      calculated: heavyCalculation(item),
    }));
});

// ✅ Memoize in composables
const useExpensiveCalculation = (data: Ref<any[]>) => {
  return computed(() => {
    // Cache results if data hasn't changed
    return data.value.map(item => expensiveTransform(item));
  });
};
</script>
```

### 3. Watch Optimization

```vue
<script setup lang="ts">
// ✅ Watch specific properties instead of entire objects
watch(
  () => user.value.email,
  (newEmail) => {
    validateEmail(newEmail);
  }
);

// ✅ Use immediate: false for expensive watchers
watch(
  largeDataset,
  (newData) => {
    processLargeDataset(newData);
  },
  { immediate: false }
);

// ✅ Use flush: 'post' for DOM-dependent updates
watch(
  searchTerm,
  () => {
    updateSearchResults();
  },
  { flush: 'post' }
);

// ✅ Debounce frequent watchers
const debouncedSearch = useDebounceFn(searchTerm, 300);
watch(debouncedSearch, (newTerm) => {
  performSearch(newTerm);
});
</script>
```

## Memory Management

### 1. Cleanup and Disposal

```vue
<script setup lang="ts">
import { onUnmounted, onBeforeUnmount } from 'vue';

// Clean up timers and intervals
let intervalId: NodeJS.Timeout;

onMounted(() => {
  intervalId = setInterval(() => {
    updateData();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

// Clean up event listeners
const handleResize = () => {
  updateLayout();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Clean up external libraries
let chartInstance: Chart;

onMounted(() => {
  chartInstance = new Chart(canvas, options);
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>
```

### 2. Memory Leak Prevention

```typescript
// @composables/useWebSocket.ts
export function useWebSocket(url: string) {
  const socket = ref<WebSocket | null>(null);
  const data = ref<any>(null);

  const connect = () => {
    socket.value = new WebSocket(url);

    socket.value.onmessage = (event) => {
      data.value = JSON.parse(event.data);
    };

    socket.value.onclose = () => {
      // Auto-reconnect with exponential backoff
      setTimeout(connect, Math.random() * 1000);
    };
  };

  onUnmounted(() => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
    }
  });

  return {
    data,
    connect,
  };
}
```

## Network and Loading Optimization

### 1. Route-based Code Splitting

```typescript
// @router/index.ts
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
    // Preload when user hovers over reports link
    preFetch: () => import('@/views/Reports.vue'),
  },
];
```

### 2. Image Optimization

```vue
<template>
  <!-- Lazy load images -->
  <img
    v-for="image in images"
    :key="image.id"
    :src="placeholderImage"
    :data-src="image.url"
    :alt="image.alt"
    class="lazy-image"
    loading="lazy"
  />

  <!-- Responsive images -->
  <picture>
    <source
      media="(min-width: 1024px)"
      :srcset="image.largeUrl"
    />
    <source
      media="(min-width: 768px)"
      :srcset="image.mediumUrl"
    />
    <img
      :src="image.smallUrl"
      :alt="image.alt"
      loading="lazy"
    />
  </picture>
</template>

<script setup lang="ts">
// Intersection Observer for lazy loading
const setupLazyLoading = () => {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('.lazy-image').forEach((img) => {
    imageObserver.observe(img);
  });
};

onMounted(() => {
  setupLazyLoading();
});
</script>
```

### 3. API Request Optimization

```typescript
// @composables/useApi.ts
import { ref, computed } from 'vue';

export function useApi<T>() {
  const cache = ref(new Map<string, { data: T; timestamp: number }>());
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const fetchData = async (url: string, options?: RequestInit): Promise<T> => {
    const cacheKey = `${url}:${JSON.stringify(options)}`;
    const cached = cache.value.get(cacheKey);

    // Return cached data if fresh
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    // Fetch new data
    const response = await fetch(url, options);
    const data = await response.json();

    // Cache the response
    cache.value.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  };

  // Batch similar requests
  const pendingRequests = new Map<string, Promise<T>>();

  const fetchWithDeduplication = async (url: string): Promise<T> => {
    if (pendingRequests.has(url)) {
      return pendingRequests.get(url)!;
    }

    const request = fetchData(url);
    pendingRequests.set(url, request);

    try {
      const data = await request;
      return data;
    } finally {
      pendingRequests.delete(url);
    }
  };

  return {
    fetchData,
    fetchWithDeduplication,
  };
}
```

## Component Performance

### 1. Virtual Scrolling

```vue
<template>
  <!-- For large lists, use virtual scrolling -->
  <RecycleScroller
    :items="largeList"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">
      {{ item.name }}
      <ExpensiveComponent :data="item" />
    </div>
  </RecycleScroller>
</template>

<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
</script>
```

### 2. Functional Components

```vue
<!-- Lightweight stateless component -->
<script lang="ts">
import type { FunctionalComponent } from 'vue';

interface ListProps {
  items: string[];
}

const ListComponent: FunctionalComponent<ListProps> = (
  { items },
  { slots }
) => {
  return h('ul', {}, items.map(item => h('li', { key: item }, item)));
};

ListComponent.props = {
  items: Array,
};

export default ListComponent;
</script>
```

### 3. Component Tree Optimization

```vue
<script setup lang="ts">
// Split large components into smaller ones
// Each component has a single responsibility
// Use provide/inject to avoid prop drilling

// Parent component
const sharedData = ref({});

provide('sharedData', sharedData);
</script>

<template>
  <div>
    <!-- Components only re-render when their specific data changes -->
    <UserHeader :user="user" />
    <UserStats :stats="stats" />
    <UserActions :actions="actions" />
  </div>
</template>
```

## Performance Monitoring

### 1. Performance Metrics

```typescript
// @utils/performance.ts
export const measureRenderTime = (componentName: string) => {
  const start = performance.now();

  onMounted(() => {
    const end = performance.now();
    const renderTime = end - start;

    if (renderTime > 100) {
      console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }

    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      analytics.track('component_render_time', {
        component: componentName,
        duration: renderTime,
      });
    }
  });
};

export const measureReactivity = (refName: string, reactiveRef: Ref) => {
  let updateCount = 0;
  const startTime = performance.now();

  watch(reactiveRef, () => {
    updateCount++;
    const currentTime = performance.now();
    const timeSinceStart = currentTime - startTime;

    console.log(`${refName} updated ${updateCount} times in ${timeSinceStart.toFixed(2)}ms`);
  });
};
```

### 2. Web Vitals Integration

```typescript
// @utils/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const setupWebVitals = () => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};

// Use in main.ts
import { createApp } from 'vue';
import { setupWebVitals } from './utils/web-vitals';

const app = createApp(App);

if (process.env.NODE_ENV === 'production') {
  setupWebVitals();
}
```

## Performance Checklist

### Development Time
- [ ] Use `v-memo` for expensive template parts
- [ ] Implement lazy loading for heavy components
- [ ] Use computed properties for expensive calculations
- [ ] Debounce frequent operations (search, resize)
- [ ] Properly clean up timers, listeners, and subscriptions
- [ ] Use appropriate keys for lists
- [ ] Choose between `v-if` and `v-show` wisely

### Build Time
- [ ] Configure code splitting for routes
- [ ] Optimize bundle size with tree shaking
- [ ] Compress images and assets
- [ ] Enable gzip compression
- [ ] Use CDN for static assets

### Runtime
- [ ] Monitor render times
- [ ] Track reactivity updates
- [ ] Measure Web Vitals
- [ ] Profile memory usage
- [ ] Check for memory leaks

## Performance Tools

### Vue DevTools
- Component performance profiling
- Reactivity debugging
- Event monitoring

### Chrome DevTools
- Performance tab for runtime analysis
- Memory tab for leak detection
- Network tab for request optimization

### Bundle Analysis
- `webpack-bundle-analyzer` for bundle inspection
- `source-map-explorer` for detailed analysis
