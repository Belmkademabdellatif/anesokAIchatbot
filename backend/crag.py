from langchain.output_parsers import PydanticOutputParser
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI,GoogleGenerativeAIEmbeddings
from langgraph.graph import END, StateGraph
from typing import Dict, TypedDict
from langchain.prompts import PromptTemplate
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document
from google.generativeai.types.safety_types import HarmBlockThreshold, HarmCategory
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

import os
from dotenv import load_dotenv

load_dotenv()
 
safety_settings = {
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT:HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH:HarmBlockThreshold.BLOCK_NONE
}

run_local = 'No'
google_api_key = os.environ.get('GOOGLE_API_KEY')


# Embed and index
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001", google_api_key=google_api_key
)
    
    
persist_directory = 'db'
      
vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embeddings)

retriever = vectorstore.as_retriever()


class GraphState(TypedDict):
    """
    Represents the state of our graph.

    Attributes:
        keys: A dictionary where each key is a string.
    """

    keys: Dict[str, any]

def retrieve(state):
    """
    Retrieve documents

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, documents, 
        that contains retrieved documents
    """
    print("---RETRIEVE---")
    state_dict = state["keys"]
    question = state_dict["question"]
    local = state_dict["local"]
    session = state_dict['session']
    
    documents = retriever.get_relevant_documents(question)
    print(documents)
    return {"keys": {"documents": documents, "local": local, 
            "question": question,"session":session}}

def generate(state):
    """
    Generate answer

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, generation, 
        that contains LLM generation
    """
    print("---GENERATE---")
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = state_dict["documents"]
    session = state_dict['session']

    # Prompt
    prompt = PromptTemplate.from_template(
    """
    Prompt:

    You are now operating as a therapy assistant. 
    Your role is to provide supportive and insightful responses to 
    individuals seeking guidance and assistance with their emotional 
    well-being. Engage empathetically and offer constructive advice
    based on the context provided.
    Your role is to provide supportive and insightful responses to
    {name}, who is currently {working_status} and {relation_status}.
    Consider {friend_intro} as part of the user's social context.
    Use the given question and context to craft a concise and
    helpful response , the response should be in Arabic language, 
    ensuring that the response is in markdown format.
    Keep your response kind to make the user more like to listen to you.
    Question: {question} 
    Context: {context} 
    Answer:
    """
    )
    
   
    llm = ChatGoogleGenerativeAI(model="gemini-pro",
                                google_api_key=google_api_key,
                                convert_system_message_to_human = True,
                                verbose = True,
                                safety_settings=safety_settings
    )
    
    
    # Chain
    rag_chain = prompt | llm | StrOutputParser()



    # combined_template = """The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

    # Current conversation:
    # {history}
    # Human: {input}
    # AI Assistant:

    # You are now operating as a therapy assistant. 
    # Your role is to provide supportive and insightful responses to 
    # individuals seeking guidance and assistance with their emotional 
    # well-being. Engage empathetically and offer constructive advice
    # based on the context provided.
    # Use the given question and context to craft a concise and
    # helpful response , the response should be in Arabic language, 
    # Keep your response kind to make the user more like to listen to you.
    # Question: {question} 
    # Context: {context} 
    # Answer:"""
    
    
    # COMBINED_PROMPT = PromptTemplate(input_variables=["history", "input", "question", "context"], template=combined_template)


    # conversation = ConversationChain(prompt=COMBINED_PROMPT,
    #     llm=llm, verbose=True, memory=ConversationBufferMemory()
    # )


    # Run
    generation = rag_chain.invoke({"context": documents, 
                                  "question": question,
                                  "name":session.username,
                                  "working_status":session.workingStatus,
                                  "relation_status":session.relationShipStatus,
                                  "friend_intro":session.bestFriendShortIntro})
    
    return {
        "keys": {"documents": documents, "question": question, 
                               "generation": generation,"session":session}
    }

def grade_documents(state):
    """
    Determines whether the retrieved documents are relevant to the question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with relevant documents
    """

    print("---CHECK RELEVANCE---")
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = state_dict["documents"]
    local = state_dict["local"]
    session = state_dict['session']

    # LLM
    llm = ChatGoogleGenerativeAI(model="gemini-pro",
                                google_api_key=google_api_key,
                                convert_system_message_to_human = True,
                                verbose = True,
                                safety_settings=safety_settings
    )
    # Data model
    class grade(BaseModel):
        """Binary score for relevance check."""

        score: str = Field(description="Relevance score 'yes' or 'no'")

    # Set up a parser + inject instructions into the prompt template.
    parser = PydanticOutputParser(pydantic_object=grade)

    from langchain_core.output_parsers import JsonOutputParser

    parser = JsonOutputParser(pydantic_object=grade)

    prompt = PromptTemplate(
        template="""You are a grader assessing relevance of a retrieved 
                     document to a user question. \n 
        Here is the retrieved document: \n\n {context} \n\n
        Here is the user question: {question} \n
        If the document contains keywords related to the user question, 
           grade it as relevant. \n
        It does not need to be a stringent test. The goal is to filter out 
        erroneous retrievals. \n
        Give a binary score 'yes' or 'no' score to indicate whether the 
        document is relevant to the question. \n
        Provide the binary score as a JSON with no premable or 
        explaination and use these instructons to format the output: 
        {format_instructions}""",
        input_variables=["query"],
        partial_variables={"format_instructions":
                  parser.get_format_instructions()},
    )

    chain = prompt | llm | parser

    # Score
    filtered_docs = []
    search = "No"  # Default do not opt for web search to supplement retrieval
    for d in documents:
        score = chain.invoke(
            {
                "question": question,
                "context": d.page_content,
                "format_instructions": parser.get_format_instructions(),
            }
        )
        grade = score["score"]
        if grade == "yes":
            print("---GRADE: DOCUMENT RELEVANT---")
            filtered_docs.append(d)
        else:
            print("---GRADE: DOCUMENT NOT RELEVANT---")
            search = "Yes"  # Perform web search
            continue

    return {
        "keys": {
            "documents": filtered_docs,
            "question": question,
            "local": local,
            "session":session,
            "run_web_search": search,
        }
    }

def transform_query(state):
    """
    Transform the query to produce a better question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates question key with a re-phrased question
    """

    print("---TRANSFORM QUERY---")
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = state_dict["documents"]
    local = state_dict["local"]
    session = state_dict['session']


    # Create a prompt template with format instructions and the query
    prompt = PromptTemplate(
        template="""You are generating questions that is well optimized for 
                    retrieval. \n 
        Look at the input and try to reason about the underlying sematic 
        intent / meaning. \n 
        the question will be in Arabic language , and you need to provide the Egnlish version of it
        Here is the initial question:
        \n ------- \n
        {question} 
        \n ------- \n
        Provide an improved question without any premable, only respond 
        with the updated question: """,
        input_variables=["question"],
    )

    # Grader
    # LLM
    llm = ChatGoogleGenerativeAI(model="gemini-pro",
                                google_api_key=google_api_key,
                                convert_system_message_to_human = True,
                                verbose = True,
                                safety_settings=safety_settings
    )
    # Prompt
    chain = prompt | llm | StrOutputParser()
    better_question = chain.invoke({"question": question})

    return {
        "keys": {"documents": documents, "question": better_question, 
        "local": local,"session":session}
    }

def web_search(state):
    """
    Web search based on the re-phrased question using Tavily API.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Web results appended to documents.
    """

    print("---WEB SEARCH---")
    state_dict = state["keys"]
    question = state_dict["question"]
    documents = state_dict["documents"]
    local = state_dict["local"]
    session = state_dict['session']
    
    try:
        tool = TavilySearchResults()
        docs = tool.invoke({"query": question})
        web_results = "\n".join([d["content"] for d in docs])
        web_results = Document(page_content=web_results)
        documents.append(web_results)
    except Exception as error:
        print(error)

    return {"keys": {"documents": documents, "local": local,
    "question": question,"session":session}}

def decide_to_generate(state):
    """
    Determines whether to generate an answer or re-generate a question 
    for web search.

    Args:
        state (dict): The current state of the agent, including all keys.

    Returns:
        str: Next node to call
    """

    print("---DECIDE TO GENERATE---")
    state_dict = state["keys"]
    question = state_dict["question"]
    filtered_documents = state_dict["documents"]
    search = state_dict["run_web_search"]

    if search == "Yes":
        # All documents have been filtered check_relevance
        # We will re-generate a new query
        print("---DECISION: TRANSFORM QUERY and RUN WEB SEARCH---")
        return "transform_query"
    else:
        # We have relevant documents, so generate answer
        print("---DECISION: GENERATE---")
        return "generate"

workflow = StateGraph(GraphState)

# Define the nodes
workflow.add_node("retrieve", retrieve)  # retrieve
workflow.add_node("grade_documents", grade_documents)  # grade documents
workflow.add_node("generate", generate)  # generatae
workflow.add_node("transform_query", transform_query)  # transform_query
workflow.add_node("web_search", web_search)  # web search

# Build graph
workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "grade_documents")
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {
        "transform_query": "transform_query",
        "generate": "generate",
    },
)
workflow.add_edge("transform_query", "web_search")
workflow.add_edge("web_search", "generate")
workflow.add_edge("generate", END)

# Compile
app = workflow.compile()