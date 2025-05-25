<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

const skins = ref({ metadata: {}, items: [] });
const visibleItems = ref(20); // Start with 20 items
const loading = ref(true);
const error = ref(null);
const loadingMore = ref(false);
const allLoaded = ref(false);
const isInitialized = ref(false);
const searchTerm = ref(''); // Added for search

// Computed property to filter skins
const filteredSkins = computed(() => {
  if (!skins.value.items) return []; // Ensure skins.value.items exists
  const term = searchTerm.value.toLowerCase();
  if (!term) {
    // When no search term, return all items up to visibleItems limit
    return skins.value.items.slice(0, visibleItems.value);
  }
  // When there IS a search term, filter ALL items, then slice for visibleItems
  // This ensures that "load more" correctly loads more from the filtered set.
  const allFiltered = skins.value.items.filter(skin => 
    skin.name && skin.name.toLowerCase().includes(term)
  );
  return allFiltered.slice(0, visibleItems.value);
});

// Computed property for the full list of filtered skins (not paginated by visibleItems)
const allMatchingFilteredSkins = computed(() => {
  if (!skins.value.items) return [];
  const term = searchTerm.value.toLowerCase();
  if (!term) {
    return skins.value.items;
  }
  return skins.value.items.filter(skin =>
    skin.name && skin.name.toLowerCase().includes(term)
  );
});

// Throttle scroll event to improve performance
let scrollTimeout;
const handleScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // If we're near the bottom of the page
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.body.offsetHeight - 500; // 500px before the bottom
    
    if (scrollPosition >= bottomPosition) {
      loadMore();
    }
  }, 200);
};

// Load more items function
const loadMore = () => {
  if (loadingMore.value || allLoaded.value) return;

  loadingMore.value = true;

  // Use allMatchingFilteredSkins to determine if more can be loaded
  if (visibleItems.value < allMatchingFilteredSkins.value.length) {
    visibleItems.value += 15;
    if (visibleItems.value >= allMatchingFilteredSkins.value.length) {
      allLoaded.value = true;
    }
  } else {
    allLoaded.value = true;
  }
  loadingMore.value = false;
};

onMounted(async () => {
  // Set data attribute to enable scoped styling for this page only
  document.body.setAttribute('data-skins-page', 'true');
  
  try {
    loading.value = true;
    const response = await fetch('/data/skins.json');
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const jsonData = await response.json();
    // Ensure items is always an array, even if jsonData.items is undefined
    const itemsArray = Array.isArray(jsonData.items) ? jsonData.items : [];
    
    // Shuffle the items before assigning
    shuffleArray(itemsArray);

    skins.value = { 
      metadata: jsonData.metadata || {}, 
      items: itemsArray 
    };
    
    // Reset visibleItems and allLoaded whenever new data is fetched or search term changes
    // This will be handled by a watcher on searchTerm and skins.value.items
    visibleItems.value = 20; 
    allLoaded.value = false;

    if (allMatchingFilteredSkins.value.length <= visibleItems.value) {
      allLoaded.value = true;
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
    isInitialized.value = true;
  }
  
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  // Remove data attribute when leaving the page
  document.body.removeAttribute('data-skins-page');
  window.removeEventListener('scroll', handleScroll);
});

// Watch for changes in searchTerm and reset pagination
watch(searchTerm, () => {
  visibleItems.value = 20; // Reset to initial count
  allLoaded.value = false; // Reset allLoaded flag
  // Check if all items are already visible with the new filter
  if (allMatchingFilteredSkins.value.length <= visibleItems.value) {
    allLoaded.value = true;
  }
});

function getImageUrl(iconUrl) {
  if (!iconUrl) return '';
  if (iconUrl.startsWith('https://')) {
    return iconUrl;
  }
  return 'https://community.cloudflare.steamstatic.com/economy/image/' + iconUrl;
}

function formatPrice(priceText) {
  if (!priceText || priceText === '$0.00') return 'Price unavailable';
  return `~${priceText} USD`;
}

function getMarketplaceUrl(appId, marketHashName) {
  if (!appId || !marketHashName) return null;
  const encodedName = encodeURIComponent(marketHashName);
  return `https://steamcommunity.com/market/listings/${appId}/${encodedName}`;
}

// Function to shuffle an array in place (Fisher-Yates shuffle)
function shuffleArray(array) {
  if (!array) return; // Guard against undefined array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
</script>

<style>
/* Scope VitePress container overrides to only the skins page using data attribute */
[data-skins-page] .VPDoc,
[data-skins-page="true"] .VPDoc {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

[data-skins-page] .VPDoc .container,
[data-skins-page="true"] .VPDoc .container {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

[data-skins-page] .VPDoc .content,
[data-skins-page="true"] .VPDoc .content {
  max-width: 100% !important;
  padding: 0 !important;
}

[data-skins-page] .VPContent,
[data-skins-page="true"] .VPContent {
  width: 100% !important;
  max-width: 100% !important;
}

[data-skins-page] .VPContent .container,
[data-skins-page="true"] .VPContent .container {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

[data-skins-page] .VPDoc.has-aside .content-container,
[data-skins-page="true"] .VPDoc.has-aside .content-container {
  max-width: 100% !important;
}

[data-skins-page] .aside,
[data-skins-page="true"] .aside {
  display: none !important;
}

[data-skins-page] .VPContent.is-home,
[data-skins-page="true"] .VPContent.is-home {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
}

/* Hide Vue components before they're mounted */
[v-cloak] {
  display: none !important;
}

/* Custom styling for skins page with Oxide theme */
/* Define color variables for both light and dark modes */
:root {
  --skin-card-bg: linear-gradient(145deg, #ffffff, #f8f9fa);
  --skin-card-border: #e9ecef;
  --skin-image-bg-1: linear-gradient(135deg, #f8f9fa, #e9ecef);
  --skin-image-bg-2: linear-gradient(135deg, #dee2e6, #ced4da);
  --skin-shadow: rgba(0, 0, 0, 0.1);
  --skin-shadow-hover: rgba(0, 0, 0, 0.2);
}

.dark {
  --skin-card-bg: linear-gradient(145deg, var(--vp-c-bg-alt), #1a1a1d);
  --skin-card-border: #2d2d30;
  --skin-image-bg-1: linear-gradient(135deg, #1e1e21, #16161a);
  --skin-image-bg-2: linear-gradient(135deg, #131316, #0f0f12);
  --skin-shadow: rgba(0, 0, 0, 0.3);
  --skin-shadow-hover: rgba(0, 0, 0, 0.5);
}

.skins-page-container {
  width: 100%;
  margin: 0 auto;
  padding: 40px 0 0 0;
}

.skins-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 0 40px;
}

.skins-header h1 {
  background: -webkit-linear-gradient(10deg, #f76b15 10%, #cd412b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.search-input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding: 0 40px;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid #232225;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px rgba(247, 107, 21, 0.2);
}

.skin-container {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  margin-top: 30px;
  padding: 0 40px;
}

/* Responsive grid layout */
@media (max-width: 1800px) {
  .skin-container {
    grid-template-columns: repeat(7, 1fr);
  }
}

@media (max-width: 1600px) {
  .skin-container {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 1400px) {
  .skin-container {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1100px) {
  .skin-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 800px) {
  .skin-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .skin-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 400px) {
  .skin-container {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
  
  .skins-header {
    padding: 0 20px;
  }
}

.skin-item {
  border-radius: 12px;
  background: var(--skin-card-bg);
  box-shadow: 0 4px 20px var(--skin-shadow);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--skin-card-border);
  backdrop-filter: blur(10px);
}

.skin-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px var(--skin-shadow-hover);
  border-color: var(--vp-c-brand-2);
}

.skin-image-container {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  background: linear-gradient(135deg, var(--skin-image-bg-1), var(--skin-image-bg-2));
  overflow: hidden;
}

.skin-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.skin-item:hover .skin-image {
  transform: scale(1.1) rotate(2deg);
}

.skin-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.02));
}

.skin-name {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  min-height: 2.4rem;
  max-height: 3.6rem;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  hyphens: auto;
  letter-spacing: -0.01em;
}

.skin-type {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
  opacity: 0.9;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.skin-price {
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 10px 0;
  text-shadow: 0 1px 2px rgba(76, 175, 80, 0.2);
}

.skin-price.unavailable {
  background: linear-gradient(135deg, var(--vp-c-text-3), var(--vp-c-text-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: italic;
}

.skin-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f76b15 0%, #ff8533 50%, #cd412b 100%);
  color: white !important;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: auto;
  border: none;
  flex: 1;
  min-height: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(247, 107, 21, 0.3);
}

.skin-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.skin-link:hover::before {
  left: 100%;
}

.skin-link:hover {
  background: linear-gradient(135deg, #ff7a1e 0%, #ff9547 50%, #e04c33 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(247, 107, 21, 0.4);
  text-decoration: none;
  color: white !important;
}

.skin-link.rusthelp {
  background: linear-gradient(135deg, #2c5aa0 0%, #3d6bb5 50%, #1e3d6f 100%);
  box-shadow: 0 4px 15px rgba(44, 90, 160, 0.3);
}

.skin-link.rusthelp:hover {
  background: linear-gradient(135deg, #3366bb 0%, #4777cc 50%, #225088 100%);
  box-shadow: 0 8px 25px rgba(44, 90, 160, 0.4);
}

.skin-buttons-container {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 6px;
}

.steam-icon, .rusthelp-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
}

.skin-link:hover .steam-icon,
.skin-link:hover .rusthelp-icon {
  transform: scale(1.15);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  flex-direction: column;
  gap: 15px;
}

.loading-spinner {
  border: 4px solid rgba(247, 107, 21, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--vp-c-brand-1);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  margin-top: 20px;
  gap: 15px;
}

.load-more-container.visible {
  display: flex;
}

.all-loaded-message {
  text-align: center;
  padding: 30px 0;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.all-loaded-message.visible {
  display: block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  background: rgba(205, 65, 43, 0.1);
  color: #e04c33;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 30px auto;
  max-width: 600px;
  border: 1px solid rgba(205, 65, 43, 0.3);
}

.no-results-container {
  text-align: center;
  padding: 50px 20px;
  color: var(--vp-c-text-2);
}

.all-loaded-message p,
.load-more-container p {
  font-size: 0.9em;
  color: #aaa;
}
</style>

<div v-if="isInitialized" class="skins-page-container" v-cloak>
  <div class="skins-header">
    <p v-if="skins.metadata && skins.metadata.last_updated">Last Updated: {{ new Date(skins.metadata.last_updated * 1000).toLocaleString() }}</p>
  </div>

  <div class="search-input-container">
    <input type="text" v-model="searchTerm" placeholder="Search skins by name..." class="search-input" />
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
      <div v-for="(item, index) in filteredSkins" :key="item.market_hash_name || index" class="skin-item">
        <div class="skin-image-container">
          <img 
            v-if="item.asset_description?.icon_url" 
            :src="getImageUrl(item.asset_description.icon_url)" 
            alt="Skin image"
            class="skin-image"
          />
        </div>
        <div class="skin-content">
          <h3 class="skin-name">{{ item.name }}</h3>
          <div class="skin-type">{{ item.asset_description?.type || 'Twitch Drop / Default Item' }}</div>
          <div 
            class="skin-price" 
            :class="{ 'unavailable': !item.sell_price_text || item.sell_price_text === '$0.00' }"
          >
            {{ formatPrice(item.sell_price_text) }}
          </div>
          <div class="skin-buttons-container">
            <a 
              v-if="item.asset_description?.market_hash_name" 
              :href="getMarketplaceUrl(item.asset_description.appid, item.asset_description.market_hash_name)" 
              target="_blank"
              class="skin-link"
            >
              <img src="/steam.svg" alt="Steam Icon" class="steam-icon">
            </a>
            <a 
              href="https://rusthelp.com/tools/skins"
              target="_blank"
              class="skin-link rusthelp"
            >
              <img src="/rust-help.svg" alt="RustHelp Icon" class="rusthelp-icon">
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="filteredSkins.length === 0 && searchTerm" class="no-results-container">
    <p>No skins found matching "{{ searchTerm }}".</p>
  </div>
  <div v-else-if="filteredSkins.length === 0 && !searchTerm && skins.items && skins.items.length === 0" class="no-results-container">
    <p>No skins data available.</p>
  </div>
  <div v-else-if="allLoaded && filteredSkins.length > 0 && visibleItems >= allMatchingFilteredSkins.length" class="all-loaded-message" style="text-align: center; padding: 20px;">
    <p>All skins loaded.</p>
  </div>
  <div v-else-if="loadingMore" class="load-more-container" style="text-align: center; padding: 20px;">
    <p>Loading more skins...</p>
  </div>
</div>
