import os
import tempfile
import subprocess
import base64
import re

def execute_python(code):
    """
    Execute Python code and return the visualization result.

    Args:
        code (str): Python code to execute

    Returns:
        dict: Visualization result containing type and data
    """
    # Create a temporary directory to store the visualization
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create a Python script file
        script_path = os.path.join(temp_dir, 'visualization.py')
        with open(script_path, 'w') as f:
            f.write(code)

        # Execute the script with output redirection
        result_path = os.path.join(temp_dir, 'result.txt')
        error_path = os.path.join(temp_dir, 'error.txt')

        try:
            # Run the script with a timeout to prevent long-running code
            process = subprocess.run(
                ['python', script_path],
                capture_output=True,
                text=True,
                timeout=30  # 30 seconds timeout
            )

            # Check for errors
            if process.returncode != 0:
                return {"error": f"Execution error: {process.stderr}"}

            # Get the output, which should be the visualization result
            output = process.stdout.strip()

            # Check if the output is a data URL (for images)
            if output.startswith('data:image/'):
                return {
                    "type": "image",
                    "data": output
                }

            # Check if the output is HTML (for interactive visualizations)
            if output.startswith('<!DOCTYPE html>') or output.startswith('<html>'):
                return {
                    "type": "html",
                    "data": output
                }

            # If the script defined a 'result' variable, try to use it
            with open(script_path, 'r') as f:
                if 'result =' in f.read():
                    # Extract the result variable from the last line of the script
                    result = extract_result_from_script(code)

                    # Determine the type of result
                    if result.startswith('data:image/'):
                        return {
                            "type": "image",
                            "data": result
                        }
                    elif result.startswith('<!DOCTYPE html>') or result.startswith('<html>'):
                        return {
                            "type": "html",
                            "data": result
                        }

            # If we couldn't determine the result type, return an error
            return {"error": "Could not determine visualization result type"}

        except subprocess.TimeoutExpired:
            return {"error": "Execution timed out"}
        except Exception as e:
            return {"error": f"Error executing code: {str(e)}"}

def extract_result_from_script(code):
    """Extract the result variable from the script code."""
    lines = code.strip().split('\n')
    for line in reversed(lines):
        if line.strip().startswith('result ='):
            # Extract the result value
            result_match = re.match(r'result\s*=\s*[\'"](.+)[\'"]', line)
            if result_match:
                return result_match.group(1)

    # If no result variable is found, look for the last variable assignment
    for line in reversed(lines):
        if '=' in line and not line.strip().startswith('#'):
            var_name = line.split('=')[0].strip()
            # Add code to print the variable
            return f"print({var_name})"

    return ""