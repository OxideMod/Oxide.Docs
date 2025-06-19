<template>
  <div class="items-layout">
    <div class="header-controls">
      <div class="search-bar-wrapper">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search by name, shortname, or category..."
          class="search-input"
        />
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <div class="filter-dropdown-wrapper">
        <select v-model="selectedCategory" class="filter-dropdown">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        :class="{ active: selectedCategory === category }"
        class="filter-button"
      >
        <img
          :src="getCategoryImageUrl(category)"
          :alt="category"
          class="category-image"
          v-if="category !== 'All'"
        />
        <span>{{ category }}</span>
      </button>
    </div>

    <div class="content">
      <div v-if="loading" class="loading-container">
        <p>Loading items...</p>
      </div>
      <div v-else-if="error" class="error-container">
        <p>Error loading items: {{ error }}</p>
      </div>
      <div v-else-if="filteredItems.length === 0" class="no-results-container">
        <p>No items found matching your criteria.</p>
      </div>
      <div v-else class="items-list">
        <div v-for="item in filteredItems" :key="item.ItemId" class="item">
          <div class="item-id-container" @click="copyId(item.ItemId)">
            <span class="item-id-label">ID:</span>
            <span v-if="copiedId !== item.ItemId" class="item-id">{{ item.ItemId }}</span>
            <span v-else class="copied-text">Copied!</span>
          </div>
          <span class="item-name">{{ item.ItemDisplayName }}</span>
          <div class="item-meta">
            <span class="item-shortname">{{ item.ItemShortName }}</span>
            <span class="item-category">{{ item.ItemCategory }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useItems } from '../../composables/useItems';

const { filteredItems, loading, error, categories, selectedCategory, selectCategory, searchTerm } =
  useItems();

const copiedId = ref(null);

const getCategoryImageUrl = category => {
  const categoryImageMap = {
    Ammunition: 'ammo',
    Traps: 'traps',
    Misc: 'misc',
    Resources: 'resources',
    Construction: 'construction',
    Weapon: 'weapon',
    Electrical: 'electrical',
    Tool: 'tool',
    Attire: 'attire',
    Medical: 'medical',
    Food: 'food',
    Fun: 'fun',
    Component: 'component',
  };
  const imageName = categoryImageMap[category] || category.toLowerCase();
  return `/items_images/${imageName}.png`;
};

const copyId = async id => {
  try {
    await navigator.clipboard.writeText(id);
    copiedId.value = id;
    setTimeout(() => {
      copiedId.value = null;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy ID:', err);
  }
};
</script>

<style scoped>
.items-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-bar-wrapper {
  flex-grow: 1;
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.filter-dropdown-wrapper {
  display: none; /* Hidden on desktop */
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-2);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  border-radius: 4px;
}

.filter-button:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.filter-button.active {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}

.category-image {
  width: 20px;
  height: 20px;
  object-fit: contain;
  opacity: 0.8;
}

.content {
  margin-top: 1rem;
}

.no-results-container {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  padding: 0.75rem 1rem;
  align-items: center;
  transition: background 0.2s ease;
  gap: 1rem;
}

.item:hover {
  background: var(--vp-c-bg-soft);
}

.item-id-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.item-id-container:hover {
  color: var(--vp-c-brand);
}

.item-id-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.item-id {
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
}

.copied-text {
  font-size: 0.8rem;
  color: var(--vp-c-brand);
}

.item-name {
  font-weight: 500;
}

.item-meta {
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
}

.item-shortname {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-category {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.error-container {
  color: var(--vp-c-danger);
}

@media (max-width: 768px) {
  .items-layout {
    padding: 1rem;
  }

  .header-controls {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .search-bar-wrapper {
    margin: 0;
    max-width: none;
    width: 100%;
  }

  .filter-dropdown-wrapper {
    display: block;
    width: 100%;
  }

  .filter-dropdown {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid var(--vp-c-divider);
    background-color: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    font-size: 1rem;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .filter-dropdown:focus {
    outline: none;
    border-color: var(--vp-c-brand);
  }

  .filter-bar {
    display: none;
  }

  .item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--vp-c-divider);
    margin-bottom: 0.5rem;
  }

  .item:hover {
    background: var(--vp-c-bg-soft);
    border-color: var(--vp-c-brand-light);
  }

  .item-name {
    font-size: 1rem;
    font-weight: 600;
    grid-row: 1;
    margin-bottom: 0.5rem;
  }

  .item-meta {
    grid-row: 2;
    justify-content: flex-start;
    margin-bottom: 0.5rem;
  }

  .item-id-container {
    grid-row: 3;
    justify-content: flex-start;
    padding-top: 0.5rem;
    border-top: 1px solid var(--vp-c-divider);
  }

  .item-category::before {
    content: '•';
    margin: 0 0.25rem;
    color: var(--vp-c-text-3);
  }

  .items-list {
    gap: 1rem;
  }
}
</style>
