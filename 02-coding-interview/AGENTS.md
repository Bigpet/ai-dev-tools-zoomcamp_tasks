Commit to git when finishing a task.

# Project State

The Online Coding Interview Platform is currently in an initial implementation phase.

## Documentation
-   [Testing Strategy](agent_info/testing.md): Details on how to run tests and the testing framework used.

## Features
-   **Real-time Code Synchronization**: Users in the same room see code changes in real-time (powered by Socket.IO).
-   **Syntax Highlighting**: Supports JavaScript and Python, switchable via a dropdown.
-   **Code Execution**:
    -   JavaScript code can be executed in the browser.
    -   Execution is isolated using Web Workers.
    -   Console logs are captured and displayed in the output pane.
