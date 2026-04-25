export interface QuizRoute {
  courseId: string;
  sessionId: string;
}

export function parseHashRoute(hash: string): Partial<QuizRoute> {
  const value = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(value);

  return {
    courseId: params.get('course') ?? undefined,
    sessionId: params.get('session') ?? undefined,
  };
}

export function formatHashRoute(route: QuizRoute): string {
  const params = new URLSearchParams({
    course: route.courseId,
    session: route.sessionId,
  });

  return `#${params.toString()}`;
}
