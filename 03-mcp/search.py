import os
import re
import argparse
from pathlib import Path
from minsearch import Index

def load_documents():
    """
    Load all .md and .mdx files from the fastmcp-main directory,
    strip the 'fastmcp-main/' prefix from filenames, and return
    a list of documents with content and filename fields.
    """
    documents = []
    base_path = Path("fastmcp-main")
    
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

def search_documents(query, index, num_results=5):
    """
    Search the index for the given query and return the top num_results documents.
    """
    results = index.search(query, num_results=num_results)
    return results

def main(query, num_results=5):
    """Main function to search for a specific query."""
    print("Loading documents...")
    documents = load_documents()
    
    print("Creating search index...")
    index = create_search_index(documents)
    
    print(f"\nSearching for: '{query}'")
    print("=" * 50)
    
    results = search_documents(query, index, num_results=num_results)
    
    if results:
        for i, result in enumerate(results, 1):
            print(f"{i}. {result.get('filename', 'Unknown file')}")
            # Show first 100 characters of content as preview
            content_preview = result.get('content', '')[:100].replace('\n', ' ').strip()
            print(f"   Preview: {content_preview}...")
            print()
    else:
        print("No results found.")
    
    return index, documents

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Search through FastMCP documentation")
    parser.add_argument("query", help="Search query to find relevant documents")
    parser.add_argument("-n", "--num-results", type=int, default=5, 
                       help="Number of results to return (default: 5)")
    
    args = parser.parse_args()
    
    index, documents = main(args.query, args.num_results)
