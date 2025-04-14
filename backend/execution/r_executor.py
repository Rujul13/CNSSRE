import os
import tempfile
import subprocess
import base64
import re

def execute_r(code):
    """
    Execute R code and return the visualization result.

    Args:
        code (str): R code to execute

    Returns:
        dict: Visualization result containing type and data
    """
    # Create a temporary directory to store the visualization
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create an R script file
        script_path = os.path.join(temp_dir, 'visualization.R')
        with open(script_path, 'w') as f:
            # Add code to capture and print the result
            f.write(code)
            # Add code to print the result if it exists
            f.write('\n\ncat(result)\n')

        try:
            # Run the script with a timeout to prevent long-running code
            process = subprocess.run(
                ['Rscript', script_path],
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

            # If we couldn't determine the result type, try to extract it from the script
            with open(script_path, 'r') as f:
                script_content = f.read()

                # Check if there's a 'result' variable defined
                if 'result <-' in script_content or 'result =' in script_content:
                    # The result should have been printed by the added cat() command
                    if output:
                        # Try to determine the type of result
                        if output.startswith('data:image/'):
                            return {
                                "type": "image",
                                "data": output
                            }
                        elif output.startswith('<!DOCTYPE html>') or output.startswith('<html>'):
                            return {
                                "type": "html",
                                "data": output
                            }

            # If we still couldn't determine the result type, return an error
            return {"error": "Could not determine visualization result type"}

        except subprocess.TimeoutExpired:
            return {"error": "Execution timed out"}
        except Exception as e:
            return {"error": f"Error executing code: {str(e)}"}