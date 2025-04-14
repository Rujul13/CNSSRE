import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';

function CodeEditor({ code, language, onChange }) {
    const getLanguageExtension = () => {
        if (language === 'python') {
            return python();
        } else if (language === 'r') {
            // Using JavaScript extension for R as there's no specific R extension
            // in this package version, but it still provides basic syntax highlighting
            return javascript();
        }
        return [];
    };

    return (
        <div>
            <CodeMirror
                value={code}
                height="400px"
                extensions={[getLanguageExtension()]}
                onChange={onChange}
                theme="light"
            />
        </div>
    );
}

export default CodeEditor;