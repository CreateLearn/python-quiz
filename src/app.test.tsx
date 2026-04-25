import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';

import App from './app';
import { STORAGE_KEY } from './lib/storage';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('loads sample quiz content and answers a question', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /python quiz/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Which line creates a variable/i)).toBeInTheDocument();

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Correct answer: A/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"solved":true');
  });

  it('persists progress after rerendering', async () => {
    const user = userEvent.setup();
    const firstRender = render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await screen.findByText(/Correct answer: A/i);

    firstRender.unmount();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Correct answer: A/i)).toBeInTheDocument();
    });
  });
});
