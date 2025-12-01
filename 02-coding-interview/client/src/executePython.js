let pyodide = null;
let currentOnLog = null;

const stdoutHandler = (text) => {
    if (currentOnLog) {
        currentOnLog(text);
    } else {
        console.log('Python stdout (unhandled):', text);
    }
};

const stderrHandler = (text) => {
    if (currentOnLog) {
        currentOnLog(`Error: ${text}`);
    } else {
        console.error('Python stderr (unhandled):', text);
    }
};

export const executePython = async (code, onLog) => {
    if (!pyodide) {
        try {
            // Load Pyodide from CDN
            const { loadPyodide } = await import("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs");
            pyodide = await loadPyodide({
                stdout: stdoutHandler,
                stderr: stderrHandler,
            });
        } catch (error) {
            console.error('Failed to load Pyodide:', error);
            throw new Error('Failed to load Python environment. Please check your internet connection.');
        }
    }

    currentOnLog = onLog;

    try {
        await pyodide.runPythonAsync(code);
    } catch (error) {
        throw error;
    } finally {
        currentOnLog = null;
    }
};
