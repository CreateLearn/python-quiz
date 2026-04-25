import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';

import App from './app';
import questionsJson from './data/questions.json';
import { getAlphabeticalIndex, getCorrectIndexes } from './lib/quiz-engine';
import { parseQuizData } from './lib/schema';
import { STORAGE_KEY } from './lib/storage';

const quizData = parseQuizData(questionsJson);
const firstQuestion = quizData.courses[0].sessions[0].questions[0];
const firstCorrectIndexes = getCorrectIndexes(firstQuestion);
const correctAnswerLabel = `Correct answer: ${firstCorrectIndexes
  .map(getAlphabeticalIndex)
  .join(', ')}`;

function getFirstParagraphText(html: string): string {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element.querySelector('p')?.textContent?.trim() ?? '';
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('loads quiz content and answers a question', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /python quiz/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(getFirstParagraphText(firstQuestion.promptHtml)),
    ).toBeInTheDocument();

    await user.click(screen.getAllByRole('radio')[firstCorrectIndexes[0]]);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(correctAnswerLabel)).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"solved":true');
  });

  it('persists progress after rerendering', async () => {
    const user = userEvent.setup();
    const firstRender = render(<App />);

    await user.click(screen.getAllByRole('radio')[firstCorrectIndexes[0]]);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await screen.findByText(correctAnswerLabel);

    firstRender.unmount();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(correctAnswerLabel)).toBeInTheDocument();
    });
  });
});
