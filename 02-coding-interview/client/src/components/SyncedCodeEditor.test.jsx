import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SyncedCodeEditor from './SyncedCodeEditor';

// Mock the Editor component
vi.mock('./Editor', () => ({
    default: ({ code, onChange }) => (
        <textarea
            data-testid="mock-editor"
            value={code}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

describe('SyncedCodeEditor', () => {
    let mockSocket;
    let mockOnChange;

    beforeEach(() => {
        mockSocket = {
            emit: vi.fn(),
            on: vi.fn(),
            off: vi.fn(),
        };
        mockOnChange = vi.fn();
    });

    it('renders correctly', () => {
        render(
            <SyncedCodeEditor
                code="initial code"
                onChange={mockOnChange}
                roomId="test-room"
                socket={mockSocket}
                language="javascript"
            />
        );
        expect(screen.getByTestId('mock-editor')).toBeInTheDocument();
        expect(screen.getByTestId('mock-editor')).toHaveValue('initial code');
    });

    it('joins the room on mount', () => {
        render(
            <SyncedCodeEditor
                code=""
                onChange={mockOnChange}
                roomId="test-room"
                socket={mockSocket}
                language="javascript" socket={mockSocket}
            />
        );
        expect(mockSocket.emit).toHaveBeenCalledWith('join-room', 'test-room');
    });

    it('emits code-change when user types', () => {
        render(
            <SyncedCodeEditor
                code=""
                onChange={mockOnChange}
                roomId="test-room"
                socket={mockSocket}
                language="javascript"
            />
        );

        const editor = screen.getByTestId('mock-editor');
        fireEvent.change(editor, { target: { value: 'new code' } });

        expect(mockOnChange).toHaveBeenCalledWith('new code');
        expect(mockSocket.emit).toHaveBeenCalledWith('code-change', {
            roomId: 'test-room',
            code: 'new code',
            language: 'javascript',
        });
    });

    it('updates code when receiving code-update event', () => {
        // We need to capture the callback passed to socket.on
        let codeUpdateCallback;
        mockSocket.on.mockImplementation((event, callback) => {
            if (event === 'code-update') {
                codeUpdateCallback = callback;
            }
        });

        render(
            <SyncedCodeEditor
                code=""
                onChange={mockOnChange}
                roomId="test-room"
                socket={mockSocket}
                language="javascript"
            />
        );

        expect(mockSocket.on).toHaveBeenCalledWith('code-update', expect.any(Function));

        // Simulate receiving an event
        if (codeUpdateCallback) {
            codeUpdateCallback({ code: 'updated code from server', language: 'javascript' });
        }

        expect(mockOnChange).toHaveBeenCalledWith('updated code from server');
    });
});
