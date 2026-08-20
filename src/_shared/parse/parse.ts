import type { CELL_ITEM, SHEET_RAW } from '../../index.d';

/**
 * 🎯 parse the Google Visualization JSONP response
 * @param {string} text the JSONP response text
 * @returns {object} the parsed JSON object
 */
export const parseGoogleVisualizationJson = (text: string) => {
    const match = String(text || '').match(
        /google\.visualization\.Query\.setResponse\((.*)\);?\s*$/s
    );
    if (!match) {
        throw new Error('Could not parse Google Sheets response');
    }

    return JSON.parse(match[1]);
};

/**
 * 🎯 get the value of a cell, handling null and undefined values
 * @param {CELL_ITEM} cell the cell object
 * @returns {any} the cell value
 */
export const getCellValue = (cell: CELL_ITEM): any => {
    if (cell === null || cell === undefined) {
        return null; // TODO: alterantive value for null or undefined cells, e.g., '' or 0
    }
    if (cell.hasOwnProperty('v')) {
        return cell.v;
    }
    return cell?.f ?? null; // TODO: alterantive value for null or undefined cells, e.g., '' or 0
};

/**
 * 🎯 convert a row object to an array of cell values
 * @param {object} row the row object
 * @returns {any[]} the array of cell values
 */
export const rowToValues = (row: any) => {
    return (row?.c || []).map((cell: any) => getCellValue(cell));
};

export const getLabelsFromData = (data: SHEET_RAW) => {
    const labels: string[] = [];

    // check cols first

    for (const col of data.table.cols) {
        if (col.label !== '') {
            labels.push(col.label);
        }
    }

    if (labels.length > 0) {
        return { labels, start: 0 };
    } else {
        let rowIndex = 0;
        for (const row of data.table.rows) {
            const values = rowToValues(row);
            const hasValues = values.some(
                (value: any) => typeof value === 'string' && value !== ''
            );
            if (hasValues) {
                return { labels: values, start: rowIndex + 1 };
            }
            rowIndex += 1; // if no labels found, continue to the next row
        }
    }

    return { labels: [], start: 1 };
};
