import { RAW_OLD_TABLE, RAW_TEMPLATE_TABLE } from './_shared/parse/parse.spec';
import { getJSONP, mockResponse } from './_shared/testing/testing';
import { GOOGLE } from './index';

const RAW_OLD = {
    version: '0.6',
    reqId: '0',
    status: 'ok',
    sig: '1279529074',
    table: {
        cols: [
            { id: 'A', label: '', type: 'string' },
            { id: 'B', label: '', type: 'string' },
            { id: 'C', label: '', type: 'string' },
            { id: 'D', label: '', type: 'string' },
            { id: 'E', label: '', type: 'string' },
            // { id: 'F', label: '', type: 'string' },
            // { id: 'G', label: '', type: 'string' },
            // { id: 'H', label: '', type: 'string' },
        ],
        rows: [
            {
                c: [
                    { v: 'icon' },
                    { v: 'KEY' },
                    { v: 'ISP' },
                    { v: 'Kontext' },
                    { v: 'Spalte 3' },
                ],
            },
            {
                c: [
                    null,
                    { v: 'icomera' },
                    { v: 'AS398830 Icomera US, Inc.' },
                    { v: 'DB Fernverkehr' },
                    { v: 'Robert' },
                ],
            },
            {
                c: [
                    null,
                    { v: 'unwirednetworks' },
                    null,
                    { v: 'RE60 Rheine  ' },
                    { v: 'Johannes' },
                ],
            },
            {
                c: [
                    null,
                    { v: 'timewarp' },
                    { v: 'AS207203 TIMEWARP IT Consulting GmbH' },
                    { v: 'ODEG' },
                    { v: 'Robert' },
                ],
            },
            {
                c: [
                    null,
                    { v: 'hotsplots' },
                    { v: 'AS210070 Hotsplots GmbH' },
                    { v: 'RMV' },
                    { v: 'Robert' },
                ],
            },
            {
                c: [
                    null,
                    { v: 'TelekomX' },
                    { v: 'Deutsche Telekom AG' },
                    { v: 'TEST' },
                    null,
                ],
            },
            {
                c: [
                    null,
                    null,
                    { v: 'AS204445 DB Systel GmbH' },
                    { v: 'wifi@db' },
                    { v: 'Robert' },
                ],
            },
            {
                c: [
                    null,
                    null,
                    { v: 'AS398830 Icomera US, Inc.' },
                    { v: 'RE14 Mainz-Frankfurt' },
                    { v: null }, // TODO: testen
                ],
            },
            {
                c: [
                    null,
                    { v: 'Next Layer' },
                    {
                        v: 'AS1764 Next Layer Telekommunikationsdienstleistungs- und Beratungs GmbH',
                    },
                    { v: 'ÖBB' },
                    { v: 'Robert' },
                    null,
                    null,
                    { v: null },
                ],
            },
            {
                c: [
                    null,
                    null,
                    { v: 'AS8412 T-Mobile Austria GmbH' },
                    { v: 'MAV' },
                    null,
                ],
            },
            {
                c: [
                    null,
                    { v: 'CD-Telematika' },
                    { v: 'AS25512 CD-Telematika a.s.' },
                    { v: 'CD' },
                    null,
                ],
            },
        ],
        parsedNumHeaders: 0,
    },
};

const id = '1234';
const tab = 'someTab';
const targetUrl = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${tab}`;
const SAMPLE = getJSONP(RAW_OLD);
describe('✅ getRawData()', () => {
    const id = '1234';
    const tab = 'someTab';
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should return the data for a given tab', () => {
        const spy = mockResponse(SAMPLE);
        const FN = GOOGLE.getRawData;
        expect(FN(id, tab)).toEqual(RAW_OLD);
        expect(spy).toHaveBeenCalledWith(`curl -s "${targetUrl}"`);
    });
});
describe('✅ getTabData()', () => {
    const id = '1234';
    const tab = 'someTab';
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should return the data for a given tab in pre-formatted table', () => {
        const spy = mockResponse(getJSONP(RAW_TEMPLATE_TABLE));
        const FN = GOOGLE.getTabData;
        const EXPECTED = [
            {
                'LABEL 1': null,
                'LABEL 2': 'VALUE_2',
            },
        ];
        expect(FN(id, tab)).toEqual(EXPECTED);
        expect(spy).toHaveBeenCalledWith(`curl -s "${targetUrl}"`);
    });
    it('should return the data for a given tab in old table', () => {
        const spy = mockResponse(getJSONP(RAW_OLD_TABLE));
        const FN = GOOGLE.getTabData;
        const EXPECTED = [
            {
                'OLD_LABEL 1': 2,
                'OLD_LABEL 2': 'OLD_VALUE_1_2',
            },
            {
                'OLD_LABEL 1': null,
                'OLD_LABEL 2': 'OLD_VALUE_2_2',
            },
        ];
        expect(FN(id, tab)).toEqual(EXPECTED);
        expect(spy).toHaveBeenCalledWith(`curl -s "${targetUrl}"`);
    });
    it('should return the data for a given tab in the old kontext', () => {
        const spy = mockResponse(getJSONP(RAW_OLD));
        const FN = GOOGLE.getTabData;
        const EXPECTED = {
            icon: null,
            KEY: 'icomera',
            ISP: 'AS398830 Icomera US, Inc.',
            Kontext: 'DB Fernverkehr',
            'Spalte 3': 'Robert',
        };
        const result = FN(id, tab);

        expect(result[0]).toEqual(EXPECTED);
        expect(spy).toHaveBeenCalledWith(`curl -s "${targetUrl}"`);
    });
});
describe('✅ getLabels()', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should return the labels for a given tab in pre-formatted table', () => {
        const spy = mockResponse(getJSONP(RAW_TEMPLATE_TABLE));
        const FN = GOOGLE.getLabels;
        const EXPECTED = ['LABEL 1', 'LABEL 2'];
        expect(FN(id, tab)).toEqual(EXPECTED);
        expect(spy).toHaveBeenCalledWith(`curl -s "${targetUrl}"`);
    });
});
