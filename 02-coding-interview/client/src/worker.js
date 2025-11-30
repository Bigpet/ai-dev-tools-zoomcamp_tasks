self.onmessage = (e) => {
    const code = e.data;
    const logs = [];

    // Capture console.log
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        logs.push(args.join(' '));
        // originalConsoleLog(...args); // Optional: log to browser console too
    };

    try {
        // Execute code
        // eslint-disable-next-line no-new-func
        new Function(code)();
        self.postMessage({ type: 'success', logs });
    } catch (error) {
        self.postMessage({ type: 'error', error: error.toString(), logs });
    } finally {
        console.log = originalConsoleLog;
    }
};
