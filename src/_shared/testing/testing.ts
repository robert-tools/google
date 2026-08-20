import * as CMD from '@robert.tools/cmd';
import type { MOCKED_FNS } from './testing.d';

export const mockResponse = (input: any) => {
    const isObject =
        typeof input === 'object' && input !== null && !Array.isArray(input);
    const value = isObject ? JSON.stringify(input) : input;
    const spy = jest.spyOn(CMD, 'command').mockReturnValue(value + '\n');
    return spy;
};

export const mockFunction = (module: any, fnName: string, returnValue: any) => {
    const spy = jest.spyOn(module, fnName).mockReturnValue(returnValue);
    return spy;
};

export const activateAllMockedFunctions = (MOCKED: MOCKED_FNS) => {
    Object.keys(MOCKED).forEach((key) => {
        const { module, returnValue } = MOCKED[key];
        mockFunction(module, key, returnValue);
    });
};
export const _STR = JSON.stringify;

export const getJSONP = (data: any) => {
    return `/*O_o*/
google.visualization.Query.setResponse(${JSON.stringify(data)});`;
};
