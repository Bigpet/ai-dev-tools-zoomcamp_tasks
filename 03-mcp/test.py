#!/usr/bin/env python3
"""
Test script for the web page downloader functionality.
This script tests the download_web_page function directly.
"""

import sys
import os

# Add the current directory to Python path so we can import from main.py
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import _download_web_page_impl as download_web_page

def test_download_web_page():
    """Test the download_web_page function with various URLs."""
    
    print("Testing web page downloader...")
    print("=" * 50)
    
    # Test cases
    test_urls = [
        "https://datatalks.club",
        "https://www.example.com",
        "https://github.com",
        "https://www.python.org"
    ]
    
    for i, url in enumerate(test_urls, 1):
        print(f"\nTest {i}: {url}")
        print("-" * 30)
        
        try:
            result = download_web_page(url)
            
            # Check if we got an error
            if result.startswith("Error") or result.startswith("Unexpected error"):
                print(f"❌ Failed: {result}")
            else:
                # Check if we got some content
                if len(result) > 100:
                    print(f"✅ Success: Downloaded {len(result)} characters")
                    print(f"Preview: {result[:200]}...")
                else:
                    print(f"⚠️  Warning: Got content but it's very short ({len(result)} characters)")
                    print(f"Content: {result}")
                    
        except Exception as e:
            print(f"❌ Exception occurred: {str(e)}")
    
    print("\n" + "=" * 50)
    print("Testing completed!")

def test_invalid_url():
    """Test with an invalid URL to ensure error handling works."""
    print("\nTesting error handling with invalid URL...")
    print("-" * 50)
    
    invalid_url = "https://this-domain-does-not-exist-12345.com"
    result = download_web_page(invalid_url)
    
    if "Error" in result:
        print(f"✅ Error handling works: {result}")
    else:
        print(f"⚠️  Expected error but got: {result[:100]}...")

if __name__ == "__main__":
    test_download_web_page()
    test_invalid_url()
