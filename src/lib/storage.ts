import { z } from 'zod';

export const STORAGE_KEY = 'cl-python-quiz:v1:progress';

const questionProgressSchema = z.object({
  answers: z.array(z.number().int().nonnegative()),
  firstSeenAt: z.number().int().positive(),
  solved: z.boolean(),
  pointsAwarded: z.number().int().nonnegative(),
});

const progressSchema = z.object({
  version: z.literal(1),
  selectedCourseId: z.string().nullable(),
  selectedSessionId: z.string().nullable(),
  scores: z.record(z.string(), z.number().int().nonnegative()),
  questions: z.record(z.string(), questionProgressSchema),
  updatedAt: z.number().int().positive(),
});

export type QuestionProgress = z.infer<typeof questionProgressSchema>;
export type QuizProgress = z.infer<typeof progressSchema>;

export function createEmptyProgress(): QuizProgress {
  return {
    version: 1,
    selectedCourseId: null,
    selectedSessionId: null,
    scores: {},
    questions: {},
    updatedAt: Date.now(),
  };
}

export function getSessionKey(courseId: string, sessionId: string): string {
  return `${courseId}:${sessionId}`;
}

export function loadProgress(storage: Storage = window.localStorage) {
  const rawValue = storage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return createEmptyProgress();
  }

  try {
    return progressSchema.parse(JSON.parse(rawValue));
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(
  progress: QuizProgress,
  storage: Storage = window.localStorage,
): QuizProgress {
  const next = {
    ...progress,
    updatedAt: Date.now(),
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearProgress(storage: Storage = window.localStorage): void {
  storage.removeItem(STORAGE_KEY);
}

export function selectSession(
  progress: QuizProgress,
  courseId: string,
  sessionId: string,
): QuizProgress {
  return {
    ...progress,
    selectedCourseId: courseId,
    selectedSessionId: sessionId,
  };
}

export function ensureQuestionSeen(
  progress: QuizProgress,
  questionId: string,
  now = Date.now(),
): QuizProgress {
  if (progress.questions[questionId]) {
    return progress;
  }

  return {
    ...progress,
    questions: {
      ...progress.questions,
      [questionId]: {
        answers: [],
        firstSeenAt: now,
        solved: false,
        pointsAwarded: 0,
      },
    },
  };
}

export function setQuestionAnswers(
  progress: QuizProgress,
  questionId: string,
  answers: number[],
): QuizProgress {
  const current = progress.questions[questionId] ?? {
    answers: [],
    firstSeenAt: Date.now(),
    solved: false,
    pointsAwarded: 0,
  };

  return {
    ...progress,
    questions: {
      ...progress.questions,
      [questionId]: {
        ...current,
        answers,
      },
    },
  };
}

export function solveQuestion(
  progress: QuizProgress,
  params: {
    courseId: string;
    sessionId: string;
    questionId: string;
    answers: number[];
    points: number;
  },
): QuizProgress {
  const current = progress.questions[params.questionId] ?? {
    answers: [],
    firstSeenAt: Date.now(),
    solved: false,
    pointsAwarded: 0,
  };
  const sessionKey = getSessionKey(params.courseId, params.sessionId);
  const previousPoints = current.solved ? current.pointsAwarded : 0;
  const nextScore =
    (progress.scores[sessionKey] ?? 0) - previousPoints + params.points;

  return {
    ...progress,
    scores: {
      ...progress.scores,
      [sessionKey]: Math.max(0, nextScore),
    },
    questions: {
      ...progress.questions,
      [params.questionId]: {
        ...current,
        answers: params.answers,
        solved: true,
        pointsAwarded: params.points,
      },
    },
  };
}
