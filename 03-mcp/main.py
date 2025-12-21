from fastmcp import FastMCP
import requests
from typing import Optional

mcp = FastMCP("Demo 🚀")

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

def _download_web_page_impl(url: str) -> str:
    """
    Internal implementation for downloading web page content using Jina reader.
    
    Args:
        url: The URL of the web page to download (e.g., https://datatalks.club)
    
    Returns:
        The content of the web page in markdown format
    """
    try:
        # Construct the Jina reader URL
        jina_url = f"https://r.jina.ai/{url}"
        
        # Make the request to Jina reader
        response = requests.get(jina_url, timeout=30)
        response.raise_for_status()
        
        return response.text
        
    except requests.exceptions.RequestException as e:
        return f"Error downloading web page: {str(e)}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"

@mcp.tool
def download_web_page(url: str) -> str:
    """
    Download the content of any web page and convert it to markdown format using Jina reader.
    
    Args:
        url: The URL of the web page to download (e.g., https://datatalks.club)
    
    Returns:
        The content of the web page in markdown format
    """
    return _download_web_page_impl(url)

if __name__ == "__main__":
    mcp.run()
