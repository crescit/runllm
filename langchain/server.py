import logging
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Configure logging
log_file_path = 'app.log'
logging.basicConfig(filename=log_file_path, level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

#curl -X POST -H "Content-Type: application/json" -d '{"filename": "example.txt", "content": "Hello, this is the content of the file!"}' http://127.0.0.1:5001/write_job_file
@app.route('/write_job_file', methods=['POST'])
def write_file():
    try:
        save_directory = os.environ['JOB_DIRECTORY']
        os.makedirs(save_directory, exist_ok=True)
        data = request.get_json()

        if 'filename' in data and 'content' in data:
            filename = data['filename']
            content = data['content']
            file_path = os.path.join(save_directory, filename)
            with open(file_path, 'w') as file:
                file.write(content)

            response = {'status': 'success', 'message': f'File "{filename}" saved successfully.'}
        else:
            response = {'status': 'error', 'message': 'Invalid data format. Both "filename" and "content" are required.'}

    except Exception as e:
        response = {'status': 'error', 'message': f'An error occurred: {str(e)}'}

    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5001)