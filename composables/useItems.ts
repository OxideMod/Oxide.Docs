import { ref, computed, onMounted } from 'vue';

export interface Item {
  ItemId: number;
  ItemDisplayName: string;
  ItemCategory: string;
  ItemShortName: string;
}

export function useItems() {
  const items = ref<Item[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const selectedCategory = ref('All');
  const searchTerm = ref('');

  const categories = ref<string[]>(['All']);

  onMounted(async () => {
    try {
      const response = await fetch('/data/exporter_items-2025-06-12.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      items.value = data.Items;

      const itemCategories = Array.from(
        new Set(data.Items.map((item: Item) => item.ItemCategory))
      ) as string[];
      categories.value = ['All', ...itemCategories.sort()];
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  });

  const filteredItems = computed(() => {
    let tempItems = items.value;

    if (selectedCategory.value !== 'All') {
      tempItems = tempItems.filter(item => item.ItemCategory === selectedCategory.value);
    }

    if (searchTerm.value.trim() !== '') {
      const lowerSearchTerm = searchTerm.value.toLowerCase().trim();
      tempItems = tempItems.filter(
        item =>
          item.ItemDisplayName.toLowerCase().includes(lowerSearchTerm) ||
          item.ItemShortName.toLowerCase().includes(lowerSearchTerm) ||
          item.ItemCategory.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return tempItems;
  });

  function selectCategory(category: string) {
    selectedCategory.value = category;
  }

  return {
    filteredItems,
    loading,
    error,
    categories,
    selectedCategory,
    selectCategory,
    searchTerm,
  };
}
