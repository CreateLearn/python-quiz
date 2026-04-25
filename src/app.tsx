import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PsychologyIcon from '@mui/icons-material/Psychology';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
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
const pythonThumbnailUrl = 'https://cdn.create-learn.us/python/python4.jpg';

const pythonBenefits = [
  {
    icon: <PsychologyIcon />,
    label: 'A pathway to AI',
    text: 'Python is a real-world language that opens the door to artificial intelligence, data science, and modern computing.',
  },
  {
    icon: <DataObjectIcon />,
    label: 'Projects, not just syntax',
    text: 'Practice concepts that show up in games, animations, apps, data projects, and creative builds.',
  },
  {
    icon: <RocketLaunchIcon />,
    label: 'Built for grades 5-12',
    text: 'A friendly step into text-based coding for students ready to move beyond blocks and build confidence.',
  },
];

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
        color: '#102033',
        backgroundColor: '#f7fbff',
        backgroundImage:
          'linear-gradient(rgba(56,189,248,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.11) 1px, transparent 1px), radial-gradient(circle at 16% 10%, rgba(125,211,252,0.38), transparent 30%), radial-gradient(circle at 88% 16%, rgba(187,247,208,0.52), transparent 32%), linear-gradient(135deg, #f8fcff 0%, #eff8ff 46%, #f2fff7 100%)',
        backgroundSize: '36px 36px, 36px 36px, auto, auto, auto',
      }}
    >
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid rgba(37,99,235,0.12)',
          bgcolor: 'rgba(255,255,255,0.86)',
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
                color: '#0f172a',
                bgcolor: '#ffffff',
                border: '1px solid rgba(37,99,235,0.2)',
                boxShadow:
                  '0 0 26px rgba(56,189,248,0.24), inset 0 -4px 0 rgba(34,197,94,0.24)',
                fontWeight: 900,
              }}
            >
              py
            </Box>
            <Box>
              <Typography
                sx={{ color: '#102033', fontWeight: 900, lineHeight: 1.1 }}
              >
                Python Skill Builder
              </Typography>
              <Typography sx={{ color: '#52677f' }} variant="caption">
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
                color: '#1e3a8a',
                '&:hover': { color: '#1f8f4d' },
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
            mb: 2,
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
                label="Python for AI practice"
                size="small"
              />
            </Stack>
            <Typography component="h1" variant="h2">
              Practice Python for AI, data, and real projects.
            </Typography>
            <Typography
              sx={{ maxWidth: 720, mt: 0.75, color: '#3c5168' }}
              variant="body1"
            >
              Python is approachable enough for beginners and powerful enough
              for real-world work. Use these quick challenges to review
              fundamentals, strengthen text-based coding skills, and get ready
              for AI, data science, games, apps, and independent projects.
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'relative',
              width: 300,
              minWidth: 300,
              borderRadius: 1,
              bgcolor: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(37,99,235,0.16)',
              color: '#102033',
              boxShadow:
                '0 22px 48px -32px rgba(30,64,175,0.45), 0 0 36px rgba(56,189,248,0.18)',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={pythonThumbnailUrl}
              alt="Create & Learn Python for AI class thumbnail"
              sx={{
                display: 'block',
                width: '100%',
                aspectRatio: '16 / 10',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                borderTop: '1px solid rgba(37,99,235,0.14)',
                bgcolor: 'rgba(248,252,255,0.94)',
                p: 1.5,
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: '#2563eb',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: 13,
                  mb: 0.75,
                }}
              >
                {'>>> learn_python(real_world=True)'}
              </Typography>
              <Typography
                component="div"
                sx={{
                  color: '#15803d',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: 13,
                  mb: 0.75,
                }}
              >
                {'pathway = ["AI", "Data", "Apps"]'}
              </Typography>
              <Typography
                component="div"
                sx={{
                  color: '#fde68a',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: 13,
                }}
              >
                {'practice.unlock(projects)'}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
              borderRadius: 1,
              border: '1px solid rgba(37,99,235,0.16)',
              overflow: 'hidden',
              boxShadow: '0 18px 42px -34px rgba(37,99,235,0.45)',
            }}
          >
            <Box
              component="img"
              src={pythonThumbnailUrl}
              alt="Create & Learn Python for AI class thumbnail"
              sx={{
                display: 'block',
                width: '100%',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{ gap: 1.5, mb: 3 }}
        >
          {pythonBenefits.map((benefit) => (
            <Box
              key={benefit.label}
              sx={{
                flex: 1,
                border: '1px solid rgba(37,99,235,0.14)',
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.78)',
                boxShadow: '0 18px 42px -34px rgba(37,99,235,0.42)',
                p: 2,
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: 1,
                    color: '#15803d',
                    bgcolor: 'rgba(220,252,231,0.78)',
                    border: '1px solid rgba(34,197,94,0.18)',
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography sx={{ color: '#102033', fontWeight: 900 }}>
                  {benefit.label}
                </Typography>
              </Stack>
              <Typography sx={{ color: '#52677f', mt: 1 }} variant="body2">
                {benefit.text}
              </Typography>
            </Box>
          ))}
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
              color: '#52677f',
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
