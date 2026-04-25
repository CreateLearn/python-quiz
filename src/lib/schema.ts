import { z } from 'zod';

export const choiceSchema = z.object({
  html: z.string().min(1),
  correct: z.boolean(),
});

export const questionSchema = z
  .object({
    id: z.string().min(1),
    difficulty: z.string().min(1),
    promptHtml: z.string().min(1),
    choices: z.array(choiceSchema).min(2),
    explanationHtml: z.string().min(1),
  })
  .refine((question) => question.choices.some((choice) => choice.correct), {
    message: 'Each question must have at least one correct choice.',
    path: ['choices'],
  });

export const sessionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  questions: z.array(questionSchema).min(1),
});

export const courseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
  sessions: z.array(sessionSchema).min(1),
});

export const quizDataSchema = z.object({
  courses: z.array(courseSchema).min(1),
});

export type QuizChoice = z.infer<typeof choiceSchema>;
export type QuizQuestion = z.infer<typeof questionSchema>;
export type QuizSession = z.infer<typeof sessionSchema>;
export type QuizCourse = z.infer<typeof courseSchema>;
export type QuizData = z.infer<typeof quizDataSchema>;

export function parseQuizData(data: unknown): QuizData {
  return quizDataSchema.parse(data);
}
