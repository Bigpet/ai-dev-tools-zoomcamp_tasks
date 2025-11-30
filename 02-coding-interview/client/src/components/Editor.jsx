import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange, language = 'javascript' }) => {
    const handleEditorChange = (value) => {
        onChange(value);
    };

    return (
        <div className="editor-container">
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
        </div>
    );
};

export default CodeEditor;
