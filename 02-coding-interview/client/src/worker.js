import { executeCode } from './executeCode';

self.onmessage = (e) => {
    const code = e.data;
    const logs = [];

    const onLog = (log) => {
        logs.push(log);
    };

    try {
        executeCode(code, onLog);
        self.postMessage({ type: 'success', logs });
    } catch (error) {
        self.postMessage({ type: 'error', error: error.toString(), logs });
    }
};

