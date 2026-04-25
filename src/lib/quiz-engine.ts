import type { QuizQuestion } from './schema';

export function getCorrectIndexes(question: QuizQuestion): number[] {
  return question.choices.reduce<number[]>((indexes, choice, idx) => {
    if (choice.correct) {
      indexes.push(idx);
    }
    return indexes;
  }, []);
}

export function isMultiChoice(question: QuizQuestion): boolean {
  return getCorrectIndexes(question).length > 1;
}

export function areAnswersCorrect(
  selectedIndexes: number[],
  correctIndexes: number[],
): boolean {
  if (selectedIndexes.length !== correctIndexes.length) {
    return false;
  }

  const selected = new Set(selectedIndexes);
  return correctIndexes.every((idx) => selected.has(idx));
}

export function getPoints(firstSeenAt: number, now = Date.now()): number {
  const secondsPassed = Math.max(0, (now - firstSeenAt) / 1000);
  const deduction = Math.floor(secondsPassed / 5);
  return Math.max(30, 60 - deduction);
}

export function getAlphabeticalIndex(idx: number): string {
  return String.fromCharCode(65 + idx);
}
