import { executeCode as executeJS } from './executeJS';
import { executePython } from './executePython';

self.onmessage = async (e) => {
    const { code, language } = e.data;
    const logs = [];

    const onLog = (log) => {
        logs.push(log);
    };

    try {
        if (language === 'python') {
            await executePython(code, onLog);
        } else if (language === 'javascript') {
            executeJS(code, onLog);
        } else {
            throw new Error(`Unsupported language: ${language}`);
        }
        self.postMessage({ type: 'success', logs });
    } catch (error) {
        self.postMessage({ type: 'error', error: error.toString(), logs });
    }
};

