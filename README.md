# Epstein Flight Logs and Black Book Data

This repository contains scripts and data related to Jeffrey Epstein's flight logs and black book for research and analysis purposes.

## Overview

This project provides tools to download and organize public domain documents related to the Jeffrey Epstein case, specifically:

1. **Black Book**: Contact information and addresses (95 pages)
2. **Flight Manifests**: Private jet passenger logs (64 pages)

## Data Sources

All data is sourced from publicly available documents hosted at:
- **Website**: [epsteinsblackbook.com](https://epsteinsblackbook.com)
- **Black Book Images**: `https://epsteinsblackbook.com/black-book-images/{page-no}.jpg`
- **Flight Manifest Images**: `https://epsteinsblackbook.com/flight-manifests-images/{page-no}.jpg`

### Data Attribution

The documents made available through epsteinsblackbook.com appear to be court records and other materials that have entered the public domain through legal proceedings. Users should verify the authenticity and legal status of any documents for their specific use case.

## Repository Structure

```
raw-data/
├── black-book/
│   ├── download.js          # Script to download black book pages
│   └── pages/               # Downloaded black book images (95 pages)
│       ├── page-001.jpg
│       ├── page-002.jpg
│       └── ...
└── flight-logs/
    ├── download.js          # Script to download flight manifest pages
    ├── flgiht-logs.json     # JSON data with flight information
    └── pages/               # Downloaded flight manifest images (64 pages)
        ├── page-004.jpg
        ├── page-006.jpg
        └── ...
```

## Usage

### Download Black Book Pages

```bash
cd raw-data/black-book
node download.js
```

This downloads all 95 pages of the black book to `raw-data/black-book/pages/`.

### Download Flight Manifest Pages

```bash
cd raw-data/flight-logs
node download.js
```

This downloads flight manifest pages to `raw-data/flight-logs/pages/`. The script reads page numbers from `flight-logs.json` to determine which pages to download (64 pages total).

## Features

- **Multi-threaded Downloads**: Both scripts use concurrent downloads (5 pages at a time) for efficiency
- **Resume Support**: Scripts skip already downloaded files
- **Error Handling**: Graceful handling of network errors and missing pages
- **Progress Tracking**: Real-time download progress with batch information

## Technical Details

- **Language**: Node.js (CommonJS)
- **Dependencies**: Built-in modules only (`fs`, `path`, `https`)
- **Concurrency**: 5 concurrent downloads per batch
- **Rate Limiting**: 1-second delay between batches to be respectful to the server

## Legal and Ethical Considerations

This repository is intended for legitimate research, journalism, and public interest purposes. Users are responsible for:

- Verifying the authenticity of any documents
- Ensuring compliance with applicable laws and regulations
- Respecting privacy rights and ethical considerations
- Using the data responsibly and for lawful purposes

## Disclaimer

The maintainers of this repository do not endorse or validate the content of the documents. This tool is provided for research and transparency purposes only. Users should independently verify any information and consult legal counsel for questions about the use of this data.