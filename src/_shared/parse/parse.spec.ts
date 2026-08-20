import type { SHEET_RAW } from '../../index.d';
import {
    getCellValue,
    getLabelsFromData,
    parseGoogleVisualizationJson,
    rowToValues,
} from './parse';

const BASE = {
    version: '0.6',
    reqId: '0',
    status: 'ok',
    sig: '1279529074',
};

const SIMPLE_JSON = { foo: 'bar' };
const SAMPLE = `/*O_o*/
google.visualization.Query.setResponse(${JSON.stringify(SIMPLE_JSON)});`;

export const RAW_TEMPLATE_TABLE: SHEET_RAW = {
    ...BASE,
    table: {
        cols: [
            { id: 'A', label: '', type: 'string' },
            { id: 'B', label: '', type: 'string' },
        ],
        rows: [
            { c: [{ v: 'LABEL 1' }, { v: 'LABEL 2' }] },
            { c: [null, { v: 'VALUE_2' }] },
        ],
        parsedNumHeaders: 0,
    },
};
export const RAW_OLD_TABLE: SHEET_RAW = {
    ...BASE,
    table: {
        cols: [
            { id: 'A', label: 'OLD_LABEL 1', type: 'number' },
            { id: 'B', label: 'OLD_LABEL 2', type: 'string' },
        ],
        rows: [
            { c: [{ v: 2, f: '2' }, { v: 'OLD_VALUE_1_2' }] },
            { c: [null, { v: 'OLD_VALUE_2_2' }] },
        ],
        parsedNumHeaders: 0,
    },
};

describe('✅ parseGoogleVisualizationJson()', () => {
    const FN = parseGoogleVisualizationJson;

    it('should parse valid Google Visualization JSONP response', () => {
        expect(FN(SAMPLE)).toEqual(SIMPLE_JSON);
    });
    it('should throw an error for invalid JSONP response', () => {
        expect(() => FN('invalid response')).toThrow(
            'Could not parse Google Sheets response'
        );
    });
});
describe('✅ getCellValue()', () => {
    const FN = getCellValue;

    it('should return the value of a cell if just v [value]', () => {
        expect(FN({ v: 'test' })).toEqual('test');
        expect(FN({ v: 1 })).toEqual(1);
        expect(FN({ v: true })).toEqual(true);
    });
    it('should return the value of a cell if f [formatted] and v [value]', () => {
        expect(FN({ f: 'test', v: 'ignored' })).toEqual('ignored');
        expect(FN({ f: '1', v: 1 })).toEqual(1);
        expect(FN({ f: 'true', v: true })).toEqual(true);
    });
    it('should return null for null or undefined cells', () => {
        expect(FN(null)).toEqual(null);
    });
});
describe('✅ rowToValues()', () => {
    const FN = rowToValues;
    it('should convert a row to an array of cell values', () => {
        const row = {
            c: [
                { v: 'value1' },
                { f: 'formatted2', v: 'value2' },
                null,
                { v: 3 },
                { v: false, f: 'false' },
            ],
        };
        const expected = ['value1', 'value2', null, 3, false];
        expect(FN(row)).toEqual(expected);
    });
    it('should return an empty array for a row with no cells', () => {
        const row = { c: [] };
        expect(FN(row)).toEqual([]);
    });
    it('should return an empty array for a null or undefined row', () => {
        expect(FN(null)).toEqual([]);
        expect(FN(undefined)).toEqual([]);
    });
});
describe('getLabelsFromData()', () => {
    const FN = getLabelsFromData;

    it('should extract the labels from the rows data', () => {
        const EXPECTED = {
            labels: ['LABEL 1', 'LABEL 2'],
            start: 1,
        };
        expect(FN(RAW_TEMPLATE_TABLE)).toEqual(EXPECTED);
    });
    it('should extract the labels from the rows data', () => {
        const EXPECTED = {
            labels: ['OLD_LABEL 1', 'OLD_LABEL 2'],
            start: 0,
        };
        expect(FN(RAW_OLD_TABLE)).toEqual(EXPECTED);
    });
    it('should return empty labels and start index 1 if no labels found', () => {
        const data = {
            ...BASE,
            table: {
                cols: [
                    { id: 'A', label: '', type: 'string' },
                    { id: 'B', label: '', type: 'string' },
                ],
                rows: [{ c: [null, null] }, { c: [null, null] }],
                parsedNumHeaders: 0,
            },
        };
        const EXPECTED = {
            labels: [],
            start: 1,
        };
        expect(FN(data)).toEqual(EXPECTED);
    });
});
