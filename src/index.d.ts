export type CELL_VALUE = {
    v: any;
    f?: string | null;
};
export type CELL_ITEM = null | CELL_VALUE;
export type SHEET_RAW = {
    version: string;
    reqId: string;
    status: string;
    sig: string;
    table: {
        cols: { id: string; label: string; type: string }[];
        rows: { c: CELL_ITEM[] }[];
        parsedNumHeaders: number;
    };
};

export type SHEET_ITEM = {
    [key: string]: any;
};

export type SHEET_ITEMS = SHEET_ITEM[];
