import logging
import datetime
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from pdfminer.utils import open_filename
import os

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
allowed_extensions = {'pdf', 'txt'}

def configure_logging():
    # Configure logging
    log_file_path = 'app.log'
    logging.basicConfig(filename=log_file_path, level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
    # copied logging config
    # Create a logger
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)

    # Create a file handler
    file_handler = logging.FileHandler(log_file_path)
    file_handler.setLevel(logging.INFO)

    # Create a stream handler (for printing to console)
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)

    # Create a formatter and add it to the handlers
    formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
    file_handler.setFormatter(formatter)
    stream_handler.setFormatter(formatter)

    # Add the handlers to the logger
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)

def process_documents(directory, globs, embeddings_model_name):
    all_documents = []
    for glob in globs:
        loader = DirectoryLoader(directory, glob=glob)
        documents = loader.load()
        all_documents.extend(documents)

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = splitter.split_documents(all_documents)

    embeddings = HuggingFaceEmbeddings(model_name=embeddings_model_name, model_kwargs={'device': 'cpu'})
    db = FAISS.from_documents(texts, embeddings)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    db.save_local(f"faiss_{timestamp}")

def upload_file(request, upload_folder, allowed_extensions):
    try:
        # Check if the 'file' key is in the request files
        print(request)
        if 'file' in request.files:
            uploaded_file = request.files['file']

            # Check if the file has an allowed extension
            if uploaded_file and '.' in uploaded_file.filename and uploaded_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions:
                # Save the uploaded file to the specified folder
                filename = secure_filename(uploaded_file.filename)
                file_path = os.path.join(upload_folder, filename)
                uploaded_file.save(file_path)

                return {'status': 'success', 'message': f'File "{filename}" uploaded successfully.'}
            else:
                return {'status': 'error', 'message': f'Invalid file format. Only {", ".join(allowed_extensions)} files are allowed.'}, 400
        else:
            return {'status': 'error', 'message': 'No file provided in the request.'}, 400

    except Exception as e:
        return {'status': 'error', 'message': f'An error occurred: {str(e)}'}, 500

# curl -X POST -H "Content-Type: application/json" -d '{"filename": "example.txt", "content": "Hello, this is the content of the file!"}' http://127.0.0.1:5001/write_job_file
@app.route('/write_job_file', methods=['POST'])
def write_job_file():
    response = {} 
    code = 200
    try:
        response, code = upload_file(request, os.environ['JOB_DIRECTORY'], allowed_extensions)
        process_documents(os.environ['JOB_DIRECTORY'], ['*.pdf', '*.txt'], "sentence-transformers/all-MiniLM-L6-v2")
    except Exception as e:
        response = {'status': 'error', 'message': f'An error occurred: {str(e)}'}
        code = 500

    return jsonify(response), code

# curl -X POST -H "Content-Type: application/json" -d '{"filename": "example.txt", "content": "Hello, this is the content of the file!"}' http://127.0.0.1:5001/write_resume_file
@app.route('/write_resume_file', methods=['POST'])
def write_resume_file():
    response = {}
    code = 200
    try:
        response, code = upload_file(request, os.environ['RESUME_DIRECTORY'], allowed_extensions)
        process_documents(os.environ['RESUME_DIRECTORY'], ['*.pdf', '*.txt'], "sentence-transformers/all-MiniLM-L6-v2")
    except Exception as e:
        response = {'status': 'error', 'message': f'An error occurred: {str(e)}'}
        code = 500

    return jsonify(response), code

if __name__ == '__main__':
    configure_logging()
    app.run(port=5001)
