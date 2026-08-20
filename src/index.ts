/**
 * 🎯 A utility class for handling Google Sheets
 * @module backend/_shared/GOOGLE
 * @example GOOGLE.getTabData('sheetId', 'tabName');
 * @version 0.0.1
 * @date 2025-09-19
 * @license MIT
 * @author Robert Willemelis <github.com/willi84>
 */

import { command } from '@robert.tools/cmd';
import type { SHEET_ITEMS, SHEET_RAW } from './index.d';
import {
    getCellValue,
    getLabelsFromData,
    parseGoogleVisualizationJson,
} from './_shared/parse/parse';
import { SHEET_URL } from './index.config';

const getRawData = (id: string, tab: string): SHEET_RAW => {
    const url = SHEET_URL.replace('{id}', id).replace('{tab}', tab);
    const text = command(`curl -s "${url}"`);
    return parseGoogleVisualizationJson(text);
};

const getTabData = (id: string, tab: string): SHEET_ITEMS => {
    const raw = getRawData(id, tab);
    const items = [];
    const labels = getLabelsFromData(raw);
    const start = labels.start;
    for (let i = start; i < raw.table.rows.length; i += 1) {
        const row = raw.table.rows[i];
        const entry: { [key: string]: any } = {};
        for (const [index, cell] of row.c.entries()) {
            const key = labels.labels[index];
            entry[key] = getCellValue(cell);
        }
        items.push(entry);
    }
    return items;
};
const getLabels = (id: string, tab: string): string[] => {
    const raw = getRawData(id, tab);
    const labels = getLabelsFromData(raw);
    return labels.labels;
};

export class GOOGLE {
    /**
     * 🎯 Get the raw data of a specific tab and google file
     * @param {string} id ➡️ The ID of the Google Sheet.
     * @param {string} tab ➡️ The name of the tab within the Google Sheet.
     * @returns {SHEET_RAW} 📤 The raw data of the specified tab.
     */
    static getRawData = getRawData;

    /**
     * 🎯 Get the data of a specific tab and google file in a pre-formatted table
     * @param {string} id ➡️ The ID of the Google Sheet.
     * @param {string} tab ➡️ The name of the tab within the Google Sheet.
     * @returns {SHEET_ITEMS} 📤 The data of the specified tab in a pre-formatted table.
     */
    static getTabData = getTabData;

    /**
     * 🎯 Get the labels of a specific tab and google file
     * @param {string} id ➡️ The ID of the Google Sheet.
     * @param {string} tab ➡️ The name of the tab within the Google Sheet.
     * @returns {string[]} 📤 The labels of the specified tab.
     */
    static getLabels = getLabels;
}
