export const executeJS = (code, onLog) => {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        onLog(args.join(' '));
    };

    try {
        // Indirect eval to run in global scope
        (0, eval)(code);
    } catch (error) {
        throw error;
    } finally {
        console.log = originalConsoleLog;
    }
};
