import os
import datetime
import argparse
import subprocess
from langchain.llms import CTransformers
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate 
from langchain.chains import RetrievalQA

def chat_with_model(model_path, vector_db_path):
    try:
        # prepare the template we will use when prompting the AI
        template = """You are a manager at a mid to large size corporation. You are in charge of interviewing the candidate for jobs which you have the description for.
        Context: {context}
        Question: {question}
        Take a deep breath and be polite.
        Helpful answer:
        """
        print("prepared template")

        # load the language model
        llm = CTransformers(model=model_path,
                            model_type='llama',
                            config={'max_new_tokens': 256, 'temperature': 0.01})
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

        # ask the AI chat about information in our local files
        prompt = "Give me information about the Apple jobs posted on Dec 27, 2023. Write ten questions for job candidates for these jobs."
        print("prompt = " + prompt)
        output = llm({'query': prompt})
        result_text = output["result"]
        print(result_text)
        print("done")

        # Store the result in a text file
        result_filename = f"result_{datetime.datetime.now().isoformat()}.txt"
        with open(result_filename, "w", encoding="utf-8") as result_file:
            result_file.write(result_text)
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
    args = parser.parse_args()
    vector_db_path = args.VECTOR_DB_PATH
    main(model_path, vector_db_path)