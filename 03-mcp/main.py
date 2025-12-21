from fastmcp import FastMCP
import requests
from typing import Optional, List, Dict, Any
from pathlib import Path
from minsearch import Index
import os

mcp = FastMCP("Demo 🚀")

# Global variables for search functionality
_search_index = None
_search_documents = None

def load_documents():
    """
    Load all .md and .mdx files from the fastmcp-main directory,
    strip the 'fastmcp-main/' prefix from filenames, and return
    a list of documents with content and filename fields.
    """
    documents = []
    # Get absolute path relative to the script location
    script_dir = Path(__file__).parent
    base_path = script_dir / "fastmcp-main"
    
    if not base_path.exists():
        raise FileNotFoundError(f"Directory {base_path} not found. Make sure the zip file has been extracted.")
    
    # Find all .md and .mdx files
    for file_path in base_path.rglob("*.md"):
        documents.append(process_file(file_path, base_path))
    
    for file_path in base_path.rglob("*.mdx"):
        documents.append(process_file(file_path, base_path))
    
    print(f"Loaded {len(documents)} documents")
    return documents

def process_file(file_path, base_path):
    """Process a single file and return a document dictionary."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove the 'fastmcp-main/' prefix from the filename
        relative_path = str(file_path.relative_to(base_path))
        
        return {
            'content': content,
            'filename': relative_path
        }
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def create_search_index(documents):
    """
    Create and fit a minsearch index with the documents.
    Uses 'content' as the text field and 'filename' as a keyword field.
    """
    # Filter out None values from processing errors
    valid_docs = [doc for doc in documents if doc is not None]
    
    if not valid_docs:
        raise ValueError("No valid documents to index")
    
    # Create the index with content as text field and filename as keyword field
    index = Index(
        text_fields=['content'],
        keyword_fields=['filename']
    )
    
    # Fit the index with the documents
    index.fit(valid_docs)
    
    print(f"Index created with {len(valid_docs)} documents")
    return index

def initialize_search():
    """Initialize the search index and documents globally."""
    global _search_index, _search_documents
    
    if _search_index is None or _search_documents is None:
        print("Initializing search index...")
        _search_documents = load_documents()
        _search_index = create_search_index(_search_documents)
        print("Search initialization complete.")
    
    return _search_index, _search_documents

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

@mcp.tool
def search_mcp_documentation(query: str, num_results: int = 5) -> str:
    """
    Search through FastMCP documentation for relevant information.
    
    This tool searches through all .md and .mdx files in the fastmcp-main directory
    to find documentation relevant to your query.
    
    Args:
        query: Search query to find relevant documents (e.g., "how to create tools")
        num_results: Number of results to return (default: 5, max: 20)
    
    Returns:
        Formatted search results with filenames and content previews
    """
    try:
        # Validate num_results
        if num_results < 1:
            num_results = 1
        elif num_results > 20:
            num_results = 20
        
        # Initialize search index and documents
        index, documents = initialize_search()
        
        # Perform search
        results = index.search(query, num_results=num_results)
        
        if not results:
            return f"No results found for query: '{query}'"
        
        # Format results
        output_lines = [f"Search results for: '{query}'"]
        output_lines.append("=" * 50)
        
        for i, result in enumerate(results, 1):
            filename = result.get('filename', 'Unknown file')
            content = result.get('content', '')
            
            output_lines.append(f"{i}. {filename}")
            
            # Show first 200 characters of content as preview
            content_preview = content[:200].replace('\n', ' ').strip()
            if len(content) > 200:
                content_preview += "..."
            output_lines.append(f"   Preview: {content_preview}")
            output_lines.append("")
        
        return "\n".join(output_lines)
        
    except FileNotFoundError as e:
        return f"Documentation directory not found: {str(e)}"
    except Exception as e:
        return f"Error searching documentation: {str(e)}"

if __name__ == "__main__":
    mcp.run()
