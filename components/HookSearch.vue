<script lang="ts" setup>
import { useRoute, useRouter } from 'vitepress'
import { useSidebar } from 'vitepress/theme'
import { ComputedRef, computed, ref } from 'vue'
import VPSidebarItem from 'vitepress/dist/client/theme-default/components/VPSidebarItem.vue'

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
    <VPSidebarItem v-if="inSidebar" :item="{text:'Hooks'}" :depth="0" class="remove-bottom" />
    
    <input
      type="search"
      class="search"
      :class="{inSidebar}"
      placeholder="Search Hooks"
      aria-label="Search Hooks"
      v-model="search"
      />

    <VPSidebarItem v-if="searchResults.length > 0" :item="{text: 'Results', items: searchResults}" :depth="1" class="custom-sidebar" />

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
</style>
