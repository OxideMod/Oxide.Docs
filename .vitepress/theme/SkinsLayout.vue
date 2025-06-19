<template>
  <div class="skins-layout">
    <!-- Mobile hamburger button -->
    <button
      class="mobile-menu-toggle"
      @click="toggleMobileMenu"
      :class="{ active: isMobileMenuOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Mobile overlay -->
    <div
      class="mobile-overlay"
      :class="{ active: isMobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>

    <div class="sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-content">
        <div class="filter-group">
          <h3 class="filter-title">Search</h3>
          <div class="search-input-wrapper">
            <input
              type="text"
              :value="searchTerm"
              @input="updateSearch($event.target.value)"
              placeholder="Search skins..."
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
        </div>

        <div class="filter-group">
          <h3 class="filter-title">Skin Type</h3>
          <div class="select-wrapper">
            <select
              v-model="selectedSkinType"
              @change="updateSkinType($event.target.value)"
              class="select-input"
            >
              <option value="">All Skin Types</option>
              <option v-for="type in itemTypes.filter(t => t !== 'All')" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <svg class="select-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>

        <div class="filter-group">
          <h3 class="filter-title">Item Type</h3>
          <div class="search-input-wrapper filter-search">
            <input
              type="text"
              v-model="itemNameFilter"
              placeholder="Filter items..."
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
          <div class="item-type-grid scrollable-grid">
            <label v-for="itemName in filteredItemNames" :key="itemName" class="checkbox-label">
              <input
                type="checkbox"
                :checked="selectedItemNames.includes(itemName)"
                @change="updateItemName(itemName)"
                class="checkbox-input"
              />
              <span class="checkbox-custom">
                <svg class="checkbox-check-icon" viewBox="0 0 16 16" fill="currentColor">
                  <path
                    d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
                  ></path>
                </svg>
              </span>
              <span class="checkbox-text">{{ itemName }}</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h3 class="filter-title">Price Range (USD)</h3>
          <div class="price-range-slider-container">
            <div class="price-range-values">
              <span>${{ priceRange.min }}</span>
              <span>${{ priceRange.max }}</span>
            </div>
            <div class="multi-range-slider-container">
              <input
                type="range"
                :min="0"
                :max="maxPrice"
                :value="priceRange.min"
                @input="updatePriceRange({ min: Number($event.target.value), max: priceRange.max })"
                class="range-slider min-slider"
              />
              <input
                type="range"
                :min="0"
                :max="maxPrice"
                :value="priceRange.max"
                @input="updatePriceRange({ min: priceRange.min, max: Number($event.target.value) })"
                class="range-slider max-slider"
              />
            </div>
          </div>
          <div class="price-range-inputs">
            <div class="price-input-container">
              <span class="price-label">Min</span>
              <input
                type="number"
                :value="priceRange.min"
                @input="updatePriceRange({ min: Number($event.target.value), max: priceRange.max })"
                min="0"
                class="price-input"
              />
            </div>
            <div class="price-input-container">
              <span class="price-label">Max</span>
              <input
                type="number"
                :value="priceRange.max"
                @input="updatePriceRange({ min: priceRange.min, max: Number($event.target.value) })"
                min="0"
                :max="maxPrice"
                class="price-input"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="rusthelp-info">
        <a href="https://rusthelp.com/tools/skins/" target="_blank" rel="noopener noreferrer">
          For the most up to date and accurate information on Rust skins please visit RustHelp
        </a>
      </div>
    </div>

    <div class="content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading skins data...</p>
      </div>
      <div v-else-if="error" class="error-container">
        <h3>Error Loading Skins</h3>
        <p>{{ error }}</p>
      </div>
      <div v-else-if="uniqueFilteredSkins.length > 0" class="skin-container">
        <div v-for="item in uniqueFilteredSkins" :key="item.skinId" class="skin-item">
          <div class="skin-image-container">
            <img
              :src="getImageUrl(item.iconUrl)"
              :alt="item.skinName"
              class="skin-image"
              :class="{ 'acoustic-guitar': isAcousticGuitar(item) }"
              loading="lazy"
            />
          </div>
          <div class="skin-content">
            <div class="skin-info-section">
              <div class="skin-header-row">
                <h3 class="skin-name" v-text="item.skinName"></h3>
                <div
                  class="skin-id"
                  v-if="item.skinId"
                  @click="copyToClipboard(item.skinId, $event)"
                >
                  ID: {{ item.skinId }}
                </div>
              </div>
              <div class="skin-meta-row">
                <div class="skin-item-details">
                  <div class="skin-item-name">
                    {{ item.itemName }}
                    <a
                      v-if="
                        item.foundInMarket &&
                        item.skinName &&
                        getSkinMarketplaceUrl(item) &&
                        !isTwitchDrop(item) &&
                        !isDLCOnly(item)
                      "
                      :href="getSkinMarketplaceUrl(item)"
                      target="_blank"
                      class="skin-icon-link steam"
                    >
                      <img src="/steam.svg" alt="Steam" class="steam-icon" />
                    </a>
                    <a
                      v-if="!isAcousticGuitar(item) && !isDLCOnly(item)"
                      :href="getRustHelpUrl(item)"
                      target="_blank"
                      class="skin-icon-link rusthelp"
                    >
                      <img src="/rust-help.svg" alt="RustHelp" class="rusthelp-icon" />
                    </a>
                  </div>
                  <div class="skin-type" v-text="item.skinType || 'Unknown'"></div>
                </div>
                <div
                  class="skin-price"
                  :class="{
                    unavailable:
                      !item.foundInMarket ||
                      !item.sellingPriceText ||
                      item.sellingPriceText === '$0.00' ||
                      isDLCOnly(item),
                  }"
                  v-text="
                    isDLCOnly(item)
                      ? 'DLC Only'
                      : item.foundInMarket
                        ? formatPrice(item.sellingPriceText)
                        : 'Not available on market'
                  "
                ></div>
              </div>
            </div>
            <div class="skin-buttons-container" style="display: none">
              <a
                v-if="item.foundInMarket && item.skinName && getSkinMarketplaceUrl(item)"
                :href="getSkinMarketplaceUrl(item)"
                target="_blank"
                class="skin-link"
              >
                <img src="/steam.svg" alt="Steam" class="steam-icon" />
              </a>
              <a :href="getRustHelpUrl(item)" target="_blank" class="skin-link rusthelp">
                <img src="/rust-help.svg" alt="RustHelp" class="rusthelp-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-results-container">
        <p>No skins found matching your criteria.</p>
      </div>
      <div v-if="loadingMore" class="load-more-container">
        <p>Loading more skins...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSkins } from '../../composables/useSkins';
import { onMounted, ref, computed } from 'vue';

const {
  skins,
  visibleItems,
  loading,
  error,
  loadingMore,
  allLoaded,
  isInitialized,
  searchTerm,
  selectedItemTypes,
  selectedItemNames,
  priceRange,
  filteredSkins,
  itemTypes,
  itemNames,
  updateSearch,
  updateItemType,
  updateItemName,
  updatePriceRange,
  loadMore,
  copyToClipboard,
  getImageUrl,
  formatPrice,
  getSkinMarketplaceUrl,
  getRustHelpUrl,
} = useSkins();

const maxPrice = ref(1000);
const itemNameFilter = ref('');
const selectedSkinType = ref('');
const isMobileMenuOpen = ref(false);

// Mobile menu functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Helper functions for conditional rendering
const isAcousticGuitar = item => {
  return item.itemName === 'Acoustic Guitar';
};

const isTwitchDrop = item => {
  return item.skinType === 'Twitch Drop';
};

const isDLCOnly = item => {
  return (
    item.skinId &&
    item.skinId.toString().length === 5 &&
    (!item.foundInMarket || !item.sellingPriceText || item.sellingPriceText === '$0.00')
  );
};

// Items to exclude from the filter
const excludedItemTypes = [
  'Disco Floor',
  'Rocking Chair',
  'Sky Lantern',
  'Sled',
  'Snowmobile',
  'Spray Can Decal',
  'Wanted Poster',
];

// Filter the item names based on the search input and excluded items
const filteredItemNames = computed(() => {
  // First filter out excluded items
  const filteredNames = itemNames.value.filter(name => !excludedItemTypes.includes(name));

  // Then apply search filter if any
  if (!itemNameFilter.value) return filteredNames;
  const search = itemNameFilter.value.toLowerCase();
  return filteredNames.filter(name => name.toLowerCase().includes(search));
});

// Ensure no duplicate item names are shown
const uniqueFilteredSkins = computed(() => {
  const seenNames = new Set();
  return filteredSkins.value.filter(skin => {
    const key = `${skin.itemName}-${skin.skinName}`;
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });
});

const updateSkinType = type => {
  selectedSkinType.value = type;
  // Clear all selected types first
  while (selectedItemTypes.value.length > 0) {
    selectedItemTypes.value.pop();
  }
  // Add the selected type if it's not empty
  if (type) {
    selectedItemTypes.value.push(type);
  }
};

onMounted(() => {
  // Initialize component silently
});
</script>

<style scoped>
/* Main Layout */
.skins-layout {
  display: flex;
  background-color: var(--vp-c-bg);
  position: relative;
}

/* Mobile hamburger button */
.mobile-menu-toggle {
  display: none;
  position: fixed;
  top: calc(var(--vp-nav-height, 64px) + 10px);
  left: 20px;
  z-index: 1001;
  width: 44px;
  height: 44px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-menu-toggle.active {
  left: calc(280px + 10px);
}

.mobile-menu-toggle span {
  width: 20px;
  height: 2px;
  background: var(--vp-c-text-1);
  transition: all 0.3s ease;
  border-radius: 1px;
}

.mobile-menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-overlay.active {
  opacity: 1;
  pointer-events: all;
}

/* Sidebar */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid var(--vp-c-divider);
  height: calc(100vh - var(--vp-nav-height, 64px));
  position: sticky;
  top: var(--vp-nav-height, 64px);
  overflow-y: auto;
}

.sidebar-content {
  padding: 24px;
}

/* RustHelp Info */
.rusthelp-info {
  padding: 15px;
  margin-top: 10px;
  text-align: center;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 14px;
}

.rusthelp-info a {
  color: var(--vp-c-brand);
  text-decoration: none;
  transition: color 0.2s;
}

.rusthelp-info a:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Search Input */
.search-input-wrapper {
  position: relative;
  margin-bottom: 12px;
}
.search-input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}
.search-input:focus {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
  outline: none;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-2);
}

/* Checkbox Grid */
.item-type-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scrollable-grid {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 8px;
  border-radius: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
.checkbox-check-icon {
  width: 16px;
  height: 16px;
  color: white;
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.checkbox-input:checked + .checkbox-custom {
  background-color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}
.checkbox-input:checked + .checkbox-custom .checkbox-check-icon {
  opacity: 1;
  transform: scale(1);
}

/* Price Filter */
.price-range-slider-container {
  position: relative;
  margin-bottom: 12px;
}

.price-range-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.multi-range-slider-container {
  position: relative;
  height: 6px;
  margin: 16px 0;
}

.range-slider {
  position: absolute;
  width: 100%;
  height: 6px;
  appearance: none;
  -webkit-appearance: none;
  background: none;
  pointer-events: none;
  outline: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
  pointer-events: auto;
  margin-top: -6px;
  z-index: 3;
  position: relative;
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
  pointer-events: auto;
  z-index: 3;
  position: relative;
}

.multi-range-slider-container::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: var(--vp-c-divider);
  border-radius: 3px;
}

.price-range-inputs {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.price-input-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.price-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 4px;
}
.price-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
}

/* Main Content Area */
.content {
  flex-grow: 1;
  padding: 24px;
  min-width: 0;
}

.skin-container {
  display: grid;
  grid-template-columns: 1fr; /* One column layout */
  gap: 20px;
}

/* Other styles from before... */
.skin-item {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.3s;
}

.skin-item:hover {
  border-color: var(--vp-c-brand);
}

.skin-image-container {
  width: 128px;
  height: 128px;
  flex-shrink: 0;
  background-color: var(--vp-c-bg-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.skin-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.skin-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.skin-info-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skin-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.skin-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.skin-id {
  font-size: 12px;
  font-family: monospace;
  cursor: pointer;
  background-color: var(--vp-c-bg-mute);
  padding: 2px 5px;
  border-radius: 4px;
}

.skin-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.skin-item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skin-item-name {
  font-size: 14px;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 8px;
}

.skin-type {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.skin-price {
  font-weight: 600;
}

.skin-price.unavailable {
  font-weight: normal;
  color: var(--vp-c-text-3);
}

.skin-price.dlc-only {
  font-weight: normal;
  color: var(--vp-c-text-3);
}

.skin-buttons-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.skin-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 15px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid transparent;
}

.skin-link.rusthelp {
  background-color: #ce422b;
  color: white;
}

.skin-link:hover {
  opacity: 0.9;
}

.steam-icon,
.rusthelp-icon {
  width: 16px;
  height: 16px;
}

.loading-container,
.error-container,
.no-results-container,
.load-more-container {
  padding: 40px;
  text-align: center;
}

@media (max-width: 960px) {
  .mobile-menu-toggle {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }

  .skins-layout {
    flex-direction: row;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    border-right: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .content {
    width: 100%;
    padding: calc(var(--vp-nav-height, 64px) + 10px) 16px 16px;
  }

  .skin-container {
    gap: 12px;
  }

  .skin-item {
    display: grid;
    grid-template-columns: 1fr 2fr;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
    overflow: hidden;
    min-height: 80px;
  }

  .skin-image-container {
    background-color: var(--vp-c-bg-mute);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
  }

  .skin-image {
    max-width: 50px;
    max-height: 50px;
    object-fit: contain;
  }

  .skin-content {
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
  }

  .skin-header-row {
    display: block;
  }

  .skin-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px 0;
    line-height: 1.3;
  }

  .skin-id-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .skin-id {
    font-size: 11px;
    padding: 3px 6px;
    background: var(--vp-c-bg-mute);
    border-radius: 4px;
    font-family: monospace;
  }

  .skin-meta-row {
    display: block;
  }

  .skin-item-details {
    display: none;
  }

  .skin-type {
    display: none;
  }

  .skin-price {
    font-size: 16px;
    font-weight: 600;
    color: var(--vp-c-brand);
    margin: 0;
  }

  .skin-price.unavailable {
    color: var(--vp-c-text-3);
  }

  .skin-buttons-container {
    display: none;
  }

  .skin-icon-link {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .steam-icon,
  .rusthelp-icon {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: calc(var(--vp-nav-height, 64px) + 20px) 12px 12px;
  }

  .skin-container {
    gap: 10px;
  }

  .skin-item {
    border-radius: 6px;
  }

  .skin-image-container {
    height: 100px;
    padding: 12px;
  }

  .skin-image {
    max-width: 76px;
    max-height: 76px;
  }

  .skin-content {
    padding: 12px;
  }

  .skin-name {
    font-size: 15px;
  }

  .skin-id {
    font-size: 10px;
    padding: 3px 6px;
  }

  .skin-item-name {
    font-size: 13px;
  }

  .skin-price {
    font-size: 15px;
  }

  .skin-link {
    width: 28px;
    height: 28px;
  }

  .steam-icon,
  .rusthelp-icon {
    width: 14px;
    height: 14px;
  }
}

/* Select Input Styling */
.select-wrapper {
  position: relative;
}

.select-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.select-input:focus {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
  outline: none;
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-2);
  pointer-events: none;
}

.skin-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: opacity 0.2s ease;
}

.skin-link:hover {
  opacity: 0.85;
}

.skin-link.steam {
  background-color: #1b2838;
}

.skin-link.rusthelp {
  background-color: #f76b15;
}
</style>
