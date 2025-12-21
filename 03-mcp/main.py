from fastmcp import FastMCP
import requests
from typing import Optional

mcp = FastMCP("Demo 🚀")

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

@mcp.tool
def count_word_occurrences(url: str, word: str, output_file: Optional[str] = None) -> str:
    """
    Count how many times a specific word appears on a web page and optionally save the result to a file.
    
    Args:
        url: The URL of the web page to analyze (e.g., https://datatalks.club)
        word: The word to count (case-insensitive, e.g., "data")
        output_file: Optional path to save the result (e.g., "result.txt"). If None, returns the result as string.
    
    Returns:
        A message indicating the count and whether it was saved to file
    """
    try:
        # Download the web page content
        content = _download_web_page_impl(url)
        
        if content.startswith("Error"):
            return content
        
        # Count word occurrences (case-insensitive)
        word_count = len([line for line in content.lower().split() if word.lower() in line])
        
        # More precise counting using regex-like approach
        import re
        pattern = r'\b' + re.escape(word) + r'\b'
        word_count = len(re.findall(pattern, content, re.IGNORECASE))
        
        result_message = f"The word '{word}' appears {word_count} times on {url}"
        
        # Save to file if output_file is provided
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(result_message)
                f.write(f"\n\nAnalysis performed on: {url}")
                f.write(f"\nWord searched: '{word}'")
                f.write(f"\nTotal occurrences: {word_count}")
                f.write(f"\n\nWeb page content:\n{content}")
            result_message += f"\nResult saved to: {output_file}"
        
        return result_message
        
    except Exception as e:
        return f"Error counting word occurrences: {str(e)}"

if __name__ == "__main__":
    mcp.run()
