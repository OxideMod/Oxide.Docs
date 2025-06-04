import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';

// Types
interface SkinMetadata {
  [key: string]: any;
}

interface Skin {
  skinId?: string | number;
  skinName?: string;
  itemName?: string;
  skinType?: string;
  iconUrl?: string;
  foundInMarket?: boolean;
  sellingPriceText?: string;
}

interface SkinsData {
  metadata: SkinMetadata;
  skins: Skin[];
}

interface UseSkins {
  // State
  skins: ReturnType<typeof ref<SkinsData>>;
  visibleItems: ReturnType<typeof ref<number>>;
  loading: ReturnType<typeof ref<boolean>>;
  error: ReturnType<typeof ref<string | null>>;
  loadingMore: ReturnType<typeof ref<boolean>>;
  allLoaded: ReturnType<typeof ref<boolean>>;
  isInitialized: ReturnType<typeof ref<boolean>>;
  searchTerm: ReturnType<typeof ref<string>>;
  debouncedSearchTerm: ReturnType<typeof ref<string>>;

  // Computed
  filteredSkins: ReturnType<typeof computed<Skin[]>>;
  allMatchingFilteredSkins: ReturnType<typeof computed<Skin[]>>;

  // Methods
  updateSearch: (newValue: string) => void;
  loadMore: () => void;
  copyToClipboard: (text: string, event: Event) => Promise<void>;
  getImageUrl: (iconUrl?: string) => string;
  formatPrice: (priceText?: string) => string;
  getSkinMarketplaceUrl: (skin: Skin) => string | null;
  getRustHelpUrl: (skin: Skin) => string;
  setupLazyLoading: () => void;
  initializeSkins: () => Promise<void>;
}

export function useSkins(): UseSkins {
  // State
  const skins = ref<SkinsData>({ metadata: {}, skins: [] });
  const visibleItems = ref(50);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const loadingMore = ref(false);
  const allLoaded = ref(false);
  const isInitialized = ref(false);
  const searchTerm = ref('');
  const searchDebounceTimer = ref<NodeJS.Timeout | null>(null);
  const debouncedSearchTerm = ref('');

  // Enhanced performance: memoized filtered results
  const filteredSkinsCache = ref(new Map<string, Skin[]>());

  // Computed property to filter skins with caching
  const filteredSkins = computed(() => {
    if (!skins.value.skins) return [];

    const term = debouncedSearchTerm.value.toLowerCase().trim();
    const cacheKey = `${term}_${visibleItems.value}`;

    // Check cache first
    if (filteredSkinsCache.value.has(cacheKey)) {
      return filteredSkinsCache.value.get(cacheKey)!;
    }

    // Filter market skins only once
    const marketSkins = skins.value.skins.filter(skin => skin.foundInMarket === true);

    let result: Skin[];
    if (!term) {
      result = marketSkins.slice(0, visibleItems.value);
    } else {
      // Enhanced search: search in multiple fields
      const allFiltered = marketSkins.filter(skin => {
        const skinName = (skin.skinName || '').toLowerCase();
        const itemName = (skin.itemName || '').toLowerCase();
        const skinType = (skin.skinType || '').toLowerCase();

        return skinName.includes(term) || itemName.includes(term) || skinType.includes(term);
      });
      result = allFiltered.slice(0, visibleItems.value);
    }

    // Cache the result
    filteredSkinsCache.value.set(cacheKey, result);

    // Limit cache size to prevent memory leaks
    if (filteredSkinsCache.value.size > 100) {
      const firstKey = filteredSkinsCache.value.keys().next().value;
      if (firstKey) {
        filteredSkinsCache.value.delete(firstKey);
      }
    }

    return result;
  });

  // Computed property for the full list of filtered skins (not paginated by visibleItems)
  const allMatchingFilteredSkins = computed(() => {
    if (!skins.value.skins) return [];

    const marketSkins = skins.value.skins.filter(skin => skin.foundInMarket === true);
    const term = debouncedSearchTerm.value.toLowerCase().trim();

    if (!term) {
      return marketSkins;
    }

    return marketSkins.filter(skin => {
      const skinName = (skin.skinName || '').toLowerCase();
      const itemName = (skin.itemName || '').toLowerCase();
      const skinType = (skin.skinType || '').toLowerCase();

      return skinName.includes(term) || itemName.includes(term) || skinType.includes(term);
    });
  });

  // Optimized scroll handler with better throttling
  let scrollTimeout: NodeJS.Timeout;
  let isScrolling = false;
  const handleScroll = () => {
    if (isScrolling) return; // Prevent multiple simultaneous scroll handlers

    isScrolling = true;
    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const bottomPosition = document.body.offsetHeight - 800; // Increased threshold

      if (scrollPosition >= bottomPosition) {
        loadMore();
      }
      isScrolling = false;
    }, 150); // Reduced debounce time for better responsiveness
  };

  // Optimized load more function
  const loadMore = () => {
    if (loadingMore.value || allLoaded.value) return;

    loadingMore.value = true;

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      const currentTotal = allMatchingFilteredSkins.value.length;
      if (visibleItems.value < currentTotal) {
        visibleItems.value = Math.min(visibleItems.value + 15, currentTotal);
        if (visibleItems.value >= currentTotal) {
          allLoaded.value = true;
        }
      } else {
        allLoaded.value = true;
      }
      loadingMore.value = false;
    });
  };

  // Input sanitization for security
  const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') return '';
    // Remove potentially dangerous characters and trim
    return input
      .replace(/[<>'"&]/g, '')
      .trim()
      .slice(0, 100); // Limit length
  };

  // Reset pagination when search changes
  const resetPagination = () => {
    visibleItems.value = 50;
    allLoaded.value = false;
    // Clear the cache when search changes
    filteredSkinsCache.value.clear();

    nextTick(() => {
      if (allMatchingFilteredSkins.value.length <= visibleItems.value) {
        allLoaded.value = true;
      }
    });
  };

  // Debounced search implementation
  const updateSearch = (newValue: string) => {
    searchTerm.value = newValue;

    // Clear existing timer
    if (searchDebounceTimer.value) {
      clearTimeout(searchDebounceTimer.value);
    }

    // Set new timer for debounced search
    searchDebounceTimer.value = setTimeout(() => {
      debouncedSearchTerm.value = sanitizeInput(newValue);
      resetPagination();
    }, 300); // 300ms debounce
  };

  // Enhanced image URL function with validation
  const getImageUrl = (iconUrl?: string): string => {
    if (!iconUrl || typeof iconUrl !== 'string') return '';

    // Validate URL format - include steamcommunity-a.akamaihd.net for scmm.json URLs
    if (
      iconUrl.startsWith('https://community.cloudflare.steamstatic.com/') ||
      iconUrl.startsWith('https://steamcdn-a.akamaihd.net/') ||
      iconUrl.startsWith('https://steamcommunity-a.akamaihd.net/') ||
      iconUrl.startsWith('https://files.facepunch.com/')
    ) {
      return iconUrl;
    }

    // Only allow specific trusted domains for constructed URLs
    if (iconUrl.match(/^[a-zA-Z0-9_\-./]+$/)) {
      return `https://community.cloudflare.steamstatic.com/economy/image/${iconUrl}`;
    }

    return '';
  };

  // Enhanced price formatting with validation
  const formatPrice = (priceText?: string): string => {
    if (!priceText || typeof priceText !== 'string' || priceText === '$0.00') {
      return 'Price unavailable';
    }

    // Sanitize price text
    const sanitizedPrice = priceText.replace(/[<>'"&]/g, '');
    return `~${sanitizedPrice} USD`;
  };

  // Enhanced marketplace URL function with validation
  const getSkinMarketplaceUrl = (skin: Skin): string | null => {
    if (!skin?.foundInMarket || !skin?.skinName) return null;

    try {
      // Validate and sanitize skin name
      const skinName = String(skin.skinName).trim();
      if (!skinName || skinName.length > 200) return null;

      const encodedName = encodeURIComponent(skinName);
      return `https://steamcommunity.com/market/listings/252490/${encodedName}`;
    } catch (e) {
      console.warn('Failed to generate marketplace URL:', e);
      return null;
    }
  };

  // Enhanced RustHelp URL function with validation
  const getRustHelpUrl = (skin: Skin): string => {
    const baseUrl = 'https://rusthelp.com/tools/skins';

    if (!skin?.skinId) return baseUrl;

    try {
      // Validate skin ID (should be numeric)
      const skinId = String(skin.skinId).trim();
      if (!/^\d+$/.test(skinId) || skinId.length > 20) {
        return baseUrl;
      }

      return `${baseUrl}/${skinId}`;
    } catch (e) {
      console.warn('Failed to generate RustHelp URL:', e);
      return baseUrl;
    }
  };

  // Optimized shuffle function with bounds checking
  const shuffleArray = (array: any[]): void => {
    if (!Array.isArray(array) || array.length <= 1) return;

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Simplified lazy loading - remove complex intersection observer
  const setupLazyLoading = () => {
    // Use native browser lazy loading instead of custom intersection observer
    // This is much more performant and handles everything automatically
    nextTick(() => {
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        const imageEl = img as HTMLImageElement;
        const dataSrc = imageEl.getAttribute('data-src');
        if (dataSrc) {
          // Simple direct assignment - let browser handle lazy loading
          imageEl.src = dataSrc;
          imageEl.classList.add('loaded');
          imageEl.removeAttribute('data-src');
        }
      });
    });
  };

  // Fallback copy function for older browsers
  const fallbackCopyToClipboard = (text: string, event: Event) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      // Using deprecated API as fallback for older browsers
      (document.execCommand as any)('copy');

      // Visual feedback
      const element = (event.target as HTMLElement).closest('.skin-id') as HTMLElement;
      if (element) {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        element.classList.add('copied');

        setTimeout(() => {
          element.textContent = originalText;
          element.classList.remove('copied');
        }, 1000);
      }
    } catch (err) {
      console.warn('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
  };

  // Copy to clipboard function with visual feedback
  const copyToClipboard = async (text: string, event: Event): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);

      // Visual feedback
      const element = (event.target as HTMLElement).closest('.skin-id') as HTMLElement;
      if (element) {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        element.classList.add('copied');

        setTimeout(() => {
          element.textContent = originalText;
          element.classList.remove('copied');
        }, 1000);
      }
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      fallbackCopyToClipboard(text, event);
    }
  };

  // Initialize skins data
  const initializeSkins = async (): Promise<void> => {
    try {
      loading.value = true;
      const response = await fetch('/data/merged_skins.json');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const jsonData = await response.json();

      // Validate and sanitize the JSON data
      const skinsArray = Array.isArray(jsonData.skins) ? jsonData.skins : [];

      // Only shuffle a sample for initial display to improve performance
      const shuffledSample = [...skinsArray];
      if (shuffledSample.length > 1000) {
        // For large datasets, only shuffle the first 1000 items
        shuffleArray(shuffledSample.slice(0, 1000));
      } else {
        shuffleArray(shuffledSample);
      }

      skins.value = {
        metadata: jsonData.metadata || {},
        skins: shuffledSample,
      };

      resetPagination();
    } catch (err) {
      error.value = `Failed to load skins data: ${(err as Error).message}`;
      console.error('Error loading skins:', err);
    } finally {
      loading.value = false;
      isInitialized.value = true;
    }
  };

  // Setup lifecycle hooks
  const setupLifecycle = () => {
    onMounted(async () => {
      document.body.setAttribute('data-skins-page', 'true');
      await initializeSkins();
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Setup lazy loading once after initial load
      setupLazyLoading();
    });

    onUnmounted(() => {
      document.body.removeAttribute('data-skins-page');
      window.removeEventListener('scroll', handleScroll);

      // Cleanup timers
      if (searchDebounceTimer.value) {
        clearTimeout(searchDebounceTimer.value);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    });
  };

  // Initialize lifecycle hooks
  setupLifecycle();

  return {
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
  };
}
