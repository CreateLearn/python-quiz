import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SchoolIcon from '@mui/icons-material/School';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';

import questionsJson from './data/questions.json';
import { formatHashRoute, parseHashRoute } from './lib/hash-route';
import { parseQuizData } from './lib/schema';
import {
  clearProgress,
  createEmptyProgress,
  ensureQuestionSeen,
  getSessionKey,
  loadProgress,
  saveProgress,
  selectSession,
  setQuestionAnswers,
  solveQuestion,
  type QuizProgress,
} from './lib/storage';
import QuestionCard from './components/question-card';
import QuizSidebar from './components/quiz-sidebar';

const quizData = parseQuizData(questionsJson);

export default function App() {
  const initialRoute = parseHashRoute(window.location.hash);
  const [progress, setProgress] = useState<QuizProgress>(() => {
    const stored = loadProgress();
    return {
      ...stored,
      selectedCourseId: initialRoute.courseId ?? stored.selectedCourseId,
      selectedSessionId: initialRoute.sessionId ?? stored.selectedSessionId,
    };
  });
  const [questionIndex, setQuestionIndex] = useState(0);

  const selectedCourse =
    quizData.courses.find((course) => course.id === progress.selectedCourseId) ??
    quizData.courses[0];
  const selectedSession =
    selectedCourse.sessions.find(
      (session) => session.id === progress.selectedSessionId,
    ) ?? selectedCourse.sessions[0];
  const currentQuestion = selectedSession.questions[questionIndex];
  const sessionKey = getSessionKey(selectedCourse.id, selectedSession.id);
  const score = progress.scores[sessionKey] ?? 0;
  const solvedCount = useMemo(
    () =>
      selectedSession.questions.filter(
        (question) => progress.questions[question.id]?.solved,
      ).length,
    [progress.questions, selectedSession.questions],
  );

  const persistProgress = useCallback((nextProgress: QuizProgress) => {
    const saved = saveProgress(nextProgress);
    setProgress(saved);
  }, []);

  const chooseSession = useCallback(
    (courseId: string, sessionId: string) => {
      const nextProgress = selectSession(progress, courseId, sessionId);
      window.location.hash = formatHashRoute({ courseId, sessionId });
      persistProgress(nextProgress);
      setQuestionIndex(0);
    },
    [persistProgress, progress],
  );

  useEffect(() => {
    if (
      progress.selectedCourseId !== selectedCourse.id ||
      progress.selectedSessionId !== selectedSession.id
    ) {
      const nextProgress = selectSession(
        progress,
        selectedCourse.id,
        selectedSession.id,
      );
      window.history.replaceState(
        null,
        '',
        formatHashRoute({
          courseId: selectedCourse.id,
          sessionId: selectedSession.id,
        }),
      );
      persistProgress(nextProgress);
    }
  }, [persistProgress, progress, selectedCourse.id, selectedSession.id]);

  useEffect(() => {
    setQuestionIndex(0);
  }, [selectedCourse.id, selectedSession.id]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        backgroundImage:
          'linear-gradient(rgba(37,99,235,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(31,143,77,0.055) 1px, transparent 1px), linear-gradient(135deg, #f8fbff 0%, #f3f8f0 52%, #eef5ff 100%)',
        backgroundSize: '32px 32px, 32px 32px, auto',
      }}
    >
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid rgba(15,23,42,0.1)',
          bgcolor: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            py: 1.5,
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
            <Box
              aria-hidden
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 36,
                height: 36,
                borderRadius: 1,
                color: '#ffffff',
                bgcolor: '#12233f',
                boxShadow: 'inset 0 -4px 0 rgba(244,180,0,0.32)',
                fontWeight: 900,
              }}
            >
              py
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Python Skill Builder
              </Typography>
              <Typography color="text.secondary" variant="caption">
                by Create & Learn
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              flexWrap: 'wrap',
              typography: 'body2',
              '& a': {
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 700,
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': { color: 'primary.main' },
              },
            }}
          >
            <Link
              href="https://www.create-learn.us/python-for-kids"
              target="_blank"
            >
              Python classes
              <OpenInNewIcon sx={{ fontSize: 14 }} />
            </Link>
            <Link
              href="https://www.create-learn.us/coding-for-kids/free-classes"
              target="_blank"
            >
              Free classes
              <OpenInNewIcon sx={{ fontSize: 14 }} />
            </Link>
            <Link href="https://www.create-learn.us/" target="_blank">
              Main site
            </Link>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" component="main" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Stack direction="row" sx={{ gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip
                color="secondary"
                icon={<SchoolIcon />}
                label="Middle & high school"
                size="small"
              />
              <Chip
                color="warning"
                icon={<CodeIcon />}
                label="Beginner-friendly Python"
                size="small"
              />
            </Stack>
            <Typography component="h1" variant="h2">
              Practice Python like a coder.
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 680, mt: 0.75 }}
              variant="body1"
            >
              Build confidence with quick concept checks, instant feedback, and
              progress saved on this device.
            </Typography>
          </Box>
          <Box
            aria-hidden
            sx={{
              display: { xs: 'none', md: 'block' },
              minWidth: 252,
              borderRadius: 1,
              bgcolor: '#111827',
              color: '#f8fafc',
              boxShadow: '0 22px 48px -30px rgba(17,24,39,0.85)',
              p: 2,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 14,
            }}
          >
            <Typography
              component="div"
              sx={{ color: '#93c5fd', fontFamily: 'inherit', mb: 1 }}
            >
              {'>>> python_quiz.next()'}
            </Typography>
            <Typography
              component="div"
              sx={{ color: '#86efac', fontFamily: 'inherit' }}
            >
              {'score += practice'}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{ alignItems: 'flex-start', gap: 3 }}
        >
          <Box sx={{ width: { xs: '100%', md: 320 }, flex: '0 0 auto' }}>
            <QuizSidebar
              courses={quizData.courses}
              course={selectedCourse}
              session={selectedSession}
              score={score}
              solvedCount={solvedCount}
              totalQuestions={selectedSession.questions.length}
              onCourseChange={(courseId) => {
                const course =
                  quizData.courses.find((item) => item.id === courseId) ??
                  quizData.courses[0];
                chooseSession(course.id, course.sessions[0].id);
              }}
              onSessionChange={(sessionId) => {
                chooseSession(selectedCourse.id, sessionId);
              }}
              onReset={() => {
                clearProgress();
                const nextProgress = selectSession(
                  createEmptyProgress(),
                  selectedCourse.id,
                  selectedSession.id,
                );
                persistProgress(nextProgress);
                setQuestionIndex(0);
              }}
            />
          </Box>

          <Stack sx={{ flex: 1, width: '100%', gap: 2 }}>
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              progress={progress.questions[currentQuestion.id]}
              position={questionIndex + 1}
              total={selectedSession.questions.length}
              onSeen={() => {
                const nextProgress = ensureQuestionSeen(
                  progress,
                  currentQuestion.id,
                );
                if (nextProgress !== progress) {
                  persistProgress(nextProgress);
                }
              }}
              onAnswersChange={(answers) => {
                persistProgress(
                  setQuestionAnswers(progress, currentQuestion.id, answers),
                );
              }}
              onSolved={(answers, points) => {
                persistProgress(
                  solveQuestion(progress, {
                    courseId: selectedCourse.id,
                    sessionId: selectedSession.id,
                    questionId: currentQuestion.id,
                    answers,
                    points,
                  }),
                );
              }}
            />

            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', gap: 2 }}
            >
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                disabled={questionIndex === 0}
                onClick={() => setQuestionIndex((idx) => Math.max(0, idx - 1))}
              >
                Back
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                disabled={questionIndex === selectedSession.questions.length - 1}
                onClick={() =>
                  setQuestionIndex((idx) =>
                    Math.min(selectedSession.questions.length - 1, idx + 1),
                  )
                }
              >
                Next
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Box component="footer" sx={{ pb: 4 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              Open-source Python practice inspired by Create & Learn curriculum.
            </Typography>
            <Link
              href="https://github.com/CreateLearn/create-learn-python-quiz"
              target="_blank"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
            >
              <GitHubIcon fontSize="small" />
              GitHub
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
