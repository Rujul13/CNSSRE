import React from 'react';
import { Form } from 'react-bootstrap';

function LanguageSelector({ language, onLanguageChange }) {
    return (
        <Form.Group>
            <Form.Label>Select Language:</Form.Label>
            <Form.Select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
            >
                <option value="python">Python</option>
                <option value="r">R</option>
            </Form.Select>
        </Form.Group>
    );
}

export default LanguageSelector;