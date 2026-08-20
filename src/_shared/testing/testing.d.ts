export type MOCK_FN = {
    module: any;
    returnValue: any;
};
export type MOCKED_FNS = {
    [key: string]: MOCK_FN;
};
