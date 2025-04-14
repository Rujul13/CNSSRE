import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import LanguageSelector from './components/LanguageSelector';
import CodeEditor from './components/CodeEditor';
import ControlPanel from './components/ControlPanel';
import VisualizationDisplay from './components/VisualizationDisplay';
import { generateVisualization } from './services/api';

function App() {
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(getDefaultCode('python'));
    const [visualization, setVisualization] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await generateVisualization(language, code);
            setVisualization(response.data);
        } catch (err) {
            console.error('Error generating visualization:', err);
            setError(err.response?.data?.error || 'Failed to generate visualization');
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setCode(getDefaultCode(selectedLanguage));
        setVisualization(null);
    };

    return (
        <Container fluid className="app-container">
            <h1 className="text-center my-4">Language Agnostic Visualization</h1>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <LanguageSelector
                                language={language}
                                onLanguageChange={handleLanguageChange}
                            />
                        </Card.Header>
                        <Card.Body>
                            <CodeEditor
                                code={code}
                                language={language}
                                onChange={setCode}
                            />
                        </Card.Body>
                        <Card.Footer>
                            <ControlPanel
                                onGenerate={handleGenerate}
                                loading={loading}
                            />
                            {error && <div className="text-danger mt-2">{error}</div>}
                        </Card.Footer>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="visualization-card">
                        <Card.Header>Visualization Output</Card.Header>
                        <Card.Body>
                            <VisualizationDisplay
                                visualization={visualization}
                                loading={loading}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

function getDefaultCode(language) {
    if (language === 'python') {
        return `import matplotlib.pyplot as plt
import numpy as np
import io
import base64

# Generate data
categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

# Create figure and axis
fig, ax = plt.subplots(figsize=(10, 6))

# Create bar chart
ax.bar(categories, values, color='skyblue')

# Add title and labels
ax.set_title('Sample Bar Chart')
ax.set_xlabel('Categories')
ax.set_ylabel('Values')

# Add grid lines
ax.grid(axis='y', linestyle='--', alpha=0.7)

# Save it to a bytes buffer
buffer = io.BytesIO()
plt.savefig(buffer, format='png')
buffer.seek(0)

# Convert to base64 string
img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')

# Return as a data URL
result = f"data:image/png;base64,{img_str}"`;
    } else {
        return `# Create a simple bar chart with ggplot2
library(ggplot2)
library(base64enc)

# Create data frame
data <- data.frame(
  category = c('A', 'B', 'C', 'D', 'E'),
  value = c(23, 45, 56, 78, 32)
)

# Create the plot
p <- ggplot(data, aes(x = category, y = value)) +
  geom_bar(stat = "identity", fill = "skyblue") +
  labs(title = "Sample Bar Chart", x = "Categories", y = "Values") +
  theme_minimal() +
  theme(panel.grid.major.y = element_line(linetype = "dashed", color = "gray80"))

# Save plot to a temporary file
temp_file <- tempfile(fileext = ".png")
ggsave(temp_file, plot = p, width = 10, height = 6, units = "in", dpi = 72)

# Read file as binary and encode to base64
img_bin <- readBin(temp_file, "raw", file.info(temp_file)$size)
img_str <- base64encode(img_bin)

# Return as a data URL
result <- paste0("data:image/png;base64,", img_str)`;
    }
}

export default App;