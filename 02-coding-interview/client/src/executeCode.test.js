import { describe, it, expect, vi } from 'vitest';
import { executeCode } from './executeCode';

describe('executeCode', () => {
    it('executes script with function definitions and calls', () => {
        const code = `
            console.log("AA");

            function func(){
                console.log("BB");
            }

            func();
            console.log("CC");
        `;

        const logs = [];
        const onLog = (log) => logs.push(log);

        executeCode(code, onLog);

        expect(logs).toEqual([
            'AA',
            'BB',
            'CC'
        ]);
    });

    it('handles errors gracefully', () => {
        const code = 'throw new Error("Test Error");';
        const onLog = vi.fn();

        expect(() => executeCode(code, onLog)).toThrow('Test Error');
    });
});
