import logging
import datetime
from flask_cors import cross_origin, CORS
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from pdfminer.utils import open_filename
import os
import threading
from chat import chat_with_model

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['CORS_ORIGINS'] =  ["http://localhost:3000", "http://localhost:8080", "http://localhost"]
CORS(app)
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

def process_documents_async(prompt_info, chat_type, user_id, directory, globs, embeddings_model_name):
    try:
        all_documents = []
        for glob in globs:
            loader = DirectoryLoader(directory, glob=glob)
            documents = loader.load()
            all_documents.extend(documents)

        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        texts = splitter.split_documents(all_documents)

        embeddings = HuggingFaceEmbeddings(model_name=embeddings_model_name, model_kwargs={'device': 'cpu'})
        db = FAISS.from_documents(texts, embeddings)

        # Ensure the user_id directory exists
        user_directory = os.path.join(os.getcwd(), 'faiss', user_id, chat_type)        
        if not os.path.exists(user_directory):
            os.makedirs(user_directory)

        # Save the FAISS index under the user_id directory
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        faiss_path = os.path.join(user_directory, f"faiss_{timestamp}")
        db.save_local(faiss_path)

        model_path = os.environ['MODEL_PATH']
        prompt = ""
        if chat_type == "JOB":
            prompt = "Give me ten questions for a qualified candidate for the job posting: " + prompt_info[0]
        if chat_type == "RESUME":
            prompt = "Give me ten questions for candidate: " + prompt_info[1] + "for the job posting: " + prompt_info[0]
        threading.Thread(target=chat_with_model, args=(prompt, chat_type, model_path, faiss_path)).start()
    except Exception as e:
        print(f"An error occurred during document processing: {str(e)}")

def upload_file(request, upload_folder, allowed_extensions):
    try:
        # Check if the upload folder exists, and create it if not
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

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
        
# Update the write_resume_file endpoint
@app.route('/write_resume_file', methods=['POST'])
def write_resume_file():
    try:
        user_id = request.form.get('user_id')
        if not user_id:
            response = {'status': 'error', 'message': 'Missing user_id in the form data'}
            code = 400  # Bad Request
            return jsonify(response), code
        job_title = request.form.get('job_title')
        if not user_id:
            response = {'status': 'error', 'message': 'Missing job_title in the form data'}
            code = 400  # Bad Request
            return jsonify(response), code
        user_name = request.form.get('user_name')
        if not user_name:
            response = {'status': 'error', 'message': 'Missing user_name in the form data'}
            code = 400  # Bad Request
            return jsonify(response), code
        response = upload_file(request, os.environ['RESUME_DIRECTORY'] + "/" + user_id, allowed_extensions)
        threading.Thread(target=process_documents_async, args=([job_title,user_name],"RESUME",user_id,os.environ['RESUME_DIRECTORY'], ['*.pdf', '*.txt'], "sentence-transformers/all-MiniLM-L6-v2")).start()
        return jsonify(response), 200
    except Exception as e:
        response = {'status': 'error', 'message': f'An error occurred: {str(e)}'}
        code = 500
        return jsonify(response), code

# Update the write_job_file endpoint
@app.route('/write_job_file', methods=['POST'])
def write_job_file():
    try:
        user_id = request.form.get('user_id')
        if not user_id:
            response = {'status': 'error', 'message': 'Missing user_id in the form data'}
            code = 400  # Bad Request
            return jsonify(response), code
        job_title = request.form.get('job_title')
        if not user_id:
            response = {'status': 'error', 'message': 'Missing job_title in the form data'}
            code = 400  # Bad Request
            return jsonify(response), code
        response = upload_file(request, os.environ['JOB_DIRECTORY'] + "/" + user_id, allowed_extensions)
        threading.Thread(target=process_documents_async, args=([job_title], "JOB",user_id,os.environ['JOB_DIRECTORY'], ['*.pdf', '*.txt'], "sentence-transformers/all-MiniLM-L6-v2")).start()
        return jsonify(response), 200
    except Exception as e:
        response = {'status': 'error', 'message': f'An error occurred: {str(e)}'}
        code = 500
        return jsonify(response), code

if __name__ == '__main__':
    configure_logging()
    app.run(port=5001)
