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
# The API key MUST be set as an environment variable: STEAM_API_KEY
STEAM_API_KEY = os.environ.get('STEAM_API_KEY')
if not STEAM_API_KEY:
    print("Error: STEAM_API_KEY environment variable not set.")
    exit(1)

OUTPUT_DIR = 'docs/public/data' # Changed to output directly to VitePress public assets
OUTPUT_FILE = 'skins.json'
ITEMS_PER_PAGE = 100
MAX_RETRIES = 3  # Reduced for faster processing
INITIAL_RETRY_DELAY = 2  # Reduced delay
MAX_RETRY_DELAY = 30  # Reduced max delay
# More aggressive rate limiting for speed
MIN_REQUEST_INTERVAL = 0.5  # Much faster requests
MAX_REQUEST_INTERVAL = 1.5  # Much faster requests
PARTIAL_SAVE_FREQUENCY = 500  # Save less frequently
MAX_CONCURRENT_REQUESTS = 5  # Concurrent requests for speed

# Filter for recent items (items from last 90 days)
RECENT_DAYS_FILTER = 90

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Thread-safe counter for progress tracking
class ProgressTracker:
    def __init__(self):
        self.lock = threading.Lock()
        self.processed = 0
        self.total = 0
        
    def set_total(self, total):
        with self.lock:
            self.total = total
            
    def increment(self):
        with self.lock:
            self.processed += 1
            if self.processed % 100 == 0:
                print(f"Progress: {self.processed}/{self.total} ({self.processed/self.total*100:.1f}%)")

tracker = ProgressTracker()

def fix_icon_url(icon_url):
    """Convert icon_url to the correct CloudFlare format if not already a full URL."""
    if not icon_url:
        return ""
    if icon_url.startswith('http://') or icon_url.startswith('https://'):
        return icon_url
    return f"https://community.cloudflare.steamstatic.com/economy/image/{icon_url}"

def is_recent_item(item):
    """Check if item should be included - now much more inclusive."""
    try:
        # Include ALL items with any price data
        sell_price = item.get('sell_price', 0)
        if sell_price and sell_price > 0:
            return True
        
        # Include items even without price if they have proper Steam market data
        if 'asset_description' in item:
            asset_desc = item['asset_description']
            if asset_desc.get('market_hash_name') or asset_desc.get('classid'):
                return True
        
        # Include items with names (basically all legitimate items)
        name = item.get('name', '')
        if name and len(name.strip()) > 0:
            return True
            
        return False  # Only exclude items with no useful data
    except:
        return True  # Include if we can't determine - better safe than sorry

def process_item(item):
    """Process an item to fix icon URLs and keep all relevant data."""
    # Use more inclusive filtering - we want ALL skins
    if not is_recent_item(item):
        return None
        
    # Fix icon URL
    if 'asset_description' in item and 'icon_url' in item['asset_description']:
        item['asset_description']['icon_url'] = fix_icon_url(item['asset_description']['icon_url'])
    
    # Keep more fields but still optimize structure
    processed_item = {
        'name': item.get('name', ''),
        'sell_price': item.get('sell_price', 0),
        'sell_price_text': item.get('sell_price_text', ''),
        'app_name': item.get('app_name', ''),
        'sell_listings': item.get('sell_listings', 0),  # Keep listings count
        'asset_description': {}
    }
    
    # Keep all essential asset description fields
    if 'asset_description' in item:
        asset_desc = item['asset_description']
        processed_item['asset_description'] = {
            'market_hash_name': asset_desc.get('market_hash_name', ''),
            'type': asset_desc.get('type', ''),
            'icon_url': asset_desc.get('icon_url', ''),
            'classid': asset_desc.get('classid', ''),
            'instanceid': asset_desc.get('instanceid', ''),  # Keep instance ID
            'appid': asset_desc.get('appid', RUST_APP_ID),
            'commodity': asset_desc.get('commodity', 0),
            'currency': asset_desc.get('currency', 0),
            'background_color': asset_desc.get('background_color', ''),  # Keep rarity color
            'tradable': asset_desc.get('tradable', 1),
            'marketable': asset_desc.get('marketable', 1)
        }
    
    return processed_item

async def fetch_marketplace_items_async(session, start=0, count=ITEMS_PER_PAGE):
    """Async version of fetch_marketplace_items for better performance."""
    url = "https://steamcommunity.com/market/search/render/"
    params = {
        "appid": RUST_APP_ID,
        "norender": 1,
        "start": start,
        "count": count,
        "sort_column": "popular",  # Get popular items first
        "sort_dir": "desc"
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            async with session.get(url, params=params) as response:
                if response.status == 429:  # Rate limited
                    wait_time = min(MAX_RETRY_DELAY, (2 ** attempt) + random.uniform(0, 1))
                    await asyncio.sleep(wait_time)
                    continue
                    
                response.raise_for_status()
                data = await response.json()
                
                # Process items and filter out unwanted ones
                if data and data.get('success') and 'results' in data:
                    processed_results = []
                    for item in data['results']:
                        processed_item = process_item(item)
                        if processed_item:  # Only add if item passed filtering
                            processed_results.append(processed_item)
                    
                    data['results'] = processed_results
                    tracker.increment()
                    
                return data
                
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait_time = min(MAX_RETRY_DELAY, (2 ** attempt) + random.uniform(0, 1))
                await asyncio.sleep(wait_time)
            else:
                print(f"Failed to fetch items at offset {start} after {MAX_RETRIES} attempts: {e}")
                return None

def fetch_marketplace_items(start=0, count=ITEMS_PER_PAGE):
    """Synchronous wrapper for backward compatibility."""
    url = f"https://steamcommunity.com/market/search/render/"
    params = {
        "appid": RUST_APP_ID,
        "norender": 1,
        "start": start,
        "count": count,
        "sort_column": "popular",  # Get popular items first
        "sort_dir": "desc"
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url, params=params, timeout=30)
            if response.status_code == 429:
                wait_time = min(MAX_RETRY_DELAY, (2 ** attempt) + random.uniform(0, 1))
                time.sleep(wait_time)
                continue
                
            response.raise_for_status()
            data = response.json()
            
            # Process items and filter
            if data and data.get('success') and 'results' in data:
                processed_results = []
                for item in data['results']:
                    processed_item = process_item(item)
                    if processed_item:
                        processed_results.append(processed_item)
                
                data['results'] = processed_results
                
            return data
            
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait_time = min(MAX_RETRY_DELAY, (2 ** attempt) + random.uniform(0, 1))
                time.sleep(wait_time)
            else:
                print(f"Failed to fetch items at offset {start}: {e}")
                return None

def save_results(items, is_partial=False):
    """Save results to the skins.json file."""
    # Add last_updated timestamp to metadata
    current_time = datetime.utcnow()
    
    data = {
        "metadata": {
            "timestamp": current_time.isoformat(),
            "last_updated": int(current_time.timestamp()),  # Unix timestamp for easier consumption
            "app_id": RUST_APP_ID,
            "app_name": "Rust",
            "total_items": len(items),
            "is_partial": is_partial,
            "description": "All available Rust skins from Steam Community Market",
            "includes": "All tradeable Rust items including skins, clothing, weapons, and deployables"
        },
        "items": items
    }
    
    output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, separators=(',', ':'))  # Compact JSON for smaller file size
    
    status = "partial" if is_partial else "complete"
    print(f"Saved {len(items)} items to {output_path} ({status} results)")

def load_existing_items():
    """Load existing items from skins.json if it exists and check if it's recent enough."""
    output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    
    if not os.path.exists(output_path):
        return [], 0, False
        
    try:
        with open(output_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        items = data.get('items', [])
        last_updated = data.get('metadata', {}).get('last_updated', 0)
        
        # Check if data is recent (less than 6 hours old)
        current_time = datetime.utcnow().timestamp()
        is_recent = (current_time - last_updated) < (6 * 3600)  # 6 hours
        
        if is_recent:
            print(f"Found recent data with {len(items)} items (last updated: {datetime.fromtimestamp(last_updated)})")
            return items, 0, True
        else:
            print(f"Existing data is outdated (last updated: {datetime.fromtimestamp(last_updated)})")
            return [], 0, False
            
    except Exception as e:
        print(f"Error loading existing items: {e}")
        return [], 0, False

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

async def fetch_all_marketplace_items_async(max_items=15000):  # Increased to get ALL skins
    """Async version to fetch marketplace items much faster."""
    print("Fetching ALL marketplace items asynchronously...")
    
    # Get total count first
    first_page = fetch_marketplace_items(0, 1)
    if not first_page or not first_page.get('success'):
        print("Failed to fetch first page.")
        return []
    
    total_count = first_page.get('total_count', 0)
    actual_fetch_count = min(total_count, max_items)  # Don't exceed what's available
    
    tracker.set_total(actual_fetch_count)
    print(f"Found {total_count} total items on Steam Market")
    print(f"Fetching {actual_fetch_count} items for complete coverage...")
    
    all_items = []
    
    # Create semaphore to limit concurrent requests (keep this for stability)
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)
    
    async def fetch_with_semaphore(session, start):
        async with semaphore:
            await asyncio.sleep(random.uniform(0.1, 0.5))  # Small random delay
            return await fetch_marketplace_items_async(session, start, ITEMS_PER_PAGE)
    
    # Create async session
    timeout = aiohttp.ClientTimeout(total=60)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        # Create tasks for all pages
        tasks = []
        for start in range(0, actual_fetch_count, ITEMS_PER_PAGE):
            task = fetch_with_semaphore(session, start)
            tasks.append(task)
        
        # Execute tasks in batches to avoid overwhelming the server
        batch_size = MAX_CONCURRENT_REQUESTS
        for i in range(0, len(tasks), batch_size):
            batch = tasks[i:i + batch_size]
            results = await asyncio.gather(*batch, return_exceptions=True)
            
            for result in results:
                if isinstance(result, dict) and result.get('success'):
                    all_items.extend(result.get('results', []))
                elif isinstance(result, Exception):
                    print(f"Error in batch {i//batch_size + 1}: {result}")
            
            # Progress update
            completed_batches = (i // batch_size) + 1
            total_batches = (len(tasks) + batch_size - 1) // batch_size
            print(f"Completed batch {completed_batches}/{total_batches} - {len(all_items)} items so far")
            
            # Small delay between batches
            if i + batch_size < len(tasks):
                await asyncio.sleep(random.uniform(1, 2))
    
    # Remove duplicates
    all_items = remove_duplicates(all_items)
    
    print(f"Successfully fetched {len(all_items)} unique items out of {total_count} total items.")
    return all_items

def fetch_all_marketplace_items(start_offset=0, load_existing=True, clear_existing=False, max_items=15000):  # Increased default
    """Fetch marketplace items with option for fast async processing."""
    if load_existing and not clear_existing:
        existing_items, _, is_recent = load_existing_items()
        if is_recent and existing_items:
            print(f"Using recent cached data with {len(existing_items)} items.")
            print("Use --clear to force refresh and get latest items.")
            return existing_items
    
    # Use async version for much better performance
    try:
        return asyncio.run(fetch_all_marketplace_items_async(max_items))
    except Exception as e:
        print(f"Async fetch failed, falling back to synchronous: {e}")
        
        # Fallback to synchronous version
        all_items = []
        print(f"Fetching up to {max_items} items synchronously...")
        
        # Get total count for progress tracking
        first_page = fetch_marketplace_items(0, 1)
        total_count = first_page.get('total_count', 0) if first_page else max_items
        actual_fetch_count = min(total_count, max_items)
        
        for start in range(0, actual_fetch_count, ITEMS_PER_PAGE):
            progress = (start / actual_fetch_count) * 100
            print(f"Fetching items {start} to {start + ITEMS_PER_PAGE - 1}... ({progress:.1f}%)")
            
            page_data = fetch_marketplace_items(start, ITEMS_PER_PAGE)
            
            if page_data and page_data.get('success'):
                all_items.extend(page_data.get('results', []))
                
                # Save progress periodically
                if start % PARTIAL_SAVE_FREQUENCY == 0 and all_items:
                    save_results(remove_duplicates(all_items), is_partial=True)
            else:
                print(f"Failed to fetch page at offset {start}")
            
            # Small delay to avoid rate limiting
            time.sleep(random.uniform(MIN_REQUEST_INTERVAL, MAX_REQUEST_INTERVAL))
        
        return remove_duplicates(all_items)

def main():
    """Main function to fetch Rust skins and save to file."""
    parser = argparse.ArgumentParser(description='Fetch Rust skins from Steam marketplace')
    parser.add_argument('--start', type=int, default=0, help='Starting offset for fetching items (default: 0)')
    parser.add_argument('--no-load-existing', action='store_true', help='Do not load existing items from skins.json')
    parser.add_argument('--clear', action='store_true', help='Clear existing data and start fresh')
    parser.add_argument('--max-items', type=int, default=15000, help='Maximum number of items to fetch (default: 15000 for all skins)')
    args = parser.parse_args()
    
    print("Starting comprehensive Rust skin fetch process...")
    print(f"Target: ALL available Rust skins (up to {args.max_items} items)")
    print(f"Output file: {os.path.join(OUTPUT_DIR, OUTPUT_FILE)}")
    
    if args.clear:
        print("Clearing existing data and starting fresh!")
    
    start_time = time.time()
    
    # Fetch marketplace items
    try:
        all_items = fetch_all_marketplace_items(
            start_offset=args.start,
            load_existing=not args.no_load_existing,
            clear_existing=args.clear,
            max_items=args.max_items
        )
    except KeyboardInterrupt:
        print("\nProcess interrupted by user.")
        return
    
    if not all_items:
        print("No items fetched. Exiting.")
        return
    
    # Save final results
    save_results(all_items, is_partial=False)
    
    elapsed_time = time.time() - start_time
    print(f"\nCompleted in {elapsed_time:.2f} seconds")
    print(f"Total unique items saved: {len(all_items)}")
    print(f"Data saved to: {os.path.join(OUTPUT_DIR, OUTPUT_FILE)}")

if __name__ == "__main__":
    main() 