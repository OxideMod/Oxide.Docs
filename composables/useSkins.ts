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
  selectedItemTypes: ReturnType<typeof ref<string[]>>;
  selectedItemNames: ReturnType<typeof ref<string[]>>;
  priceRange: ReturnType<typeof ref<{ min: number; max: number }>>;

  // Computed
  filteredSkins: ReturnType<typeof computed<Skin[]>>;
  allMatchingFilteredSkins: ReturnType<typeof ref<Skin[]>>;
  itemTypes: ReturnType<typeof computed<string[]>>;
  itemNames: ReturnType<typeof computed<string[]>>;

  // Methods
  updateSearch: (newValue: string) => void;
  updateItemType: (itemType: string) => void;
  updateItemName: (itemName: string) => void;
  updatePriceRange: (newRange: { min: number; max: number }) => void;
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
  const selectedItemTypes = ref<string[]>([]);
  const selectedItemNames = ref<string[]>([]);
  const priceRange = ref({ min: 0, max: 500 }); // Default price range

  // A ref to hold the result of the full, unfiltered search and filter
  const allMatchingFilteredSkins = ref<Skin[]>([]);

  // A computed property for the visible slice of the filtered skins
  const filteredSkins = computed(() => {
    return allMatchingFilteredSkins.value.slice(0, visibleItems.value);
  });

  const itemTypes = computed(() => {
    if (!skins.value.skins) return [];
    const types = new Set(skins.value.skins.map(s => s.skinType).filter(Boolean) as string[]);
    return ['All', ...Array.from(types).sort()];
  });

  const itemNames = computed(() => {
    if (!skins.value.skins) return [];
    const names = new Set(skins.value.skins.map(s => s.itemName).filter(Boolean) as string[]);
    return Array.from(names).sort();
  });

  // Watch for changes in filters and update the full list of matching skins
  watch(
    [
      debouncedSearchTerm,
      selectedItemTypes,
      selectedItemNames,
      priceRange,
      () => skins.value.skins,
    ],
    ([term, itemTypes, itemNames, range, skinsValue]) => {
      if (!skinsValue) {
        allMatchingFilteredSkins.value = [];
        return;
      }

      const lowerCaseTerm = (term as string).toLowerCase().trim();

      let filtered = skinsValue.filter(skin => skin.foundInMarket === true);

      if (lowerCaseTerm) {
        filtered = filtered.filter(skin => {
          const skinName = (skin.skinName || '').toLowerCase();
          const itemName = (skin.itemName || '').toLowerCase();
          const skinType = (skin.skinType || '').toLowerCase();
          return (
            skinName.includes(lowerCaseTerm) ||
            itemName.includes(lowerCaseTerm) ||
            skinType.includes(lowerCaseTerm)
          );
        });
      }

      if (itemTypes && (itemTypes as string[]).length > 0) {
        filtered = filtered.filter(skin => (itemTypes as string[]).includes(skin.skinType || ''));
      }

      if (itemNames && (itemNames as string[]).length > 0) {
        filtered = filtered.filter(skin => (itemNames as string[]).includes(skin.itemName || ''));
      }

      const { min, max } = range as { min: number; max: number };
      filtered = filtered.filter(skin => {
        const price = parseFloat(skin.sellingPriceText?.replace('$', '') || '0');
        return price >= min && price <= max;
      });

      allMatchingFilteredSkins.value = filtered;
      resetPagination(); // Reset pagination whenever filters change
    },
    { deep: true } // Use deep watch for the priceRange object
  );

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
      // resetPagination is now called by the watcher
    }, 300); // 300ms debounce
  };

  const updateItemType = (itemType: string) => {
    const index = selectedItemTypes.value.indexOf(itemType);
    if (index > -1) {
      selectedItemTypes.value.splice(index, 1);
    } else {
      selectedItemTypes.value.push(itemType);
    }
    // resetPagination is now called by the watcher
  };

  const updateItemName = (itemName: string) => {
    const index = selectedItemNames.value.indexOf(itemName);
    if (index > -1) {
      selectedItemNames.value.splice(index, 1);
    } else {
      selectedItemNames.value.push(itemName);
    }
    // resetPagination is called by the watcher
  };

  const updatePriceRange = (newRange: { min: number; max: number }) => {
    priceRange.value = newRange;
    // resetPagination is now called by the watcher
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
    if (isInitialized.value) return; // Prevent re-initialization

    loading.value = true;
    error.value = null;

    try {
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
    onMounted(() => {
      initializeSkins();
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Setup lazy loading once after initial load
      setupLazyLoading();
    });

    onUnmounted(() => {
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
    selectedItemTypes,
    selectedItemNames,
    priceRange,

    // Computed
    filteredSkins,
    allMatchingFilteredSkins,
    itemTypes,
    itemNames,

    // Methods
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
    setupLazyLoading,
    initializeSkins,
  };
}
