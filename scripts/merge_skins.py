import json
import sys
import argparse
from pathlib import Path
from datetime import datetime

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
                print(f"Error loading {file_path}: {e}")
                return None
            continue
    
    print(f"Failed to load {file_path} with any encoding")
    return None

def merge_skin_data(exporter_data, skins_data):
    """Merge data from both files and extract required fields."""
    merged_skins = []
    
    # Create a lookup dictionary from skins.json using name as key
    skins_lookup_by_name = {}
    skins_lookup_by_classid = {}
    
    # Handle both formats: array directly or object with 'items' key
    items_list = []
    if isinstance(skins_data, list):
        items_list = skins_data
        print("Detected skins.json as array format")
    elif isinstance(skins_data, dict) and 'items' in skins_data:
        items_list = skins_data['items']
        print("Detected skins.json as object format with 'items' key")
    else:
        print("Warning: Unknown skins.json format")
        return merged_skins
    
    for item in items_list:
        asset_desc = item.get('asset_description', {})
        classid = asset_desc.get('classid')
        name = item.get('name', '').strip()
        
        # Store by name for name-based matching
        if name:
            skins_lookup_by_name[name] = {
                'name': name,
                'sell_price': item.get('sell_price', 0),
                'sell_price_text': item.get('sell_price_text', ''),
                'icon_url': asset_desc.get('icon_url', ''),
                'classid': classid
            }
        
        # Store by classid for direct ID matching
        if classid:
            skins_lookup_by_classid[classid] = {
                'name': name,
                'sell_price': item.get('sell_price', 0),
                'sell_price_text': item.get('sell_price_text', ''),
                'icon_url': asset_desc.get('icon_url', ''),
                'classid': classid
            }
    
    print(f"Loaded {len(skins_lookup_by_name)} skins from market data (by name)")
    print(f"Loaded {len(skins_lookup_by_classid)} skins from market data (by classid)")
    
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
                    skin_market_data = skins_lookup_by_classid.get(skin_id_str, {})
                    
                    # If no direct match, try matching by name
                    if not skin_market_data and skin_name:
                        skin_market_data = skins_lookup_by_name.get(skin_name, {})
                    
                    found_in_market = bool(skin_market_data)
                    
                    merged_skin = {
                        'skinId': skin_id,
                        'skinType': skin_type,
                        'skinName': skin_name,
                        'iconUrl': skin_market_data.get('icon_url', ''),
                        'sellingPrice': skin_market_data.get('sell_price', 0),
                        'sellingPriceText': skin_market_data.get('sell_price_text', ''),
                        'itemName': item_name,
                        'foundInMarket': found_in_market,
                        'matchedBy': 'classid' if (skin_id_str in skins_lookup_by_classid) else ('name' if (skin_name in skins_lookup_by_name) else 'none'),
                        'marketClassId': skin_market_data.get('classid', '')
                    }
                    
                    merged_skins.append(merged_skin)
    
    return merged_skins

def main():
    parser = argparse.ArgumentParser(description='Merge exporter skins with Steam Market data')
    parser.add_argument('--date', type=str, help='Date for the exporter file (YYYY-MM-DD format)', 
                        default=datetime.now().strftime('%Y-%m-%d'))
    parser.add_argument('--exporter-file', type=str, help='Path to exporter skins file')
    parser.add_argument('--skins-file', type=str, help='Path to skins.json file', 
                        default='docs/public/data/skins.json')
    parser.add_argument('--output-file', type=str, help='Path to output merged file',
                        default='docs/public/data/merged_skins.json')
    
    args = parser.parse_args()
    
    # Determine exporter file path
    if args.exporter_file:
        exporter_file = Path(args.exporter_file)
    else:
        exporter_file = Path(f'docs/public/data/exporter_skins-{args.date}.json')
    
    skins_file = Path(args.skins_file)
    output_file = Path(args.output_file)
    
    print(f"Using exporter file: {exporter_file}")
    print(f"Using skins file: {skins_file}")
    print(f"Output file: {output_file}")
    
    # Check if files exist
    if not exporter_file.exists():
        print(f"Error: Exporter file {exporter_file} does not exist")
        sys.exit(1)
    
    if not skins_file.exists():
        print(f"Error: Skins file {skins_file} does not exist")
        sys.exit(1)
    
    print("Loading exporter_skins data...")
    exporter_data = load_json_file(exporter_file)
    if not exporter_data:
        print("Failed to load exporter_skins data")
        sys.exit(1)
    
    print("Loading skins.json data...")
    skins_data = load_json_file(skins_file)
    if not skins_data:
        print("Failed to load skins.json data")
        sys.exit(1)
    
    print("Merging data...")
    merged_skins = merge_skin_data(exporter_data, skins_data)
    
    # Create summary statistics
    total_skins = len(merged_skins)
    skins_with_market_data = sum(1 for skin in merged_skins if skin['foundInMarket'])
    skins_with_price = sum(1 for skin in merged_skins if skin['sellingPrice'] > 0)
    
    print(f"\nMerge Summary:")
    print(f"Total skins processed: {total_skins}")
    print(f"Skins found in market data: {skins_with_market_data}")
    print(f"Skins with pricing data: {skins_with_price}")
    if total_skins > 0:
        print(f"Coverage: {skins_with_market_data/total_skins*100:.1f}%")
    
    # Create output data structure
    output_data = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_skins': total_skins,
            'skins_with_market_data': skins_with_market_data,
            'skins_with_price': skins_with_price,
            'coverage_percentage': round(skins_with_market_data/total_skins*100, 2) if total_skins > 0 else 0,
            'source_files': [
                str(exporter_file),
                str(skins_file)
            ]
        },
        'skins': merged_skins
    }
    
    # Create output directory if it doesn't exist
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Save merged data
    print(f"\nSaving merged data to {output_file}...")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"Successfully saved {total_skins} skins to {output_file}")
    except Exception as e:
        print(f"Error saving file: {e}")
        sys.exit(1)
    
    # Show some examples
    if skins_with_market_data > 0:
        print(f"\nFirst 5 skins with market data:")
        examples = [skin for skin in merged_skins if skin['foundInMarket']][:5]
        for skin in examples:
            print(f"  - {skin['skinName']} (ID: {skin['skinId']}) - {skin['sellingPriceText']}")

if __name__ == "__main__":
    main() 