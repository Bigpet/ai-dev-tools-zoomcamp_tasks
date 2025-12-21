#!/usr/bin/env python3
"""
Simple demonstration of the web page downloader tool.
This shows how to use the function directly without MCP.
"""

from main import _download_web_page_impl

def main():
    """Demonstrate the web page downloader with a few examples."""
    
    print("Web Page Downloader Demo")
    print("=" * 40)
    
    # Example 1: Download the DataTalks.Club homepage
    print("\n1. Downloading DataTalks.Club...")
    result = _download_web_page_impl("https://datatalks.club")
    print(f"Downloaded {len(result)} characters")
    print("First 300 characters:")
    print(result[:300] + "..." if len(result) > 300 else result)
    
    # Example 2: Download a simple page
    print("\n2. Downloading example.com...")
    result = _download_web_page_impl("https://www.example.com")
    print(f"Downloaded {len(result)} characters")
    print("Content:")
    print(result)
    
    # Example 3: Show error handling
    print("\n3. Testing error handling...")
    result = _download_web_page_impl("https://invalid-domain-12345.com")
    print("Result:", result)

if __name__ == "__main__":
    main()
