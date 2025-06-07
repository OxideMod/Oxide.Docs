# Rust Skins Fetcher

This project automatically fetches and archives Rust skins from the Steam marketplace on a weekly basis.

## Overview

A GitHub Action runs every Sunday at 6:00 PM EST to fetch all marketplace items for the game Rust. The data is stored in JSON<sup><a href="/glossary#json">[8]</a></sup> format in the `data` directory with both a timestamped version and a `latest` version.

## Data Structure

Each JSON<sup><a href="/glossary#json">[8]</a></sup> file contains:

- **Metadata**: Timestamp, app info, and item count
- **Items**: Detailed information on each marketplace item, including:
  - Name
  - Hash name
  - Price information
  - Listing counts
  - Asset description (ID, classid, icon URLs, etc.)
  - Trading information
  - More...

## Setup

To use this in your own repository:

1. Fork this repository
2. Add your Steam API key as a repository secret named `STEAM_API_KEY`
3. Ensure the GitHub Actions workflow has permissions<sup><a href="/glossary#permissions">[11]</a></sup> to push to your repository

## Manual Triggering

You can manually trigger the skins fetch process by going to the Actions tab in GitHub and selecting "Run workflow" on the "Fetch Rust Skins from Steam Marketplace" workflow.

## File Structure

- `.github/workflows/fetch-rust-skins.yml` - GitHub Actions workflow file
- `scripts/fetch_rust_skins.py` - Python script to fetch and save skin data
- `data/` - Directory where skin data is stored
  - `skins.json` - Main data file with all skins
  - `rust_skins_YYYYMMDD.json` - Timestamped archival copy
  - `rust_skins_latest.json` - Latest version (same as skins.json<sup><a href="/glossary#json">[8]</a></sup>)
