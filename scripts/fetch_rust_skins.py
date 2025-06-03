#!/usr/bin/env python3
import os
import json
import time
import random
import argparse
import requests
import asyncio
import aiohttp
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
import threading

# Configuration
RUST_APP_ID = 252490
# Hardcoded Steam API key
STEAM_API_KEY = "723BFA8311F43F30A1441797EFC74FA9"

OUTPUT_DIR = 'data'
OUTPUT_FILE = 'skins.json'
ITEMS_PER_PAGE = 100
MAX_RETRIES = 3
PARTIAL_SAVE_FREQUENCY = 300

# More aggressive rate limiting for GitHub Actions - but with better retry logic
MIN_REQUEST_INTERVAL = 15  # Reduced from 30 to 15 seconds
MAX_REQUEST_INTERVAL = 45  # Reduced from 60 to 45 seconds
RATE_LIMIT_BACKOFF_MULTIPLIER = 1.5  # Reduced from 2.0 to 1.5
RATE_LIMIT_BACKOFF_MAX = 120  # Reduced from 300 to 120 seconds (2 minutes max)

# Increased failure tolerance for GitHub Actions environment
MAX_CONSECUTIVE_FAILURES = 10  # Increased from 5
MAX_EMPTY_RESULTS = 8  # Increased from 3
MAX_EMPTY_BATCHES_IN_ROW = 5  # New: Allow more empty batches before giving up

# Session management for better API behavior
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
]

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Enhanced progress tracking
class SmartProgressTracker:
    def __init__(self):
        self.lock = threading.Lock()
        self.processed_batches = 0
        self.total_items_fetched = 0
        self.total_items_expected = 0
        self.rate_limits_hit = 0
        self.current_delay = MIN_REQUEST_INTERVAL
        self.consecutive_rate_limits = 0
        self.start_time = time.time()
        
    def set_expected_total(self, total):
        with self.lock:
            self.total_items_expected = total
            print(f"Total items available on Steam: {total}")
            
    def record_batch_success(self, items_count):
        with self.lock:
            self.processed_batches += 1
            self.total_items_fetched += items_count
            self.consecutive_rate_limits = 0
            
            if self.processed_batches % 10 == 0:  # Progress every 10 batches
                elapsed = time.time() - self.start_time
                rate = self.total_items_fetched / elapsed if elapsed > 0 else 0
                eta_seconds = (self.total_items_expected - self.total_items_fetched) / rate if rate > 0 else 0
                eta_minutes = eta_seconds / 60
                
                progress_pct = (self.total_items_fetched / self.total_items_expected * 100) if self.total_items_expected > 0 else 0
                print(f"Progress: {self.total_items_fetched}/{self.total_items_expected} ({progress_pct:.1f}%) | "
                      f"Rate: {rate:.1f} items/sec | ETA: {eta_minutes:.1f}m | Delay: {self.current_delay:.1f}s")
    
    def record_rate_limit(self):
        with self.lock:
            self.rate_limits_hit += 1
            self.consecutive_rate_limits += 1
            
            # Increase delay more aggressively with consecutive rate limits
            if self.consecutive_rate_limits == 1:
                self.current_delay = min(self.current_delay * RATE_LIMIT_BACKOFF_MULTIPLIER, MAX_REQUEST_INTERVAL)
            elif self.consecutive_rate_limits == 2:
                self.current_delay = min(60, RATE_LIMIT_BACKOFF_MAX)  # 1 minute
            else:
                self.current_delay = min(self.current_delay * 2, RATE_LIMIT_BACKOFF_MAX)  # Exponential up to max
            
            print(f"Rate limit #{self.rate_limits_hit} | Consecutive: {self.consecutive_rate_limits} | "
                  f"New delay: {self.current_delay:.1f}s")
    
    def get_current_delay(self):
        with self.lock:
            # Add small jitter to avoid synchronized requests
            jitter = random.uniform(0.8, 1.2)
            return max(self.current_delay * jitter, MIN_REQUEST_INTERVAL)  # Always at least 30 seconds
    
    def get_stats(self):
        with self.lock:
            elapsed = time.time() - self.start_time
            return {
                'total_fetched': self.total_items_fetched,
                'total_expected': self.total_items_expected,
                'rate_limits': self.rate_limits_hit,
                'elapsed_time': elapsed,
                'current_delay': self.current_delay
            }

tracker = SmartProgressTracker()

def fix_icon_url(icon_url):
    """Convert icon_url to the correct CloudFlare format if not already a full URL."""
    if not icon_url:
        return ""
    if icon_url.startswith('http://') or icon_url.startswith('https://'):
        return icon_url
    return f"https://community.cloudflare.steamstatic.com/economy/image/{icon_url}"

def is_valid_item(item):
    """Check if item should be included - slightly less restrictive for maximum coverage."""
    try:
        # Must have a name
        if not item.get('name'):
            return False
            
        # Must have asset description
        asset_desc = item.get('asset_description')
        if not asset_desc:
            return False
            
        # Must have either market_hash_name OR classid (for broader coverage)
        if not asset_desc.get('market_hash_name') and not asset_desc.get('classid'):
            return False
            
        # Less restrictive: accept items even if tradable/marketable flags are missing or 0
        # This captures more items including potentially rare/discontinued ones
        return True
    except:
        return False

def process_item(item):
    """Process an item - optimized for speed."""
    if not is_valid_item(item):
        return None
        
    # Fix icon URL
    asset_desc = item.get('asset_description', {})
    if 'icon_url' in asset_desc:
        asset_desc['icon_url'] = fix_icon_url(asset_desc['icon_url'])
    
    # Return minimal but complete item structure
    return {
        'name': item.get('name', ''),
        'sell_price': item.get('sell_price', 0),
        'sell_price_text': item.get('sell_price_text', ''),
        'app_name': item.get('app_name', ''),
        'sell_listings': item.get('sell_listings', 0),
        'asset_description': {
            'market_hash_name': asset_desc.get('market_hash_name', ''),
            'type': asset_desc.get('type', ''),
            'icon_url': asset_desc.get('icon_url', ''),
            'classid': asset_desc.get('classid', ''),
            'instanceid': asset_desc.get('instanceid', ''),
            'appid': asset_desc.get('appid', RUST_APP_ID),
            'commodity': asset_desc.get('commodity', 0),
            'currency': asset_desc.get('currency', 0),
            'background_color': asset_desc.get('background_color', ''),
            'tradable': asset_desc.get('tradable', 1),
            'marketable': asset_desc.get('marketable', 1)
        }
    }

async def fetch_marketplace_page(session, start=0, count=ITEMS_PER_PAGE):
    """Fetch a single page of marketplace items with optimized error handling."""
    url = "https://steamcommunity.com/market/search/render/"
    params = {
        "appid": RUST_APP_ID,
        "norender": 1,
        "start": start,
        "count": count,
        "sort_column": "popular",
        "sort_dir": "desc"
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            async with session.get(url, params=params) as response:
                if response.status == 429:  # Rate limited
                    tracker.record_rate_limit()
                    print(f"Rate limited at offset {start}, attempt {attempt + 1}")
                    # Don't retry immediately, let the caller handle the delay
                    return None
                    
                if response.status == 503:  # Service unavailable
                    wait_time = random.uniform(10, 20)  # Short wait for service issues
                    print(f"Service unavailable at offset {start}, waiting {wait_time:.1f}s")
                    await asyncio.sleep(wait_time)
                    continue
                    
                if response.status != 200:
                    print(f"HTTP {response.status} at offset {start}, attempt {attempt + 1}")
                    if attempt < MAX_RETRIES - 1:
                        await asyncio.sleep(5)  # Short retry delay for other errors
                        continue
                    else:
                        print(f"Final HTTP {response.status} failure at offset {start}")
                        return None
                
                data = await response.json()
                
                if not data or not data.get('success'):
                    print(f"Invalid response at offset {start}, attempt {attempt + 1}: success={data.get('success') if data else 'None'}")
                    if attempt < MAX_RETRIES - 1:
                        await asyncio.sleep(2)
                        continue
                    else:
                        print(f"Final invalid response at offset {start}")
                        return None
                    
                return data
                
        except asyncio.TimeoutError:
            print(f"Timeout at offset {start}, attempt {attempt + 1}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(5)
                continue
            else:
                print(f"Final timeout at offset {start}")
                return None
        except Exception as e:
            print(f"Error at offset {start}, attempt {attempt + 1}: {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(2)
                continue
            else:
                print(f"Final error at offset {start}: {e}")
                return None

    return None

async def fetch_all_items_optimized(max_items=20000):
    """Optimized fetching with smart rate limiting."""
    print("Starting Steam marketplace fetch...")
    print(f"Target: ALL available Rust skins (up to {max_items} limit)")
    
    # Enhanced session configuration
    timeout = aiohttp.ClientTimeout(total=60, connect=15)
    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'X-Requested-With': 'XMLHttpRequest'
    }
    
    connector = aiohttp.TCPConnector(limit=1, limit_per_host=1)
    
    async with aiohttp.ClientSession(timeout=timeout, headers=headers, connector=connector) as session:
        # First, get the total count with multiple attempts and different sort orders
        print("Getting total item count...")
        first_page = None
        
        # Try different sort orders to get the most comprehensive count
        sort_orders = [
            ("popular", "desc"),
            ("name", "asc"), 
            ("price", "desc"),
            ("quantity", "desc")
        ]
        
        total_count = 0
        for sort_col, sort_dir in sort_orders:
            try:
                # Modify the fetch function temporarily to try different sorts
                url = "https://steamcommunity.com/market/search/render/"
                params = {
                    "appid": RUST_APP_ID,
                    "norender": 1,
                    "start": 0,
                    "count": 1,
                    "sort_column": sort_col,
                    "sort_dir": sort_dir
                }
                
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data and data.get('success') and data.get('total_count', 0) > total_count:
                            total_count = data.get('total_count', 0)
                            first_page = data
                            print(f"Found {total_count} items using sort: {sort_col} {sort_dir}")
                
                await asyncio.sleep(2)  # Brief pause between attempts
                
            except Exception as e:
                print(f"Error trying sort {sort_col} {sort_dir}: {e}")
                continue
        
        if not first_page or total_count == 0:
            print("Failed to get initial page with any sort order")
            return []
        
        actual_target = min(total_count, max_items)
        tracker.set_expected_total(actual_target)
        print(f"Using highest count found: {total_count} items")
        
        all_items = []
        current_start = 0
        consecutive_failures = 0
        empty_results_count = 0
        empty_batches_in_row = 0
        successful_batches = 0
        
        # Rotate user agent occasionally
        ua_rotation_counter = 0
        
        print(f"Starting main fetch loop with limits: consecutive_failures < {MAX_CONSECUTIVE_FAILURES}, empty_results < {MAX_EMPTY_RESULTS}")
        
        while (current_start < actual_target and 
               consecutive_failures < MAX_CONSECUTIVE_FAILURES and 
               empty_results_count < MAX_EMPTY_RESULTS):
            
            # Rotate user agent every 20 requests
            if ua_rotation_counter % 20 == 0:
                session.headers['User-Agent'] = random.choice(USER_AGENTS)
            ua_rotation_counter += 1
            
            # Conservative delay - always wait at least 15 seconds
            if current_start > 0:
                delay = tracker.get_current_delay()
                print(f"Waiting {delay:.1f}s before next request...")
                await asyncio.sleep(delay)
            
            # Fetch page
            page_data = await fetch_marketplace_page(session, current_start, ITEMS_PER_PAGE)
            
            if page_data is None:  # Rate limited or failed
                print(f"Failed to fetch page at offset {current_start}")
                if tracker.consecutive_rate_limits > 0:
                    # If we were rate limited, wait the appropriate time
                    delay = tracker.get_current_delay()
                    print(f"Waiting {delay:.1f}s after rate limit...")
                    await asyncio.sleep(delay)
                consecutive_failures += 1
                empty_results_count += 1
                print(f"Consecutive failures: {consecutive_failures}/{MAX_CONSECUTIVE_FAILURES}, Empty results: {empty_results_count}/{MAX_EMPTY_RESULTS}")
                continue
            
            results = page_data.get('results', [])
            if not results:
                empty_results_count += 1
                empty_batches_in_row += 1
                print(f"Empty results at offset {current_start} (empty batch #{empty_batches_in_row})")
                print(f"Consecutive failures: {consecutive_failures}/{MAX_CONSECUTIVE_FAILURES}, Empty results: {empty_results_count}/{MAX_EMPTY_RESULTS}")
                
                # If we get too many empty batches in a row, try skipping ahead
                if empty_batches_in_row >= MAX_EMPTY_BATCHES_IN_ROW:
                    print(f"Too many empty batches in a row, trying to skip ahead...")
                    current_start += ITEMS_PER_PAGE * 2  # Skip ahead more aggressively
                    empty_batches_in_row = 0
                else:
                    current_start += ITEMS_PER_PAGE
                continue
            
            # Process items in batch
            batch_items = []
            for item in results:
                processed_item = process_item(item)
                if processed_item:
                    batch_items.append(processed_item)
            
            if batch_items:
                all_items.extend(batch_items)
                tracker.record_batch_success(len(batch_items))
                consecutive_failures = 0
                empty_results_count = 0  # Reset empty results count on successful batch
                empty_batches_in_row = 0
                successful_batches += 1
                
                print(f"Batch {successful_batches}: Got {len(batch_items)} items at offset {current_start}")
                
                # Save progress periodically
                if len(all_items) % PARTIAL_SAVE_FREQUENCY == 0:
                    unique_items = remove_duplicates(all_items)
                    save_results(unique_items, is_partial=True)
                    print(f"Progress saved: {len(unique_items)} unique items")
            else:
                print(f"No valid items in batch at offset {current_start}")
                empty_batches_in_row += 1
            
            current_start += ITEMS_PER_PAGE
        
        # If we got poor results, try a fallback approach with different parameters
        if len(all_items) < (actual_target * 0.5):  # If we got less than 50% of expected items
            print(f"\nPoor results detected ({len(all_items)}/{actual_target}). Trying fallback approach...")
            
            # Try different approaches for the remaining items
            fallback_approaches = [
                {"sort_column": "name", "sort_dir": "asc"},
                {"sort_column": "price", "sort_dir": "asc"},
                {"sort_column": "quantity", "sort_dir": "desc"},
            ]
            
            for approach in fallback_approaches:
                print(f"Trying fallback with {approach}")
                
                # Reset counters for fallback attempt
                fallback_start = 0
                fallback_failures = 0
                fallback_items = []
                
                while (fallback_start < actual_target and 
                       fallback_failures < 5 and  # Lower threshold for fallback
                       len(fallback_items) < 1000):  # Limit fallback attempts
                    
                    # Use the approach parameters
                    url = "https://steamcommunity.com/market/search/render/"
                    params = {
                        "appid": RUST_APP_ID,
                        "norender": 1,
                        "start": fallback_start,
                        "count": ITEMS_PER_PAGE,
                        **approach
                    }
                    
                    try:
                        async with session.get(url, params=params) as response:
                            if response.status == 200:
                                data = await response.json()
                                if data and data.get('success'):
                                    results = data.get('results', [])
                                    if results:
                                        batch_items = []
                                        for item in results:
                                            processed_item = process_item(item)
                                            if processed_item:
                                                # Check if we already have this item
                                                item_key = f"{processed_item.get('asset_description', {}).get('classid', '')}_{processed_item.get('asset_description', {}).get('market_hash_name', '')}"
                                                existing_keys = [f"{existing.get('asset_description', {}).get('classid', '')}_{existing.get('asset_description', {}).get('market_hash_name', '')}" for existing in all_items]
                                                if item_key not in existing_keys:
                                                    batch_items.append(processed_item)
                                        
                                        if batch_items:
                                            fallback_items.extend(batch_items)
                                            print(f"Fallback found {len(batch_items)} new items at offset {fallback_start}")
                                        
                                        fallback_failures = 0
                                    else:
                                        fallback_failures += 1
                                else:
                                    fallback_failures += 1
                            else:
                                fallback_failures += 1
                    except Exception as e:
                        print(f"Fallback error at offset {fallback_start}: {e}")
                        fallback_failures += 1
                    
                    fallback_start += ITEMS_PER_PAGE
                    await asyncio.sleep(tracker.get_current_delay())  # Respect rate limits
                    
                if fallback_items:
                    all_items.extend(fallback_items)
                    print(f"Fallback approach {approach} added {len(fallback_items)} new items")
                    
                # Don't continue with other fallback approaches if we got good results
                if len(all_items) >= (actual_target * 0.8):  # If we now have 80%+ of expected items
                    print(f"Good results achieved ({len(all_items)}/{actual_target}), stopping fallback attempts")
                    break
        
        # Print reason for stopping
        if current_start >= actual_target:
            print(f"Completed: Reached target of {actual_target} items")
        elif consecutive_failures >= MAX_CONSECUTIVE_FAILURES:
            print(f"Stopped: Too many consecutive failures ({consecutive_failures}/{MAX_CONSECUTIVE_FAILURES})")
        elif empty_results_count >= MAX_EMPTY_RESULTS:
            print(f"Stopped: Too many empty results ({empty_results_count}/{MAX_EMPTY_RESULTS})")
        
        # Final statistics
        stats = tracker.get_stats()
        print(f"\nFETCH COMPLETED!")
        print(f"Final Results:")
        print(f"   Total items fetched: {len(all_items)}")  # Use actual count instead of tracker
        print(f"   Total available: {stats['total_expected']}")
        print(f"   Success rate: {(len(all_items)/stats['total_expected']*100):.1f}%")
        print(f"   Successful batches: {successful_batches}")
        print(f"   Rate limits hit: {stats['rate_limits']}")
        print(f"   Total time: {stats['elapsed_time']:.1f} seconds")
        print(f"   Average rate: {len(all_items)/stats['elapsed_time']:.1f} items/sec")
        
        # Remove duplicates and return
        unique_items = remove_duplicates(all_items)
        removed_count = len(all_items) - len(unique_items)
        if removed_count > 0:
            print(f"Removed {removed_count} duplicates")
        
        return unique_items

def remove_duplicates(items):
    """Remove duplicate items based on classid and market_hash_name."""
    unique_items = {}
    duplicates_count = 0
    
    for item in items:
        # Create a composite key from classid and market_hash_name
        classid = item.get('asset_description', {}).get('classid', '')
        market_hash_name = item.get('asset_description', {}).get('market_hash_name', '')
        
        key = f"{classid}_{market_hash_name}" if classid and market_hash_name else item.get('name', str(random.random()))
        
        if key not in unique_items:
            unique_items[key] = item
        else:
            duplicates_count += 1
    
    if duplicates_count > 0:
        print(f"Removed {duplicates_count} duplicate items")
        
    return list(unique_items.values())

def save_results(items, is_partial=False):
    """Save results to the skins.json file."""
    current_time = datetime.utcnow()
    
    # For the main output, just save the items array for simplicity
    output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, separators=(',', ':'), ensure_ascii=False)
    
    status = "partial" if is_partial else "complete"
    print(f"Saved {len(items)} items to {output_path} ({status})")

def load_existing_items():
    """Load existing items from skins.json if it exists and check if it's recent enough."""
    output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    
    if not os.path.exists(output_path):
        return [], 0, False
        
    try:
        with open(output_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Handle both old format (with metadata) and new format (just array)
        if isinstance(data, list):
            items = data
        elif isinstance(data, dict) and 'items' in data:
            items = data['items']
        else:
            return [], 0, False
        
        # Check file modification time
        file_mtime = os.path.getmtime(output_path)
        current_time = time.time()
        is_recent = (current_time - file_mtime) < (4 * 3600)  # 4 hours
        
        if is_recent:
            print(f"Found recent data with {len(items)} items")
            return items, len(items), True
        else:
            print(f"Found outdated data with {len(items)} items (older than 4 hours)")
            return [], 0, False
            
    except Exception as e:
        print(f"Error loading existing items: {e}")
        return [], 0, False

def main():
    """Main function to fetch Rust skins and save to file."""
    parser = argparse.ArgumentParser(description='Fetch Rust skins from Steam marketplace')
    parser.add_argument('--no-load-existing', action='store_true', help='Do not load existing items from skins.json')
    parser.add_argument('--clear', action='store_true', help='Clear existing data and start fresh')
    parser.add_argument('--max-items', type=int, default=20000, help='Maximum number of items to fetch (default: 20000)')
    parser.add_argument('--timeout', type=int, default=1800, help='Maximum runtime in seconds (default: 1800 = 30 minutes)')
    args = parser.parse_args()
    
    print("Starting Rust skin fetch process...")
    print(f"Target: ALL available Rust skins (limit: {args.max_items})")
    print(f"Output: {os.path.join(OUTPUT_DIR, OUTPUT_FILE)}")
    print(f"Rate limiting: {MIN_REQUEST_INTERVAL}-{MAX_REQUEST_INTERVAL} seconds between requests")
    print(f"Timeout: {args.timeout} seconds ({args.timeout/60:.1f} minutes)")
    
    if args.clear:
        print("Clearing existing data and starting fresh!")
    
    start_time = time.time()
    
    # Check for existing data
    if not args.no_load_existing and not args.clear:
        existing_items, count, is_recent = load_existing_items()
        if is_recent and existing_items:
            print(f"Using recent cached data with {count} items.")
            print("Use --clear to force refresh.")
            return
    
    # Fetch marketplace items with timeout
    try:
        # Create a timeout wrapper
        async def fetch_with_timeout():
            return await asyncio.wait_for(
                fetch_all_items_optimized(args.max_items),
                timeout=args.timeout
            )
        
        all_items = asyncio.run(fetch_with_timeout())
        
    except asyncio.TimeoutError:
        print(f"\nTimeout reached after {args.timeout} seconds!")
        print("Attempting to save any items that were fetched...")
        
        # Try to load any partial results that might have been saved
        try:
            output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
            if os.path.exists(output_path):
                with open(output_path, 'r', encoding='utf-8') as f:
                    partial_data = json.load(f)
                if isinstance(partial_data, list) and partial_data:
                    print(f"Found {len(partial_data)} items in partial save file")
                    all_items = partial_data
                else:
                    all_items = []
            else:
                all_items = []
        except Exception as e:
            print(f"Could not load partial results: {e}")
            all_items = []
            
    except KeyboardInterrupt:
        print("\nProcess interrupted by user.")
        return
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        # Try to save any partial results
        try:
            output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
            if os.path.exists(output_path):
                with open(output_path, 'r', encoding='utf-8') as f:
                    partial_data = json.load(f)
                if isinstance(partial_data, list) and partial_data:
                    all_items = partial_data
                else:
                    all_items = []
            else:
                all_items = []
        except:
            all_items = []
    
    if not all_items:
        print("No items fetched. Exiting.")
        return
    
    # Save final results
    save_results(all_items, is_partial=False)
    
    elapsed_time = time.time() - start_time
    print(f"\nCOMPLETED in {elapsed_time:.1f} seconds ({elapsed_time/60:.1f} minutes)")
    print(f"Total unique items saved: {len(all_items)}")
    print(f"Data saved to: {os.path.join(OUTPUT_DIR, OUTPUT_FILE)}")

if __name__ == "__main__":
    main() 