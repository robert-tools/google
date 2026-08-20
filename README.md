# @robert.tools/google

A package to access Google Workspace

## Installation

```bash
npm install @robert.tools/google
```

## Usage

```typescript
import { GOOGLE } from '@robert.tools/google';

// getting raw data from a Google Sheet
const rawData = GOOGLE.getRawData('sheetId', 'tabName');

// getting tab data from a Google Sheet
const tabData = GOOGLE.getTabData('sheetId', 'tabName');

// getting labels from a Google Sheet
const labels = GOOGLE.getLabels('sheetId', 'tabName');

```

## FUTURE 
Maybe also providing access to other Google Workspace services like Google Drive, Google Docs, etc.