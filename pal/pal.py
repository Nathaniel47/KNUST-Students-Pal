import os
import logging
from dotenv import load_dotenv
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    logger.warning("OPENAI_API_KEY not found in environment variables.")

# Load data
dataset_path = r"C:\Projects\KNUST-Students-Pal\pal\dataset.csv"
logger.info(f"Loading dataset from: {dataset_path}")

loader = CSVLoader(
    file_path=dataset_path,
    source_column="source",
    content_columns=["content"],
    encoding="utf-8"
)

documents = loader.load()
logger.info(f"Loaded {len(documents)} documents from CSV.")

# Split into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = text_splitter.split_documents(documents)
logger.info(f"Split documents into {len(docs)} chunks.")

# Use OpenAI embeddings
embeddings = OpenAIEmbeddings()

# Store in Chroma vector DB
db = Chroma.from_documents(docs, embeddings, persist_directory="./chroma_db")
logger.info("Saved documents to Chroma vector DB.")

# Load the DB
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

# Create retriever
retriever = db.as_retriever(search_kwargs={"k": 5})

# Define LLM (GPT-3.5)
llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")

# Custom prompt template
prompt_template = """You are a helpful assistant answering questions about KNUST.
Use the context below to answer the user's question.
If you don’t find an exact answer, try to give a useful explanation based on the context.

Context:
{context}

Question: {question}
Answer:"""


prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

# Build the QA chain
qa = RetrievalQA.from_chain_type(
    llm=llm, retriever=retriever, chain_type_kwargs={"prompt": prompt}
)

def get_bot_response(query: str) -> str:
    logger.info(f"Received user query: {query}")
    try:
        # Retrieve and log documents
        docs = retriever.get_relevant_documents(query)
        logger.info(f"Retrieved {len(docs)} documents:")
        for i, doc in enumerate(docs):
            logger.info(f"Doc {i+1}: {doc.page_content[:200]}...")  # Log first 200 characters

        # Get answer using the QA chain
        result = qa.invoke({"query":query})
        logger.info(f"LLM response: {result['result']}")
        return result["result"]
    except Exception as e:
        logger.error(f"Error during response generation: {str(e)}")
        return "Sorry, something went wrong while processing your request."

