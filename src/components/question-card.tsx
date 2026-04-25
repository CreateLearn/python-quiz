import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TerminalIcon from '@mui/icons-material/Terminal';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';

import {
  areAnswersCorrect,
  getAlphabeticalIndex,
  getCorrectIndexes,
  getPoints,
  isMultiChoice,
} from '../lib/quiz-engine';
import type { QuizQuestion } from '../lib/schema';
import type { QuestionProgress } from '../lib/storage';
import ChoiceOption from './choice-option';
import HtmlContent from './html-content';

interface QuestionCardProps {
  question: QuizQuestion;
  progress: QuestionProgress | undefined;
  position: number;
  total: number;
  onSeen: () => void;
  onAnswersChange: (answers: number[]) => void;
  onSolved: (answers: number[], points: number) => void;
}

export default function QuestionCard({
  question,
  progress,
  position,
  total,
  onSeen,
  onAnswersChange,
  onSolved,
}: QuestionCardProps) {
  const [error, setError] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const answers = progress?.answers ?? [];
  const solved = progress?.solved ?? false;
  const correctIndexes = useMemo(() => getCorrectIndexes(question), [question]);
  const multiChoice = useMemo(() => isMultiChoice(question), [question]);
  const questionProgress = total > 0 ? (position / total) * 100 : 0;

  useEffect(() => {
    onSeen();
  }, [onSeen, question.id]);

  useEffect(() => {
    setError(false);
    setShowIndicators(solved);
  }, [question.id, solved]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.25,
        minHeight: 480,
        border: '1px solid rgba(15,23,42,0.1)',
        borderRadius: 1,
        bgcolor: '#ffffff',
        boxShadow: '0 28px 60px -40px rgba(15, 23, 42, 0.65)',
        p: { xs: 2, md: 3 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', gap: 1.5 }}
      >
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Chip
            color="secondary"
            icon={<TerminalIcon />}
            label="Challenge"
          />
          <Chip color="info" label={question.difficulty} variant="outlined" />
          {multiChoice && <Chip color="warning" label="Select all" />}
        </Stack>
        <Stack sx={{ minWidth: { xs: '100%', sm: 160 }, gap: 0.75 }}>
          <Typography color="text.secondary" variant="body2">
            Question {position} of {total}
          </Typography>
          <LinearProgress
            aria-label="question position"
            variant="determinate"
            value={questionProgress}
            sx={{
              height: 7,
              borderRadius: 1,
              bgcolor: 'rgba(37,99,235,0.12)',
            }}
          />
        </Stack>
      </Stack>

      <Box
        sx={{
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          bgcolor: '#f8fbff',
          borderRadius: 1,
          px: { xs: 2, md: 2.5 },
          py: 2,
        }}
      >
        <HtmlContent html={question.promptHtml} sx={{ typography: 'h6' }} />
      </Box>

      <Box component="main" sx={{ overflowX: 'auto' }}>
        {multiChoice ? (
          <Stack sx={{ gap: 1 }}>
            <Typography variant="subtitle1">Select all that apply:</Typography>
            {question.choices.map((choice, idx) => (
              <FormControlLabel
                key={idx}
                disabled={solved}
                control={
                  <Checkbox
                    checked={answers.includes(idx)}
                    onChange={(event) => {
                      setError(false);
                      setShowIndicators(false);
                      const nextAnswers = event.target.checked
                        ? [...answers, idx]
                        : answers.filter((answer) => answer !== idx);
                      onAnswersChange(nextAnswers);
                    }}
                  />
                }
                label={
                  <ChoiceOption
                    idx={idx}
                    html={choice.html}
                    indicator={
                      showIndicators && answers.includes(idx)
                        ? choice.correct
                        : null
                    }
                  />
                }
                sx={{
                  alignItems: 'flex-start',
                  border: '1px solid',
                  borderColor: answers.includes(idx)
                    ? 'secondary.main'
                    : 'rgba(15,23,42,0.1)',
                  borderRadius: 1,
                  bgcolor: answers.includes(idx)
                    ? 'rgba(37,99,235,0.07)'
                    : '#ffffff',
                  m: 0,
                  px: 1.25,
                  py: 0.75,
                  transition:
                    'background-color 150ms ease, border-color 150ms ease, transform 150ms ease',
                  '&:hover': {
                    borderColor: solved ? 'rgba(15,23,42,0.1)' : 'secondary.main',
                    bgcolor: solved ? '#ffffff' : 'rgba(37,99,235,0.05)',
                    transform: solved ? 'none' : 'translateY(-1px)',
                  },
                  '& .MuiFormControlLabel-label': {
                    width: '100%',
                  },
                }}
              />
            ))}
          </Stack>
        ) : (
          <RadioGroup
            value={answers.length > 0 ? String(answers[0]) : ''}
            onChange={(_, value) => {
              setError(false);
              setShowIndicators(false);
              onAnswersChange([Number(value)]);
            }}
            sx={{ gap: 1 }}
          >
            {question.choices.map((choice, idx) => (
              <FormControlLabel
                key={idx}
                value={idx}
                control={<Radio />}
                disabled={solved}
                label={
                  <ChoiceOption
                    idx={idx}
                    html={choice.html}
                    indicator={
                      showIndicators && answers.includes(idx)
                        ? choice.correct
                        : null
                    }
                  />
                }
                sx={{
                  alignItems: 'flex-start',
                  border: '1px solid',
                  borderColor: answers.includes(idx)
                    ? 'secondary.main'
                    : 'rgba(15,23,42,0.1)',
                  borderRadius: 1,
                  bgcolor: answers.includes(idx)
                    ? 'rgba(37,99,235,0.07)'
                    : '#ffffff',
                  m: 0,
                  px: 1.25,
                  py: 0.75,
                  transition:
                    'background-color 150ms ease, border-color 150ms ease, transform 150ms ease',
                  '&:hover': {
                    borderColor: solved ? 'rgba(15,23,42,0.1)' : 'secondary.main',
                    bgcolor: solved ? '#ffffff' : 'rgba(37,99,235,0.05)',
                    transform: solved ? 'none' : 'translateY(-1px)',
                  },
                  '& .MuiFormControlLabel-label': {
                    width: '100%',
                  },
                }}
              />
            ))}
          </RadioGroup>
        )}
      </Box>

      <Collapse in={error}>
        <Alert severity="error" onClose={() => setError(false)}>
          Not quite. Give it another try.
        </Alert>
      </Collapse>

      <Collapse in={solved}>
        <Alert icon={<CheckCircleIcon />} severity="success">
          <AlertTitle>
            Correct answer:{' '}
            {correctIndexes.map((idx) => getAlphabeticalIndex(idx)).join(', ')}
          </AlertTitle>
          <HtmlContent html={question.explanationHtml} />
        </Alert>
      </Collapse>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
        <Button
          variant="contained"
          size="large"
          disabled={solved || answers.length === 0}
          onClick={() => {
            setShowIndicators(true);
            if (areAnswersCorrect(answers, correctIndexes)) {
              onSolved(answers, getPoints(progress?.firstSeenAt ?? Date.now()));
            } else {
              setError(true);
            }
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
