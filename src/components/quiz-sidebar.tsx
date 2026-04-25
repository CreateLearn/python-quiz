import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CodeIcon from '@mui/icons-material/Code';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { QuizCourse, QuizSession } from '../lib/schema';

interface QuizSidebarProps {
  courses: QuizCourse[];
  course: QuizCourse;
  session: QuizSession;
  score: number;
  solvedCount: number;
  totalQuestions: number;
  onCourseChange: (courseId: string) => void;
  onSessionChange: (sessionId: string) => void;
  onReset: () => void;
}

export default function QuizSidebar({
  courses,
  course,
  session,
  score,
  solvedCount,
  totalQuestions,
  onCourseChange,
  onSessionChange,
  onReset,
}: QuizSidebarProps) {
  const progress = totalQuestions > 0 ? (solvedCount / totalQuestions) * 100 : 0;

  return (
    <Box
      component="aside"
      sx={{
        borderRadius: 1,
        background:
          'linear-gradient(180deg, #10233f 0%, #16325b 46%, #124432 100%)',
        boxShadow: '0 24px 56px -30px rgba(15, 23, 42, 0.9)',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      <Stack
        divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.16)' }} />}
        sx={{ gap: 2.5, p: { xs: 2.5, md: 3 } }}
      >
        <Box>
          <Typography sx={{ color: '#facc15' }} variant="overline">
            Create & Learn Lab
          </Typography>
          <Typography component="h1" variant="h3">
            Python Quiz
          </Typography>
          <Typography sx={{ color: 'rgba(248,250,252,0.76)', mt: 0.75 }}>
            Choose a session, answer at your pace, and keep your streak on this
            device.
          </Typography>
        </Box>

        <Stack sx={{ gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel
              id="course-label"
              sx={{
                color: 'rgba(248,250,252,0.82)',
                '&.Mui-focused': { color: '#facc15' },
              }}
            >
              Course
            </InputLabel>
            <Select
              labelId="course-label"
              label="Course"
              value={course.id}
              onChange={(event) => onCourseChange(event.target.value)}
              sx={{ bgcolor: 'rgba(255,255,255,0.96)' }}
            >
              {courses.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel
              id="session-label"
              sx={{
                color: 'rgba(248,250,252,0.82)',
                '&.Mui-focused': { color: '#facc15' },
              }}
            >
              Session
            </InputLabel>
            <Select
              labelId="session-label"
              label="Session"
              value={session.id}
              onChange={(event) => onSessionChange(event.target.value)}
              sx={{ bgcolor: 'rgba(255,255,255,0.96)' }}
            >
              {course.sessions.map((item, idx) => (
                <MenuItem key={item.id} value={item.id}>
                  {idx + 1}. {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack sx={{ gap: 1.5 }}>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Box
              sx={{
                flex: 1,
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.08)',
                p: 1.25,
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                <AutoAwesomeIcon sx={{ color: '#facc15', fontSize: 18 }} />
                <Typography
                  sx={{ color: 'rgba(248,250,252,0.72)' }}
                  variant="caption"
                >
                  Points
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {score}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.08)',
                p: 1.25,
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                <CodeIcon sx={{ color: '#86efac', fontSize: 18 }} />
                <Typography
                  sx={{ color: 'rgba(248,250,252,0.72)' }}
                  variant="caption"
                >
                  Solved
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {solvedCount}/{totalQuestions}
              </Typography>
            </Box>
          </Stack>
          <LinearProgress
            aria-label="quiz progress"
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'rgba(255,255,255,0.18)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#facc15',
              },
            }}
          />
          <Typography sx={{ color: 'rgba(248,250,252,0.72)' }} variant="body2">
            {solvedCount} of {totalQuestions} solved
          </Typography>
        </Stack>

        <Button
          color="inherit"
          startIcon={<RestartAltIcon />}
          variant="outlined"
          onClick={onReset}
          sx={{
            borderColor: 'rgba(255,255,255,0.35)',
            color: '#ffffff',
            '&:hover': {
              borderColor: '#ffffff',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Reset progress
        </Button>
      </Stack>
    </Box>
  );
}
