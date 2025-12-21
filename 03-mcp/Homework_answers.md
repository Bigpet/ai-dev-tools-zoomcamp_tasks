# Model Context Protocol (MCP)

## Question 1: Create a New Project

> In `uv.lock`, what's the first hash in the `wheels` section of `fastmcp`? Include the entire string without quotes.

    { url = "https://files.pythonhosted.org/packages/1d/82/72401d09dc27c27fdf72ad6c2fe331e553e3c3646e01b5ff16473191033d/fastmcp-2.14.1-py3-none-any.whl", hash = "sha256:fb3e365cc1d52573ab89caeba9944dd4b056149097be169bce428e011f0a57e5", size = 412176, upload-time = "2025-12-15T02:26:25.356Z" },

## Question 2: FastMCP Transport

> You'll see the welcome screen. What's the transport?

> * STDIO 
> * HTTP
> * HTTPS
> * SSE

STDIO


## Question 3: Scrape Web Tool

> Test it to retrieve the content of `https://github.com/alexeygrigorev/minsearch`. How many characters does it return? 
> 
> * 1184
> * 9184
> * 19184
> * 29184
> 
> Select the closest answer if you don't get the exact match.

4. Downloading https://github.com/alexeygrigorev/minsearch...
Downloaded 9184 characters

## Question 4: Integrate the Tool

> Ask it the following:
> 
> ```
> Count how many times the word "data" appears on https://datatalks.club/
> Use available MCP tools for that
> ```
> 
> What's the answer?
> 
> * 61
> * 111
> * 161
> * 261
> 
> Select the closest answer if you don't get the exact match.

The word "data" appears 59 times on https://datatalks.club/

> * 61

## Question 5: Implement Search (2 points)

> What's the first file returned that you get with the query "demo"? 
> 
> * README.md
> * docs/servers/context.mdx
> * examples/testing_demo/README.md
> * docs/python-sdk/fastmcp-settings.mdx


## Question 6: Search Tool (ungraded)

> Now you can ask your assistant to implement it as a tool in main.py - and voila, you have a documentation search engine in your AI
> assistant!

