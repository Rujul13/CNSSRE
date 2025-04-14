import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

function ControlPanel({ onGenerate, loading }) {
    return (
        <div className="d-flex justify-content-end">
            <Button
                variant="primary"
                onClick={onGenerate}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        <span className="ms-2">Generating...</span>
                    </>
                ) : (
                    'Generate Visualization'
                )}
            </Button>
        </div>
    );
}

export default ControlPanel;