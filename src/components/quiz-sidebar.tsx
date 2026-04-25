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

import type { QuizCourse } from '../lib/schema';

interface QuizSidebarProps {
  courses: QuizCourse[];
  course: QuizCourse;
  score: number;
  solvedCount: number;
  totalQuestions: number;
  onCourseChange: (courseId: string) => void;
  onReset: () => void;
}

export default function QuizSidebar({
  courses,
  course,
  score,
  solvedCount,
  totalQuestions,
  onCourseChange,
  onReset,
}: QuizSidebarProps) {
  const progress =
    totalQuestions > 0 ? (solvedCount / totalQuestions) * 100 : 0;

  return (
    <Box
      component="aside"
      sx={{
        borderRadius: 1,
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(239,248,255,0.94) 48%, rgba(240,253,244,0.94) 100%)',
        border: '1px solid rgba(37,99,235,0.14)',
        boxShadow: '0 24px 56px -34px rgba(37, 99, 235, 0.48)',
        color: '#102033',
        overflow: 'hidden',
      }}
    >
      <Stack
        divider={<Divider sx={{ borderColor: 'rgba(37,99,235,0.12)' }} />}
        sx={{ gap: 2.5, p: { xs: 2.5, md: 3 } }}
      >
        <Box>
          <Typography
            sx={{ color: '#2563eb', fontWeight: 900 }}
            variant="overline"
          >
            Create & Learn Lab
          </Typography>
          <Typography component="h1" variant="h3">
            Python Quiz
          </Typography>
          <Typography sx={{ color: '#52677f', mt: 0.75 }}>
            Choose a level, answer at your pace, and keep your streak on this
            device.
          </Typography>
        </Box>

        <Stack sx={{ gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel
              id="course-label"
              sx={{
                color: '#52677f',
                '&.Mui-focused': { color: '#2563eb' },
              }}
            >
              Level
            </InputLabel>
            <Select
              labelId="course-label"
              label="Level"
              value={course.id}
              onChange={(event) => onCourseChange(event.target.value)}
              sx={{ bgcolor: '#ffffff' }}
            >
              {courses.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.title}
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
                border: '1px solid rgba(37,99,235,0.12)',
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.72)',
                p: 1.25,
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                <AutoAwesomeIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                <Typography sx={{ color: '#52677f' }} variant="caption">
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
                border: '1px solid rgba(34,197,94,0.14)',
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.72)',
                p: 1.25,
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                <CodeIcon sx={{ color: '#15803d', fontSize: 18 }} />
                <Typography sx={{ color: '#52677f' }} variant="caption">
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
              bgcolor: 'rgba(37,99,235,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#1f8f4d',
              },
            }}
          />
          <Typography sx={{ color: '#52677f' }} variant="body2">
            {solvedCount} of {totalQuestions} solved
          </Typography>
        </Stack>

        <Button
          color="inherit"
          startIcon={<RestartAltIcon />}
          variant="outlined"
          onClick={onReset}
          sx={{
            borderColor: 'rgba(37,99,235,0.22)',
            color: '#1e3a8a',
            '&:hover': {
              borderColor: '#2563eb',
              bgcolor: 'rgba(37,99,235,0.06)',
            },
          }}
        >
          Reset progress
        </Button>
      </Stack>
    </Box>
  );
}
