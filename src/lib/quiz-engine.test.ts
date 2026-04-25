import { describe, expect, it } from 'vitest';

import {
  areAnswersCorrect,
  getCorrectIndexes,
  getPoints,
  isMultiChoice,
} from './quiz-engine';
import type { QuizQuestion } from './schema';

const question: QuizQuestion = {
  id: 'q1',
  difficulty: 'Easy',
  promptHtml: '<p>Pick two.</p>',
  explanationHtml: '<p>Because.</p>',
  choices: [
    { html: 'A', correct: true },
    { html: 'B', correct: false },
    { html: 'C', correct: true },
  ],
};

describe('quiz engine', () => {
  it('finds correct indexes and multi-choice questions', () => {
    expect(getCorrectIndexes(question)).toEqual([0, 2]);
    expect(isMultiChoice(question)).toBe(true);
  });

  it('requires exact answer matches', () => {
    expect(areAnswersCorrect([2, 0], [0, 2])).toBe(true);
    expect(areAnswersCorrect([0], [0, 2])).toBe(false);
    expect(areAnswersCorrect([0, 1, 2], [0, 2])).toBe(false);
  });

  it('uses the 60-point time decay with a 30-point floor', () => {
    expect(getPoints(1_000, 1_000)).toBe(60);
    expect(getPoints(1_000, 11_000)).toBe(58);
    expect(getPoints(1_000, 1_000_000)).toBe(30);
  });
});
