import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getAlphabeticalIndex } from '../lib/quiz-engine';
import HtmlContent from './html-content';

interface ChoiceOptionProps {
  html: string;
  idx: number;
  indicator?: boolean | null;
}

export default function ChoiceOption({
  html,
  idx,
  indicator = null,
}: ChoiceOptionProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        gap: 1.5,
        minHeight: 42,
        color: 'text.primary',
        width: '100%',
      }}
    >
      <Typography
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 28px',
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: 'rgba(37,99,235,0.1)',
          color: '#1d4ed8',
          fontWeight: 800,
        }}
      >
        {getAlphabeticalIndex(idx)}
      </Typography>
      <HtmlContent html={html} sx={{ flex: 1 }} />
      {indicator != null &&
        (indicator ? (
          <CheckCircleIcon color="success" aria-label="correct answer" />
        ) : (
          <CancelIcon color="error" aria-label="incorrect answer" />
        ))}
    </Stack>
  );
}
