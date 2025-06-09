import os
import requests
import json
import time
import logging
import sys
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional, List, Set, Tuple

# Configuration
BASE_URL = 'https://scmm.app/api'
RUST_APP_ID = 252490
COUNT = 1000  # Use 1000 items per page - API supports up to 5000
DELAY = 1.0
OUTPUT_DIR = os.path.join('docs', 'public', 'data')
SCMM_FILE = 'scmm.json'
SCMM_PATH = os.path.join(OUTPUT_DIR, SCMM_FILE)
MERGED_FILE = 'merged_skins.json'
MERGED_PATH = os.path.join(OUTPUT_DIR, MERGED_FILE)
MAX_RETRIES = 5

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

#
# SCMM SCRIPT FUNCTIONALITY
#

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

def fetch_scmm_data():
    """Fetch new Rust skins using SCMM API and save to JSON file."""
    # Load existing skins
    try:
        with open(SCMM_PATH, 'r', encoding='utf-8') as f:
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
        return None
    
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
                with open(SCMM_PATH, 'w', encoding='utf-8') as f:
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
    logger.info(f"All SCMM data has been saved to {SCMM_PATH}")
    return all_items

#
# ADDITIONAL FUNCTIONALITY - FETCH EXPORTER DATA FROM API
#

def fetch_exporter_data(api_url: str) -> Tuple[Dict, str]:
    """
    Fetch exporter data from specified API URL and save it to the output directory.
    Returns the loaded JSON data and the path to the saved file.
    """
    logger.info(f"Fetching exporter data from: {api_url}")
    
    # Generate the output filename based on current date
    current_date = datetime.now().strftime('%Y-%m-%d')
    exporter_filename = f"exporter_skins-{current_date}.json"
    exporter_path = os.path.join(OUTPUT_DIR, exporter_filename)
    
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(api_url)
            if response.status_code == 200:
                # Save the downloaded file
                with open(exporter_path, 'wb') as f:
                    f.write(response.content)
                
                logger.info(f"Successfully saved exporter data to {exporter_path}")
                
                # Try to load the saved file to verify it's valid JSON
                try:
                    with open(exporter_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    logger.info(f"Successfully loaded exporter data from {exporter_path}")
                    return data, exporter_path
                except json.JSONDecodeError:
                    logger.error(f"Downloaded file is not valid JSON, trying to parse with different encoding")
                    # Try different encodings
                    data = load_json_file(exporter_path)
                    if data:
                        return data, exporter_path
                    else:
                        raise ValueError(f"Could not parse downloaded file as JSON")
            else:
                logger.warning(f"Failed to fetch exporter data: HTTP {response.status_code}")
                time.sleep(5)
        except Exception as e:
            logger.error(f"Error fetching exporter data: {e}")
            time.sleep(5)
    
    logger.error("Failed to fetch exporter data after retries")
    return None, None

#
# MERGE SKINS FUNCTIONALITY
#

def load_json_file(file_path):
    """Load and return JSON data from file."""
    # Try different encodings to handle BOM issues
    encodings = ['utf-8-sig', 'utf-8', 'utf-16']
    
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return json.load(f)
        except UnicodeDecodeError:
            continue
        except Exception as e:
            if encoding == encodings[-1]:  # Last encoding attempt
                logger.error(f"Error loading {file_path}: {e}")
                return None
            continue
    
    logger.error(f"Failed to load {file_path} with any encoding")
    return None

def merge_skin_data(exporter_data, scmm_data):
    """Merge data from both sources and extract required fields."""
    merged_skins = []
    
    # Create a lookup dictionary from scmm data using name as key
    scmm_lookup_by_name = {}
    scmm_lookup_by_classid = {}
    
    # scmm_data is always an array format
    items_list = []
    if isinstance(scmm_data, list):
        items_list = scmm_data
        logger.info("Detected scmm data as array format")
    else:
        logger.warning("Warning: Unknown scmm data format, expected array")
        return merged_skins
    
    for item in items_list:
        asset_desc = item.get('asset_description', {})
        classid = asset_desc.get('classid')
        name = item.get('name', '').strip()
        
        # Store by name for name-based matching
        if name:
            scmm_lookup_by_name[name] = {
                'name': name,
                'sell_price': item.get('sell_price', 0),
                'sell_price_text': item.get('sell_price_text', ''),
                'icon_url': asset_desc.get('icon_url', ''),
                'classid': classid
            }
        
        # Store by classid for direct ID matching (only if classid is not "0")
        if classid and classid != "0":
            scmm_lookup_by_classid[classid] = {
                'name': name,
                'sell_price': item.get('sell_price', 0),
                'sell_price_text': item.get('sell_price_text', ''),
                'icon_url': asset_desc.get('icon_url', ''),
                'classid': classid
            }
    
    logger.info(f"Loaded {len(scmm_lookup_by_name)} skins from SCMM data (by name)")
    logger.info(f"Loaded {len(scmm_lookup_by_classid)} skins from SCMM data (by classid, excluding non-tradeable)")
    
    # Process exporter_skins data
    if exporter_data and 'Items' in exporter_data:
        for item in exporter_data['Items']:
            item_name = item.get('ItemDisplayName', '')
            skins = item.get('Skins', [])
            
            for skin in skins:
                skin_id = skin.get('SkinId')
                skin_name = skin.get('SkinName', '').strip()
                skin_type = skin.get('SkinType', '')
                
                if skin_id:
                    # Try matching by SkinId first
                    skin_id_str = str(skin_id)
                    skin_market_data = scmm_lookup_by_classid.get(skin_id_str, {})
                    
                    # If no direct match, try matching by name
                    if not skin_market_data and skin_name:
                        skin_market_data = scmm_lookup_by_name.get(skin_name, {})
                    
                    found_in_market = bool(skin_market_data)
                    
                    # Determine the skin type for display
                    display_skin_type = skin_type
                    
                    # Check if this should be labeled as Twitch Drop
                    # Look for items in scmm.json that have this name and sell_price = 0
                    scmm_item_by_name = scmm_lookup_by_name.get(skin_name, {})
                    if scmm_item_by_name and scmm_item_by_name.get('sell_price', 0) == 0:
                        # Additional check: if it's already "Workshop" and has zero price, it's likely a Twitch Drop
                        if skin_type == "Workshop":
                            display_skin_type = "Twitch Drop"
                    
                    merged_skin = {
                        'skinId': skin_id,
                        'skinType': display_skin_type,
                        'skinName': skin_name,
                        'iconUrl': skin_market_data.get('icon_url', ''),
                        'sellingPrice': skin_market_data.get('sell_price', 0),
                        'sellingPriceText': skin_market_data.get('sell_price_text', ''),
                        'itemName': item_name,
                        'foundInMarket': found_in_market,
                        'matchedBy': 'classid' if (skin_id_str in scmm_lookup_by_classid) else ('name' if (skin_name in scmm_lookup_by_name) else 'none'),
                        'marketClassId': skin_market_data.get('classid', '')
                    }
                    
                    merged_skins.append(merged_skin)
    
    return merged_skins

def save_merged_data(merged_skins, exporter_file, scmm_file):
    """Save merged skin data to output file with metadata."""
    # Create summary statistics
    total_skins = len(merged_skins)
    skins_with_market_data = sum(1 for skin in merged_skins if skin['foundInMarket'])
    skins_with_price = sum(1 for skin in merged_skins if skin['sellingPrice'] > 0)
    twitch_drops = sum(1 for skin in merged_skins if skin['skinType'] == 'Twitch Drop')
    
    logger.info(f"\nMerge Summary:")
    logger.info(f"Total skins processed: {total_skins}")
    logger.info(f"Skins found in market data: {skins_with_market_data}")
    logger.info(f"Skins with pricing data: {skins_with_price}")
    logger.info(f"Twitch Drop skins identified: {twitch_drops}")
    coverage_percentage = round(skins_with_market_data/total_skins*100, 2) if total_skins > 0 else 0
    logger.info(f"Coverage: {coverage_percentage}%")
    
    # Create output data structure
    output_data = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_skins': total_skins,
            'skins_with_market_data': skins_with_market_data,
            'skins_with_price': skins_with_price,
            'twitch_drops_identified': twitch_drops,
            'coverage_percentage': coverage_percentage,
            'source_files': [
                str(exporter_file),
                str(scmm_file)
            ]
        },
        'skins': merged_skins
    }
    
    # Save merged data
    logger.info(f"\nSaving merged data to {MERGED_PATH}...")
    try:
        with open(MERGED_PATH, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        logger.info(f"Successfully saved {total_skins} skins to {MERGED_PATH}")
    except Exception as e:
        logger.error(f"Error saving file: {e}")
        return False
    
    # Show some examples
    if skins_with_market_data > 0:
        logger.info(f"\nFirst 5 skins with market data:")
        examples = [skin for skin in merged_skins if skin['foundInMarket']][:5]
        for skin in examples:
            logger.info(f"  - {skin['skinName']} (ID: {skin['skinId']}) - {skin['sellingPriceText']}")
    
    if twitch_drops > 0:
        logger.info(f"\nFirst 5 Twitch Drop skins identified:")
        twitch_examples = [skin for skin in merged_skins if skin['skinType'] == 'Twitch Drop'][:5]
        for skin in twitch_examples:
            logger.info(f"  - {skin['skinName']} (ID: {skin['skinId']}) - {skin['itemName']}")
    
    return True

def main():
    """Main function to process skins data from SCMM and exporter API."""
    parser = argparse.ArgumentParser(description='Process Rust skins data from SCMM and exporter API')
    parser.add_argument('--api-url', type=str, required=True, 
                        help='URL to fetch exporter data from (e.g., http://192.168.1.100/exporter.json)')
    parser.add_argument('--skip-scmm', action='store_true',
                        help='Skip fetching from SCMM API and use existing file')
    args = parser.parse_args()
    
    # Step 1: Fetch SCMM data
    if args.skip_scmm:
        logger.info("Skipping SCMM data fetch, using existing file")
        scmm_data = load_json_file(SCMM_PATH)
        if not scmm_data:
            logger.error(f"Failed to load existing SCMM data from {SCMM_PATH}")
            sys.exit(1)
    else:
        logger.info("Fetching SCMM data...")
        scmm_data = fetch_scmm_data()
        if not scmm_data:
            logger.error("Failed to fetch SCMM data")
            sys.exit(1)
    
    # Step 2: Fetch exporter data from API and save it
    logger.info(f"Fetching exporter data from API: {args.api_url}")
    exporter_data, exporter_file_path = fetch_exporter_data(args.api_url)
    if not exporter_data or not exporter_file_path:
        logger.error("Failed to fetch or save exporter data from API")
        sys.exit(1)
    
    # Step 3: Merge the data
    logger.info("Merging skin data...")
    merged_skins = merge_skin_data(exporter_data, scmm_data)
    
    # Step 4: Save merged data
    success = save_merged_data(merged_skins, exporter_file_path, SCMM_PATH)
    
    if success:
        logger.info("Process completed successfully!")
    else:
        logger.error("Process completed with errors")
        sys.exit(1)

if __name__ == "__main__":
    main() 