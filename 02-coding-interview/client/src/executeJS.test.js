import { describe, it, expect, vi } from 'vitest';
import { executeJS } from './executeJS';

describe('executeJS', () => {
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

        executeJS(code, onLog);

        expect(logs).toEqual([
            'AA',
            'BB',
            'CC'
        ]);
    });

    it('handles errors gracefully', () => {
        const code = 'throw new Error("Test Error");';
        const onLog = vi.fn();

        expect(() => executeJS(code, onLog)).toThrow('Test Error');
    });
});
