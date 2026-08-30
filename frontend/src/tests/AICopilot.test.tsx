import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AICopilot from '../components/AICopilot';

// Mock the useMetrics hook
vi.mock('../hooks/useMetrics', () => ({
  useMetrics: () => ({
    refreshData: vi.fn(),
  })
}));

describe('AICopilot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders the floating action button initially', () => {
    render(<AICopilot />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('opens the chat window when the button is clicked', async () => {
    render(<AICopilot />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Vitality Agent')).toBeInTheDocument();
    expect(screen.getByText(/Hi! I'm your Vitality Agent/)).toBeInTheDocument();
  });

  it('sends a message and displays the agent response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'I have logged your meal!', actionType: 'LOG_METRIC', requiresRefresh: true })
    });

    render(<AICopilot />);
    // Open chat
    fireEvent.click(screen.getByRole('button'));
    
    const input = screen.getByPlaceholderText('Ask about your health...');
    await userEvent.type(input, 'I ate an apple');
    
    const submitButtons = screen.getAllByRole('button');
    const submitButton = submitButtons[submitButtons.length - 1]; // The send button
    
    fireEvent.click(submitButton);

    // Verify user message appears
    expect(screen.getByText('I ate an apple')).toBeInTheDocument();

    // Verify agent response appears after fetch
    await waitFor(() => {
      expect(screen.getByText('I have logged your meal!')).toBeInTheDocument();
      expect(screen.getByText('Nutrition Logged')).toBeInTheDocument(); // Triggered by LOG_METRIC
    });
  });

  it('displays an error message when API fails', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<AICopilot />);
    fireEvent.click(screen.getByRole('button'));
    
    const input = screen.getByPlaceholderText('Ask about your health...');
    await userEvent.type(input, 'test error');
    
    const submitButtons = screen.getAllByRole('button');
    const submitButton = submitButtons[submitButtons.length - 1];
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error connecting to the agent.')).toBeInTheDocument();
    });
  });
});
