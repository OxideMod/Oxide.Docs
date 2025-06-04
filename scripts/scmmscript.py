import os
import requests
import json
import time
import logging
from typing import Dict, Optional, List, Set, Tuple

# Configuration
BASE_URL = 'https://scmm.app/api'
RUST_APP_ID = 252490
COUNT = 1000  # Use 1000 items per page - API supports up to 5000
DELAY = 1.0
OUTPUT_DIR = os.path.join('..', 'docs', 'public', 'data')
OUTPUT_FILE = 'scmm.json'
OUTPUT_PATH = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
MAX_RETRIES = 5

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def fix_icon_url(icon_url: str) -> str:
    """Fix the icon URL to ensure it has the correct prefix."""
    if not icon_url:
        return ""
    if icon_url.startswith('http://') or icon_url.startswith('https://'):
        return icon_url
    return f"https://community.cloudflare.steamstatic.com/economy/image/{icon_url}"

def fetch_prices(app_id: int) -> Dict[str, Tuple[int, int]]:
    """Fetch item prices and listings count from SCMM API."""
    url = f'{BASE_URL}/item/prices?appId={app_id}'
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                logger.debug(f"Prices API response sample: {data[:2] if data else 'Empty'}")
                prices = {}
                for item in data:
                    name = item.get('name', '')
                    price = item.get('price', 0)
                    supply = item.get('supply', 0)
                    prices[name] = (price, supply)
                logger.info(f"Fetched {len(prices)} item prices")
                return prices
            else:
                logger.warning(f"Failed to fetch prices: HTTP {response.status_code}")
                time.sleep(5)
        except Exception as e:
            logger.error(f"Error fetching prices: {e}")
            time.sleep(5)
    logger.error("Failed to fetch prices after retries")
    return {}

def fetch_items_page(app_id: int, page: int, size: int) -> Tuple[List[Dict], int]:
    """Fetch a page of items from SCMM API."""
    # Use offset-based pagination with correct 'count' parameter
    start = (page - 1) * size
    params = {
        'appId': app_id, 
        'start': start,
        'count': size  # Use 'count' instead of 'size' per API docs
    }
    url = f'{BASE_URL}/item'
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                items = data.get('items', [])
                total = data.get('total', 0)
                logger.debug(f"Items API response structure: {list(data.keys()) if data else 'Empty'}")
                if items:
                    logger.debug(f"Sample item structure: {list(items[0].keys()) if items[0] else 'Empty item'}")
                    # Log first few item names to check if they're different across pages
                    item_names = [item.get('name', 'NO_NAME') for item in items[:3]]
                    logger.debug(f"First 3 items on page {page} (start={start}): {item_names}")
                logger.debug(f"Fetched page {page}: {len(items)} items, total: {total}")
                return items, total
            else:
                logger.warning(f"Failed to fetch page {page}: HTTP {response.status_code}")
                time.sleep(5)
        except Exception as e:
            logger.error(f"Error fetching page {page}: {e}")
            time.sleep(5)
    logger.error(f"Failed to fetch page {page} after retries")
    return [], 0

def process_item(item: Dict, existing_skins: Set[str], prices: Dict[str, Tuple[int, int]]) -> Optional[Dict]:
    """Process an item to extract and format required fields if it's new."""
    name = item.get('name', '')
    if not name:
        logger.debug(f"Item skipped - no name: {list(item.keys())}")
        return None
    if name in existing_skins:
        logger.debug(f"Item skipped - already exists: {name}")
        return None
    
    # Add debug logging to see what items we're processing
    logger.debug(f"Processing new item: {name}")
    existing_skins.add(name)
    
    sell_price, sell_listings = prices.get(name, (0, 0))
    logger.debug(f"Item details - name: {name}, price: {sell_price}, supply: {sell_listings}")
    
    asset_desc = {
        'market_hash_name': name,
        'type': item.get('itemType', ''),
        'icon_url': item.get('iconUrl', ''),
        'classid': str(item.get('id', '')),
        'instanceid': '0',
        'appid': item.get('appId', RUST_APP_ID),
        'commodity': 0,
        'currency': 0,
        'background_color': item.get('backgroundColour', '').replace('#', ''),
        'tradable': 1,
        'marketable': 1
    }
    
    return {
        'name': name,
        'sell_price': sell_price,
        'sell_price_text': f"${sell_price / 100:.2f}",
        'app_name': 'Rust',
        'sell_listings': sell_listings,
        'asset_description': asset_desc
    }

def main():
    """Fetch new Rust skins using SCMM API and append to JSON file."""
    # Load existing skins
    try:
        with open(OUTPUT_PATH, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
        existing_skins = {item['asset_description']['market_hash_name'] for item in existing_data}
    except (FileNotFoundError, json.JSONDecodeError):
        existing_data = []
        existing_skins = set()
        logger.info("No existing data found or file is corrupted, starting fresh")
    
    logger.info(f"Existing skins: {len(existing_data)}")
    
    # Fetch prices
    prices = fetch_prices(RUST_APP_ID)
    if not prices:
        logger.error("Could not fetch prices. Aborting.")
        return
    
    # Fetch new items and write incrementally
    page = 1
    all_items = existing_data.copy()  # Start with existing data
    total_new_items = 0
    consecutive_empty_pages = 0  # Track consecutive pages with no new items
    max_empty_pages = 5  # Stop after 5 consecutive pages with no new items
    
    while True:
        try:
            items, total = fetch_items_page(RUST_APP_ID, page, COUNT)
            if not items:
                logger.info(f"No more items at page {page}")
                break
            
            logger.info(f"Page {page}: Received {len(items)} items from API (Total available: {total})")
            
            new_in_page = []
            for i, item in enumerate(items):
                processed = process_item(item, existing_skins, prices)
                if processed:
                    new_in_page.append(processed)
                elif i < 3:  # Log first few items for debugging
                    item_name = item.get('name', 'NO_NAME')
                    logger.debug(f"Item {i+1} skipped: '{item_name}' (already exists: {item_name in existing_skins})")
            
            # Add new items to the collection
            all_items.extend(new_in_page)
            total_new_items += len(new_in_page)
            
            # Write to file after each page (incremental save)
            if new_in_page:  # Only write if we have new items
                with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
                    json.dump(all_items, f, indent=4)
                logger.info(f"Saved {len(new_in_page)} new items to file (Total: {len(all_items)})")
                consecutive_empty_pages = 0  # Reset counter
            else:
                consecutive_empty_pages += 1
                logger.info(f"No new items on page {page} (consecutive empty: {consecutive_empty_pages})")
            
            logger.info(f"Fetched page {page}, new items: {len(new_in_page)}")
            
            # Stop if we've reached the total or hit too many empty pages
            if page * COUNT >= total:
                logger.info(f"Reached end of available items (page {page} * {COUNT} >= {total})")
                break
                
            if consecutive_empty_pages >= max_empty_pages:
                logger.info(f"Stopping after {consecutive_empty_pages} consecutive pages with no new items")
                break
                
            page += 1
            time.sleep(DELAY)
            
        except Exception as e:
            logger.error(f"Error on page {page}: {e}")
            logger.info("Waiting 10 seconds before retrying...")
            time.sleep(10)
            continue  # Try the same page again
    
    logger.info(f"Added {total_new_items} new items. Total items: {len(all_items)}")
    logger.info("All data has been saved to scmm.json")

if __name__ == "__main__":
    main()