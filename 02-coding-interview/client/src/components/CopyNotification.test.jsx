import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CopyNotification from './CopyNotification';

describe('CopyNotification', () => {
  it('does not render initially with trigger=0', () => {
    render(<CopyNotification trigger={0} />);
    expect(screen.queryByText('✅ Link copied!')).not.toBeInTheDocument();
  });

  it('renders when trigger is incremented', () => {
    render(<CopyNotification trigger={1} />);
    expect(screen.getByText('✅ Link copied!')).toBeInTheDocument();
  });

  it('has correct CSS class', () => {
    render(<CopyNotification trigger={1} />);
    const notification = screen.getByText('✅ Link copied!');
    expect(notification).toHaveClass('copy-notification');
  });

  it('re-renders when trigger value changes', () => {
    const { rerender } = render(<CopyNotification trigger={1} />);
    expect(screen.getByText('✅ Link copied!')).toBeInTheDocument();

    // Re-render with new trigger - should create new element with new key
    rerender(<CopyNotification trigger={2} />);
    expect(screen.getByText('✅ Link copied!')).toBeInTheDocument();
  });
});