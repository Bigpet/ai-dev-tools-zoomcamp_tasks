import React from 'react';

const Output = ({ output }) => {
    return (
        <div className="output-container">
            <h3>Output</h3>
            <pre>{output.map((line, i) => <div key={i}>{line}</div>)}</pre>
        </div>
    );
};

export default Output;
