from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import traceback

from execution.python_executor import execute_python
from execution.r_executor import execute_r

app = Flask(__name__)
CORS(app)

@app.route('/api/visualize', methods=['POST'])
def visualize():
    try:
        data = request.json
        language = data.get('language', '').lower()
        code = data.get('code', '')

        if not language or not code:
            return jsonify({"error": "Language and code are required"}), 400

        if language == 'python':
            result = execute_python(code)
        elif language == 'r':
            result = execute_r(code)
        else:
            return jsonify({"error": f"Unsupported language: {language}"}), 400

        return jsonify(result)

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)