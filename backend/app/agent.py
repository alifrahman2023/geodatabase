from duckduckgo_search import DDGS
import wikipedia
from pydantic_ai import Agent, RunContext
from dataclasses import dataclass
from pydantic import BaseModel, Field
import datetime
from dotenv import load_dotenv
import asyncio
from typing import List
load_dotenv()  # loads Gemini Key from env file 

@dataclass
class SearchDataclass:
    max_results: int
    todays_date: str

@dataclass
class ResearchDependencies:
    todays_date: str

class ResearchResult(BaseModel):
    research_title: str = Field(
        ..., 
        description="This is a top level Markdown heading that covers the topic of the query and answer; prefix it with #"
    )
    research_main: str = Field(
        ..., 
        description="This is a main section that provides answers for the query and research"
    )
    research_bullets: str = Field(
        ..., 
        description="This is a set of bulletpoints that summarize the answers for the query"
    )
    research_links: str = Field(
        ...,
        description=(
            "This is a list of links used for researching. For any links obtained via the search_wikipedia tool, "
            "use the standard format: 'https://en.wikipedia.org/wiki/{title_with_underscores_instead_of_spaces}'. "
            "Please seperate there links using new lines so I can correctly further process them."
        )
    )
# Create the agent with improved instructions in the system prompt.
search_agent = Agent(
    'google-gla:gemini-2.0-flash-lite',
    deps_type=ResearchDependencies,
    result_type=ResearchResult,
    system_prompt=(
        "You're a helpful research assistant and an expert in research. "
        "When given a question, you write strong keywords to perform 3-5 searches (each with a query_number) and then combine the results. "
        "You have two tools at your disposal: 'search_internet' and 'search_wikipedia'. "
        "Use 'search_wikipedia' when the query is educational, historical, or fact-based, and "
        "use 'search_internet' for news-oriented, time-sensitive, or opinion-based queries. "
        "If the query can benefit from both perspectives, include both search results in your final answer. "
        "Always keep the query concise for the most accurate search results."
    )
)
import time
import collections

# Global deque to track timestamps of requests in the last second.
REQUEST_TIMESTAMPS = collections.deque()

def rate_limit_request():
    # Remove timestamps older than 1 second.
    while REQUEST_TIMESTAMPS and time.time() - REQUEST_TIMESTAMPS[0] > 1:
        REQUEST_TIMESTAMPS.popleft()
    # If we have 20 or more requests in the last second, wait.
    if len(REQUEST_TIMESTAMPS) >= 20:
        sleep_time = 1 - (time.time() - REQUEST_TIMESTAMPS[0])
        time.sleep(sleep_time)
    REQUEST_TIMESTAMPS.append(time.time())
    

@search_agent.system_prompt
async def add_current_date(ctx: RunContext[ResearchDependencies]) -> str:
    todays_date = ctx.deps.todays_date
    system_prompt = (
        f"You're a helpful research assistant and an expert in research. "
        f"When given a question, you write strong keywords to perform 3-5 searches (each with a query_number) and then combine the results. "
        f"If you need today's date, it is {todays_date}."
    )
    return system_prompt

# Tool for searching the web using DuckDuckGo (news-oriented).
@search_agent.tool
def search_internet(search_data: RunContext[SearchDataclass], query: str, query_number: int):
    # Example: "What's the latest on the presidential election?"
    print("query by bot (internet):", query)
    max_results = search_data.deps.max_results
    rate_limit_request()
    return DDGS().text(query, max_results=max_results)

# Tool for searching Wikipedia (educational/historical).
@search_agent.tool
def search_wikipedia(search_data: RunContext[SearchDataclass], query: str, query_number: int):
    # Example: "Explain the history of the Roman Empire."
    print("query by bot (wikipedia):", query)
    max_results = search_data.deps.max_results
    rate_limit_request()
    search_results = wikipedia.search(query, results=max_results)
    res = {}
    for title in search_results:
        try:
            summary = wikipedia.summary(title)
            print(f"Title: {title}\nSummary: {summary}\n")
            res[title] = summary
        except wikipedia.exceptions.DisambiguationError as e:
            print(f"DisambiguationError: The term '{title}' may refer to multiple topics. Suggestions: {e.options}\n")
        except wikipedia.exceptions.PageError:
            print(f"PageError: The page '{title}' does not exist.\n")
            return 
    return res

async def research_bot(query):
    current_date = datetime.date.today()    
    date_string = current_date.strftime("%Y-%m-%d")
    # Use the same dependency type as defined in the agent.
    deps = SearchDataclass(max_results=5, todays_date=date_string)

    result =  await search_agent.run(query, deps=deps) 
    print(result.data.research_links)
    return f"{result.data.research_title} \n {result.data.research_main} \n {result.data.research_bullets}", result.data.research_links

# async def streaming_research_bot(query):
#     current_date = datetime.date.today()    
#     date_string = current_date.strftime("%Y-%m-%d")
#     # Use the same dependency type as defined in the agent.
#     deps = SearchDataclass(max_results=5, todays_date=date_string)
#     async with search_agent.run_stream(query, deps=deps) as message:
#         print("STREAMING:   ", message)
#         yield message
#     return 
        
# async def main():
#     await ask_the_bot("How has the geography of the United States Planes affected agriculture.")

# if __name__ == "__main__":
#     asyncio.run(main())
