"""
This script reads the database of information from local text files
and uses a large language model to answer questions about their content.
"""
import os
from langchain.llms import CTransformers
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate 
from langchain.chains import RetrievalQA

# prepare the template we will use when prompting the AI
template = """You are a manager at a mid to large size corporation. You are in charge of interviewing the candidate for jobs which you have the description for.
Context: {context}
Question: {question}
Take a deep breath and be polite.
Helpful answer:
"""
print("prepared template")
# load the language model
# TODO make this env var 
llm = CTransformers(model=os.environ['MODEL_PATH'],
                    model_type='llama',
                    config={'max_new_tokens': 256, 'temperature': 0.01})
print("loaded wizardlm")
# load the interpreted information from the local database
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'})
db = FAISS.load_local(os.environ['VECTOR_DB_PATH'], embeddings)
print("loaded resume db")
# prepare a version of the llm pre-loaded with the local content
retriever = db.as_retriever(search_kwargs={'k': 2})
prompt = PromptTemplate(
    template=template,
    input_variables=['context', 'question'])
qa_llm = RetrievalQA.from_chain_type(llm=llm,
                                     chain_type='stuff',
                                     retriever=retriever,
                                     return_source_documents=True,
                                     chain_type_kwargs={'prompt': prompt})
print("loaded receiver")
print("passing prompt to llm")
# ask the AI chat about information in our local files
prompt = "Give me information about the Apple jobs posted on Dec 27, 2023. Write ten questions for job candidates for these jobs."
output = qa_llm({'query': prompt})
print(output["result"])
print("done")