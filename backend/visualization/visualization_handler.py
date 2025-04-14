"""
This module contains utility functions for handling different types of visualizations.
It can be extended in the future to support additional libraries and visualization types.
"""

def is_data_url(text):
    """Check if the given text is a data URL."""
    return text.startswith('data:')

def is_html(text):
    """Check if the given text is HTML."""
    return text.startswith('<!DOCTYPE html>') or text.startswith('<html>')

def get_visualization_type(output):
    """
    Determine the type of visualization from the output.

    Args:
        output (str): The output from the script execution

    Returns:
        str: The visualization type ('image', 'html', or None)
    """
    if is_data_url(output):
        return 'image'
    elif is_html(output):
        return 'html'
    return None