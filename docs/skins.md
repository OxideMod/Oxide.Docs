<script setup>
import { useSkins } from '../composables/useSkins';

// Use the skins composable
const {
  // State
  skins,
  visibleItems,
  loading,
  error,
  loadingMore,
  allLoaded,
  isInitialized,
  searchTerm,
  debouncedSearchTerm,
  
  // Computed
  filteredSkins,
  allMatchingFilteredSkins,
  
  // Methods
  updateSearch,
  loadMore,
  copyToClipboard,
  getImageUrl,
  formatPrice,
  getSkinMarketplaceUrl,
  getRustHelpUrl,
  setupLazyLoading,
  initializeSkins,
} = useSkins();
</script>

<div v-if="isInitialized" class="skins-page-container" v-cloak>
  <div class="skins-header">
    <h1>Rust Skins Database</h1>
  </div>

  <div class="search-input-container">
    <input 
      type="text" 
      :value="searchTerm"
      @input="updateSearch($event.target.value)"
      placeholder="Search skins by name, item, or type..." 
      class="search-input"
      maxlength="100"
      autocomplete="off"
      spellcheck="false"
    />
  </div>

  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading skins data...</p>
  </div>

  <div v-else-if="error" class="error-container">
    <h3>Error Loading Skins</h3>
    <p>{{ error }}</p>
  </div>

  <div v-else-if="filteredSkins.length > 0">    
    <div class="skin-container">
      <div v-for="(item, index) in filteredSkins" :key="item.skinId || index" class="skin-item">
        <div class="skin-image-container">
          <img 
            v-if="item.iconUrl" 
            :src="getImageUrl(item.iconUrl)"
            alt="Skin image"
            class="skin-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="skin-content">
          <div class="skin-info-section">
            <div class="skin-header-row">
              <h3 class="skin-name" v-text="item.skinName"></h3>
              <div class="skin-id" v-if="item.skinId" @click="copyToClipboard(item.skinId, $event)">ID: {{ item.skinId }}</div>
            </div>
            <div class="skin-meta-row">
              <div class="skin-item-details">
                <div class="skin-item-name" v-text="item.itemName"></div>
                <div class="skin-type" v-text="item.skinType || 'Unknown'"></div>
              </div>
              <div class="skin-price" :class="{ 'unavailable': !item.foundInMarket || !item.sellingPriceText || item.sellingPriceText === '$0.00' }" v-text="item.foundInMarket ? formatPrice(item.sellingPriceText) : 'Not available on market'"></div>
            </div>
          </div>
          <div class="skin-buttons-container">
            <a 
              v-if="item.foundInMarket && item.skinName && getSkinMarketplaceUrl(item)" 
              :href="getSkinMarketplaceUrl(item)" 
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="skin-link"
              :class="{ 'blocked': item.skinType === 'Twitch Drop' }"
              :aria-label="`View ${item.skinName} on Steam Market`"
              :style="item.skinType === 'Twitch Drop' ? 'pointer-events: none; cursor: not-allowed;' : ''"
            >
              <img src="/steam.svg" alt="" class="steam-icon" aria-hidden="true">
              <strong>Steam</strong>
            </a>
            <a 
              :href="getRustHelpUrl(item)"
              target="_blank"
              rel="noopener noreferrer"
              class="skin-link rusthelp"
              :class="{ 'blocked': item.itemName === 'Acoustic Guitar' }"
              :aria-label="`View ${item.skinName || 'skin'} on RustHelp`"
              :style="item.itemName === 'Acoustic Guitar' ? 'pointer-events: none; cursor: not-allowed;' : ''"
            >
              <img src="/rust-help.svg" alt="" class="rusthelp-icon" aria-hidden="true">
              <strong>RUSTHELP</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="filteredSkins.length === 0 && searchTerm" class="no-results-container">
    <p>No skins found matching "{{ searchTerm }}".</p>
  </div>
  <div v-else-if="filteredSkins.length === 0 && !searchTerm && skins.skins && skins.skins.length === 0" class="no-results-container">
    <p>No skins data available.</p>
  </div>
  <div v-else-if="allLoaded && filteredSkins.length > 0 && visibleItems >= allMatchingFilteredSkins.length" class="all-loaded-message" style="text-align: center; padding: 20px;">
    <p>All skins loaded.</p>
  </div>
  <div v-else-if="loadingMore" class="load-more-container" style="text-align: center; padding: 20px;">
    <p>Loading more skins...</p>
  </div>
</div>
