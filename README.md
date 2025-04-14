# Language Agnostic Visualization Web Application

This web application allows users to generate visualizations using Python or R code. The application executes the code securely on the backend and displays the resulting visualizations in the frontend.

## Overview

### Design and Tools

#### Frontend:
- React.js for the UI
- Axios for API calls
- React-CodeMirror for code editing
- Bootstrap for styling

#### Backend:
- Python with Flask for the API server
- Docker for containerization and isolation
- Subprocess for executing Python and R scripts securely
- Various visualization libraries support:
    - Python: Matplotlib, Plotly, Seaborn
    - R: ggplot2, plotly, rgl

### Architecture

The application follows a microservice architecture:
1. Frontend container handles user interaction and visualization display
2. Backend container handles code execution and visualization generation
3. Communication is done via RESTful API

## Running the Application

1. Ensure Docker and Docker Compose are installed on your system
2. Clone this repository
3. Run `docker-compose up` in the project root directory
4. Access the application at http://localhost:3000

## Supported Visualizations

### Python
- Static: Matplotlib, Seaborn
- Interactive: Plotly
- 3D: Plotly 3D

### R
- Static: ggplot2
- Interactive: plotly
- 3D: rgl

## Issues faced during implementation and Solutions

### 3D Visulization
- **Issue**: could not succeed in developing all the 3d Visualization and faced some hurdles 
- **Solution**: Need to work on better implementation of the libraries and fine turning the web application 

### Cross-Origin Resource Sharing
- **Issue**: Frontend could not access backend API due to CORS restrictions
- **Solution**: Configured Flask to allow CORS from the frontend domain

### Visualization Rendering
- **Issue**: Different visualization libraries produce different output formats
- **Solution**: Standardized output to either Base64-encoded images or HTML content