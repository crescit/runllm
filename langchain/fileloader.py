"""
This script creates a database of information gathered from local text files.
"""
import os
import datetime
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.document_loaders import PyPDFLoader

# define what documents to load
#resumeLoader = DirectoryLoader(os.environ['RESUME_DIRECTORY'], glob="*.pdf", loader_cls=PyPDFLoader)
loader = DirectoryLoader(os.environ['JOB_DIRECTORY'], glob="*.txt")
# interpret information in the documents
documents = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500,
                                          chunk_overlap=50)
texts = splitter.split_documents(documents)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'})

# create and save the local database
db = FAISS.from_documents(texts, embeddings)
db.save_local("faiss_" + datetime.datetime.now().isoformat())
#print(db)

# llm = LlamaCpp(
#     model_path="/Users/josh/Documents/Projects/runllm/llm/llama.cpp/models/ggml-vicuna-7b-1.1-q4_1.bin",
#     temperature=0.75,
#     max_tokens=2000,
#     top_p=1,
#     callback_manager=callback_manager,
#     verbose=True,  # Verbose is required to pass to the callback manager
# )

# prompt = """
# Give me information about Josue Jaquez
# """

# llm(prompt)