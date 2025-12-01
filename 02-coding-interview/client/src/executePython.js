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
            // Load Pyodide from local assets
            const { loadPyodide } = await import("pyodide");
            pyodide = await loadPyodide({
                indexURL: '/assets/pyodide',
                stdout: stdoutHandler,
                stderr: stderrHandler,
            });
        } catch (error) {
            console.error('Failed to load Pyodide:', error);
            throw new Error('Failed to load Python environment.');
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
