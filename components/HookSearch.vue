<script lang="ts" setup>
import { useRoute, useRouter } from 'vitepress'
import { useSidebar } from 'vitepress/theme'
import { ComputedRef, computed, ref } from 'vue'

withDefaults(
  defineProps<{
    inSidebar: boolean;
  }>(),
  {
    inSidebar: true,
  }
);

const route = useRoute()
const showSearch = computed(() =>
  /^\/(hooks)\//.test(route.path)
)

const search = ref('')
const { sidebarGroups } = useSidebar()

const searchResults: ComputedRef<any[]> = computed(() => {
  if (!search.value) return []

  let result = [];

  sidebarGroups.value.forEach(group => {
    group.items.forEach(item => {
      if (item.items) {
        item.items.forEach(subItem => {
          if (subItem.text.toLowerCase().includes(search.value.toLowerCase())) {
            result.push(subItem);
          }
        });
      } else {
        if (item.text.toLowerCase().includes(search.value.toLowerCase())) {
          result.push(item);
        }
      }
    });
  });

  return result.slice(0, 5);
});
</script>

<template>
  <div v-if="!inSidebar || showSearch">
    <div v-if="inSidebar" class="sidebar-heading remove-bottom">Hooks</div>
    
    <input
      type="search"
      class="search"
      :class="{inSidebar}"
      placeholder="Search Hooks"
      aria-label="Search Hooks"
      v-model="search"
      />

    <div v-if="searchResults.length > 0" class="custom-sidebar">
      <div class="sidebar-heading">Results</div>
      <div class="sidebar-items">
        <div v-for="result in searchResults" :key="result.text" class="sidebar-link">
          <a v-if="result.link" :href="result.link">{{ result.text }}</a>
          <span v-else>{{ result.text }}</span>
        </div>
      </div>
    </div>

    <div class="divider"></div>
  </div>
</template>

<style>
.custom-sidebar * {
  margin: inherit !important;
  text-decoration: inherit !important;
}
</style>

<style scoped>
.search {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-base);

  margin-top: 1rem;
  background-color: var(--vp-c-bg-alt);
}

.search::placeholder {
  color: var(--vp-c-text-2);
}

.search.inSidebar {
  background-color: var(--vp-c-bg);
  margin-top: 0;
}

.remove-bottom{
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.divider{
  margin-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* Added styles for sidebar components */
.sidebar-heading {
  font-weight: 600;
  font-size: 14px;
  padding: 6px 0;
}

.sidebar-link {
  font-size: 14px;
  padding: 4px 0 4px 12px;
}

.sidebar-link a {
  display: block;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.25s;
}

.sidebar-link a:hover {
  color: var(--vp-c-brand);
}
</style>
