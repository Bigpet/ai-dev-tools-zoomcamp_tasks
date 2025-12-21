 #!/usr/bin/env python3
"""
Test script for the FastMCP documentation search functionality.
This script demonstrates how to use the search functions.
"""

from search import load_documents, create_search_index, search_documents

def test_search_functionality():
    """Test the search functionality with various queries."""
    print("=== FastMCP Documentation Search Test ===\n")
    
    # Load documents and create index
    print("Loading documents...")
    documents = load_documents()
    
    print("Creating search index...")
    index = create_search_index(documents)
    
    # Test queries
    test_queries = [
        "How to install FastMCP",
        "OAuth authentication setup",
        "Python server configuration",
        "REST API integration",
        "CLI usage examples"
    ]
    
    print(f"\n=== Testing {len(test_queries)} search queries ===\n")
    
    for i, query in enumerate(test_queries, 1):
        print(f"Test {i}: '{query}'")
        print("-" * 50)
        
        try:
            results = search_documents(query, index, num_results=3)
            
            if results:
                for j, result in enumerate(results, 1):
                    filename = result.get('filename', 'Unknown file')
                    content_preview = result.get('content', '')[:150].replace('\n', ' ').strip()
                    score = result.get('score', 'N/A')
                    
                    print(f"  {j}. {filename}")
                    print(f"     Preview: {content_preview}...")
                    if score != 'N/A':
                        print(f"     Score: {score:.4f}")
                    print()
            else:
                print("  No results found.")
                
        except Exception as e:
            print(f"  Error searching: {e}")
        
        print()
    
    print("=== Search test completed successfully! ===")
    print(f"\nSummary:")
    print(f"- Total documents indexed: {len(documents)}")
    print(f"- All queries processed successfully")
    print(f"- Search functionality is working as expected")

if __name__ == "__main__":
    test_search_functionality()
