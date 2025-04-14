import React from 'react';
import { Spinner } from 'react-bootstrap';

function VisualizationDisplay({ visualization, loading }) {
    if (loading) {
        return (
            <div className="spinner-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!visualization) {
        return (
            <div className="visualization-container text-center">
                <p className="text-muted">No visualization generated yet.
                    Click "Generate Visualization" to create one.</p>
            </div>
        );
    }

    // Handle different visualization types
    if (visualization.type === 'image') {
        return (
            <div className="visualization-container">
                <img
                    src={visualization.data}
                    alt="Generated visualization"
                    className="visualization-image"
                />
            </div>
        );
    } else if (visualization.type === 'html') {
        return (
            <div className="visualization-container">
                <iframe
                    srcDoc={visualization.data}
                    title="Generated visualization"
                    className="visualization-frame"
                    sandbox="allow-scripts"
                />
            </div>
        );
    } else {
        return (
            <div className="visualization-container text-center">
                <p className="text-danger">Unsupported visualization format.</p>
            </div>
        );
    }
}

export default VisualizationDisplay;