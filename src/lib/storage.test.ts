import { beforeEach, describe, expect, it } from 'vitest';

import {
  STORAGE_KEY,
  createEmptyProgress,
  ensureQuestionSeen,
  getSessionKey,
  loadProgress,
  saveProgress,
  selectSession,
  setQuestionAnswers,
  solveQuestion,
} from './storage';

describe('progress storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and loads valid progress', () => {
    const progress = selectSession(createEmptyProgress(), 'course-1', 's1');
    saveProgress(progress);

    expect(loadProgress()).toMatchObject({
      selectedCourseId: 'course-1',
      selectedSessionId: 's1',
      version: 1,
    });
  });

  it('falls back to empty progress for invalid storage', () => {
    window.localStorage.setItem(STORAGE_KEY, '{"version":2}');

    expect(loadProgress()).toMatchObject({
      selectedCourseId: null,
      selectedSessionId: null,
      version: 1,
    });
  });

  it('persists answers and session score when a question is solved', () => {
    let progress = createEmptyProgress();
    progress = ensureQuestionSeen(progress, 'q1', 1_000);
    progress = setQuestionAnswers(progress, 'q1', [0]);
    progress = solveQuestion(progress, {
      courseId: 'course-1',
      sessionId: 's1',
      questionId: 'q1',
      answers: [0],
      points: 60,
    });

    expect(progress.questions.q1).toMatchObject({
      answers: [0],
      solved: true,
      pointsAwarded: 60,
    });
    expect(progress.scores[getSessionKey('course-1', 's1')]).toBe(60);
  });
});
