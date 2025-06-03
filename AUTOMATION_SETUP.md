# Automated Skin Data Update Workflow

This document explains the automated process for updating Rust skin data in this repository.

## Overview

The system automatically updates skin data twice per week using GitHub Actions:

1. **Thursday 6:00 PM EST**: Fetch Steam Market data → `data/skins.json`
2. **Thursday 8:00 PM EST**: Fetch VM data → `data/exporter_skins-YYYY-MM-DD.json` → Merge data → `data/merged_skins.json`

## Workflow Files

### 1. `fetch-rust-skins.yml`

- **Schedule**: Every Thursday at 6:00 PM EST
- **Purpose**: Fetches skin data from Steam Market API
- **Output**: `data/skins.json`
- **Requirements**: `STEAM_API_KEY` secret

### 2. `fetch-vm-skins-and-merge.yml`

- **Schedule**: Every Thursday at 8:00 PM EST (2 hours after Steam fetch)
- **Purpose**: Fetches skin data from VM API and merges with Steam data
- **Output**:
  - `data/exporter_skins-YYYY-MM-DD.json` (VM data)
  - `data/merged_skins.json` (merged data)
- **Requirements**: `VM_API_ENDPOINT` secret

## Setup Instructions

### Required GitHub Secrets

1. **STEAM_API_KEY**: Your Steam Web API key
   - Get one from: https://steamcommunity.com/dev/apikey
2. **VM_API_ENDPOINT**: Your VM's API endpoint URL
   - Example: `https://your-vm-domain.com/api/skins`
   - Should return JSON<sup><a href="/glossary#json">[8]</a></sup> data in the expected exporter format

### Setting Up Secrets

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add both required secrets

## Manual Triggering

Both workflows can be manually triggered:

1. Go to the "Actions" tab in your repository
2. Select the desired workflow
3. Click "Run workflow"
4. For the VM workflow, you can optionally provide a custom API endpoint

## File Structure

```
data/
├── skins.json                           # Steam Market data
├── exporter_skins-YYYY-MM-DD.json     # VM exported data (dated)
└── merged_skins.json                   # Final merged data
```

## Scripts

### `scripts/fetch_rust_skins.py`

- Fetches data from Steam Market API
- Handles rate limiting and retries
- Outputs to `data/skins.json`

### `scripts/merge_skins.py`

- Merges Steam Market data with VM exported data
- Supports command line arguments for flexible file paths
- Outputs to `data/merged_skins.json`

## Usage Examples

### Manual Script Execution

```bash
# Fetch Steam data
python scripts/fetch_rust_skins.py --max-items 10000

# Merge with today's VM data
python scripts/merge_skins.py --date 2025-01-16

# Merge with custom file paths
python scripts/merge_skins.py \
  --exporter-file data/custom_exporter.json \
  --skins-file data/skins.json \
  --output-file data/custom_merged.json
```

## Monitoring

- Check the "Actions" tab for workflow execution status
- Review workflow logs for any errors or issues
- Monitor the `data/` directory for updated files

## Troubleshooting

### Common Issues

1. **Steam API rate limiting**: The script includes conservative delays and backoff strategies
2. **VM endpoint unavailable**: Check the VM_API_ENDPOINT secret and VM status
3. **Merge failures**: Ensure both source files exist and are valid JSON<sup><a href="/glossary#json">[8]</a></sup>

### Error Recovery

- Both workflows can be manually re-run if they fail
- The scripts include error handling and detailed logging
- Failed workflows will not overwrite existing good data

## Data Format

### Steam Market Data (`skins.json`)

```json
[
  {
    "name": "AK-47 | Redline",
    "sell_price": 1000,
    "sell_price_text": "$10.00",
    "asset_description": {
      "classid": "123456789",
      "icon_url": "https://...",
      "market_hash_name": "AK-47 | Redline (Field-Tested)"
    }
  }
]
```

### VM Exported Data (`exporter_skins-YYYY-MM-DD.json`)

```json
{
  "Items": [
    {
      "ItemDisplayName": "AK-47",
      "Skins": [
        {
          "SkinId": 123456789,
          "SkinName": "Redline",
          "SkinType": "Weapon"
        }
      ]
    }
  ]
}
```

### Merged Data (`merged_skins.json`)

```json
{
  "metadata": {
    "generated_at": "2025-01-16T20:00:00Z",
    "total_skins": 1500,
    "skins_with_market_data": 1200,
    "coverage_percentage": 80.0
  },
  "skins": [
    {
      "skinId": 123456789,
      "skinName": "Redline",
      "skinType": "Weapon",
      "itemName": "AK-47",
      "iconUrl": "https://...",
      "sellingPrice": 1000,
      "sellingPriceText": "$10.00",
      "foundInMarket": true,
      "matchedBy": "classid",
      "marketClassId": "123456789"
    }
  ]
}
```
