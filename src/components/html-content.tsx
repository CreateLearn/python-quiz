import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';

interface HtmlContentProps {
  html: string;
  sx?: SxProps<Theme>;
}

const htmlSx: SxProps<Theme> = {
  '& p': {
    marginTop: 0,
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-wrap',
  },
  '& p:last-child': {
    marginBottom: 0,
  },
};

export default function HtmlContent({ html, sx }: HtmlContentProps) {
  const sanitized = useMemo(() => DOMPurify.sanitize(html), [html]);

  return (
    <Box
      sx={Array.isArray(sx) ? [htmlSx, ...sx] : sx ? [htmlSx, sx] : htmlSx}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
