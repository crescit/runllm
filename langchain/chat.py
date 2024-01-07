import os
import argparse
import requests
import threading
import re
import traceback
from langchain.llms import CTransformers
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate 
from langchain.chains import RetrievalQA

def send_questions_http(chat_type, user_id, questions, path, job_title):
    # TODO get this from env var, and remember the / at end
    base_url = "http://localhost:8080/"
    cv_id = None

    if chat_type == "RESUME":
        endpoint = "resumes"
        initial_data = {
            "user_id": user_id,
        }
    elif chat_type == "JOB":
        endpoint = "jobs"
        initial_data = {
            "type": "LOCAL",
            "resource_path": path,
            "title": job_title
        }
    else:
        raise ValueError("Invalid chat_type. Supported values are 'RESUME' or 'JOB'.")

    initial_url = f"{base_url}{endpoint}"

    try:
        initial_response = requests.post(initial_url, json=initial_data)

        if initial_response.status_code == 200:
            if chat_type == "RESUME":
                res_json = initial_response.json()
                print(res_json)
                try:
                    cv_id = res_json["resume"]["id"]
                except (KeyError, TypeError):
                    cv_id = None
                print(f"cv_id obtained: {cv_id}")
        else:
            print(f"Request Failed. Status code: {initial_response.status_code}")
            return
    except requests.RequestException as e:
        print(f"Error sending initial HTTP request: {e}")
        return

    questions_url = f"{base_url}questions"

    questions_data = {
        "cv_id": cv_id,
        "questions": questions
    }

    try:
        # Send the second POST request
        questions_response = requests.post(questions_url, json=questions_data)

        # Check the response status code
        if questions_response.status_code == 200:
            print(f"Questions sent successfully. {initial_response.json()}")
        else:
            print(f"Failed to send questions. Status code: {questions_response.status_code}")
    except requests.RequestException as e:
        print(f"Error sending second HTTP request: {e}")

def chat_with_model(promptStr, chat_type, user_id, model_path, vector_db_path, job_title):
    try:
        # prepare the template we will use when prompting the AI
        template = """You are a hiring manager at a mid to large size corporation. You are in charge of interviewing the candidate for jobs which you have the description for.
        Context: {context}
        Question: {question}
        Take a deep breath and be polite.
        Helpful answer:
        """
        print("prepared template")

        # load the language model
        llm = CTransformers(model=model_path,
                            model_type='llama',
                            config={'max_new_tokens': 512, 'temperature': 0.01})
        print("loaded wizardlm")

        # load the interpreted information from the local database
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'})
        db = FAISS.load_local(vector_db_path, embeddings)
        print("loaded resume db")

        # prepare a version of the llm pre-loaded with the local content
        retriever = db.as_retriever(search_kwargs={'k': 2})
        prompt = PromptTemplate(
            template=template,
            input_variables=['context', 'question'])
        llm = RetrievalQA.from_chain_type(llm=llm,
                                            chain_type='stuff',
                                            retriever=retriever,
                                            return_source_documents=True,
                                            chain_type_kwargs={'prompt': prompt})
        print("loaded receiver")
        print("passing prompt to llm")
        print("prompt = " + promptStr)
        output = llm({'query': promptStr})
        result_text = output["result"]
        question_pattern = re.compile(r'\d+\.\s*(.*\?)')
        questions = question_pattern.findall(result_text)
        print(questions)
        print("done")

        threading.Thread(target=send_questions_http, args=(chat_type, user_id, questions, vector_db_path, job_title)).start()
        # Store the result in a text file
        # result_filename = f"result_{datetime.datetime.now().isoformat()}.txt"
        # with open(result_filename, "w", encoding="utf-8") as result_file:
        #     result_file.write(questions)
    except Exception as e:
        error_message = f"Error in chat_with_model: {e}\n"
        traceback_info = traceback.format_exc()
        error_message += f"Traceback:\n{traceback_info}"

        # Log the exception details to a file
        log_filename = "error_log.txt"
        with open(log_filename, "a", encoding="utf-8") as log_file:
            log_file.write(error_message)

        print(f"Error details written to {log_filename}")

def main(model_path, vector_db_path):
    chat_with_model(model_path, vector_db_path)

# Example usage
if __name__ == "__main__":
    model_path = os.environ['MODEL_PATH']
    parser = argparse.ArgumentParser(description="Process VECTOR_DB_PATH.")
    parser.add_argument("VECTOR_DB_PATH", help="Path to the vector database.")
    parser.add_argument("TYPE", help="type of thing you want to generate questions for.")
    parser.add_argument("prompt", help="prompt for chat agent")
    args = parser.parse_args()
    vector_db_path = args.VECTOR_DB_PATH
    TYPE = args.TYPE
    prompt = args.prompt
    main(prompt, TYPE ,model_path, vector_db_path)