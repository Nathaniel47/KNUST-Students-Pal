import os
import logging
from dotenv import load_dotenv
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

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

# Increase chunk size to keep related info together
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
docs = text_splitter.split_documents(documents)
logger.info(f"Split documents into {len(docs)} chunks.")

# Use OpenAI embeddings
embeddings = OpenAIEmbeddings()

# Store in Chroma vector DB
db = Chroma.from_documents(docs, embeddings, persist_directory="./chroma_db")
logger.info("Saved documents to Chroma vector DB.")

# Load the DB
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

# Create retriever with more results
retriever = db.as_retriever(search_kwargs={"k": 10})

# Define LLM (GPT-3.5)
llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")

# Custom prompt template
prompt_template = """You are KNUST Students' Pal, a friendly and knowledgeable assistant for KNUST students created by two (2) 2025 final year KNUST Computer Science students as their final year project, Nathaniel Ankomah Aidoo and Justice Abban Korsi Jnr.Your job is to help students, staff, and visitors with questions about KNUST campus life, admissions, hostels, academics, and more.
Always answer in a helpful, approachable, and clear manner.
Use the context below to answer the user's question.
If you don’t find an exact answer, try to give a useful explanation based on the context.

Context:
{context}

Question: {question}
Answer:"""


prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])


# Set up conversation memory
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Build the conversational QA chain
qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    combine_docs_chain_kwargs={"prompt": prompt}
)

def get_bot_response(query: str, chat_history=None) -> str:
    logger.info(f"Received user query: {query}")
    try:
        # If chat_history is provided, update memory
        if chat_history is not None:
            memory.chat_memory.messages = chat_history
        # Log the retrieved documents for this query
        retrieved_docs = retriever.get_relevant_documents(query)
        logger.info(f"Retrieved {len(retrieved_docs)} documents for query: '{query}'")
        for i, doc in enumerate(retrieved_docs):
            logger.info(f"Doc {i+1}: {doc.page_content[:200]}...")  # Log first 200 characters
        # Get answer using the conversational QA chain (use .invoke to avoid deprecation warning)
        result = qa.invoke({"question": query, "chat_history": memory.chat_memory.messages})
        logger.info(f"LLM response: {result['answer']}")
        return result["answer"]
    except Exception as e:
        logger.error(f"Error during response generation: {str(e)}")
        return "Sorry, something went wrong while processing your request."

