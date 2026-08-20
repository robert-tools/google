const CMD = require('@robert.tools/cmd');
import { activateAllMockedFunctions, mockResponse } from './testing';

describe('mockResponse()', () => {
    const FN = mockResponse;
    it('should mock the command response', () => {
        const spy = FN({ foo: 'bar' });
        expect(CMD.command('')).toEqual('{"foo":"bar"}\n');
        spy.mockRestore();
    });
});

describe('mockResponse() with string', () => {
    const FN = mockResponse;
    it('should mock the command response with string', () => {
        const spy = FN('test');
        expect(CMD.command('')).toEqual('test\n');
        spy.mockRestore();
    });
    it('should mock the command response with number', () => {
        const spy = FN(123);
        expect(CMD.command('')).toEqual('123\n');
        spy.mockRestore();
    });
});
describe('activateMockedFunctions()', () => {
    const FN = activateAllMockedFunctions;
    const CMD = {
        testFn: () => 'original',
    };
    it('should activate mocked functions', () => {
        const MOCKED = {
            testFn: { module: CMD, returnValue: 'mocked' },
        };
        expect(CMD.testFn()).toEqual('original');
        FN(MOCKED);
        expect(CMD.testFn()).toEqual('mocked');
        jest.restoreAllMocks();
        expect(CMD.testFn()).toEqual('original');
    });
});
