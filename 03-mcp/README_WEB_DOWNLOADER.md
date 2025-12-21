# Web Page Downloader MCP Tool

This project implements an MCP (Model Context Protocol) tool for downloading web page content using Jina Reader API.

## Features

- Downloads any web page content and converts it to markdown format
- Uses Jina Reader API (`https://r.jina.ai/`) for reliable content extraction
- Proper error handling for network issues and invalid URLs
- Available as both MCP tool and standalone function

## Implementation

### MCP Tool Integration

The tool is implemented in `main.py` and registered with FastMCP:

```python
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
```

### Internal Implementation

The core functionality is separated into `_download_web_page_impl()` to enable testing:

```python
def _download_web_page_impl(url: str) -> str:
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
```

## Usage

### As MCP Tool

When running the MCP server (`python main.py`), the tool is available as `download_web_page` and can be called by AI assistants.

### Standalone Usage

You can also import and use the function directly:

```python
from main import _download_web_page_impl

content = _download_web_page_impl("https://datatalks.club")
print(content)
```

## Testing

### Comprehensive Tests

Run the comprehensive test suite:

```bash
python test.py
```

This tests:
- Multiple real websites (datatalks.club, example.com, github.com, python.org)
- Error handling with invalid URLs
- Content length validation

### Quick Demo

Run a simple demonstration:

```bash
python demo.py
```

## Dependencies

The project requires:
- `fastmcp>=2.14.1` - MCP framework
- `requests>=2.31.0` - HTTP requests library

## Examples

### Example 1: Download DataTalks.Club

```python
content = download_web_page("https://datatalks.club")
# Returns ~5658 characters of markdown content
```

### Example 2: Download Example.com

```python
content = download_web_page("https://www.example.com")
# Returns clean markdown content of the example page
```

### Example 3: Error Handling

```python
content = download_web_page("https://invalid-domain.com")
# Returns: "Error downloading web page: 400 Client Error: Bad Request..."
```

## How Jina Reader Works

Jina Reader provides a simple way to get clean, readable content from any URL:

1. You prefix any URL with `https://r.jina.ai/`
2. Jina fetches the page and extracts the main content
3. Returns clean markdown format with metadata

For example:
- Original: `https://datatalks.club`
- Jina URL: `https://r.jina.ai/https://datatalks.club`

## Error Handling

The tool handles various error conditions:
- Network timeouts (30 second timeout)
- HTTP errors (4xx, 5xx status codes)
- Invalid domains
- Connection issues

All errors return descriptive error messages starting with "Error:" or "Unexpected error:".
