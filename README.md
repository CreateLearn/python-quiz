# Create & Learn Python Quiz

A standalone, static Python practice quiz inspired by the Create & Learn Python curriculum. It runs entirely in the browser, stores learner progress in `localStorage`, and can be published directly with GitHub Pages.

## Local Development

```bash
npm install
npm run dev
```

The app uses Vite, React, TypeScript, MUI, Zod, and DOMPurify. There is no backend, API, auth flow, or generated GraphQL code.

Useful commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Adding Questions

Replace or expand `src/data/questions.json`. `src/data/questions.sample.json` documents the same structure with placeholder content.

Fixture shape:

```json
{
  "courses": [
    {
      "id": "python-foundations",
      "title": "Python Foundations",
      "level": 1,
      "sessions": [
        {
          "id": "session-1",
          "title": "Variables and Values",
          "questions": [
            {
              "id": "question-id",
              "difficulty": "Easy",
              "promptHtml": "<p>Question prompt</p>",
              "choices": [
                { "html": "<code>answer</code>", "correct": true },
                { "html": "distractor", "correct": false }
              ],
              "explanationHtml": "<p>Why the answer is correct.</p>"
            }
          ]
        }
      ]
    }
  ]
}
```

Rules:

- Every course needs at least one session.
- Every session needs at least one question.
- Every question needs at least two choices.
- Every question needs at least one correct choice.
- Multiple correct choices automatically render as "select all that apply."
- HTML is allowed in prompts, choices, and explanations, then sanitized before rendering.

## Progress Storage

Progress is stored under this versioned key:

```text
cl-python-quiz:v1:progress
```

Stored data includes selected course/session, per-question answers, solved state, first-seen timestamps, points awarded, and session scores. The in-app "Reset progress" button removes this key. If the stored data is invalid or from an unsupported future version, the app starts with empty progress.

## Scoring

Each question starts at 60 points. One point is deducted for every 5 seconds after the learner first sees the question. The lowest score for a correct answer is 30 points.

## GitHub Pages

The included workflow in `.github/workflows/pages.yml` builds and deploys the `dist` directory to GitHub Pages whenever `main` is pushed.

The workflow sets:

```bash
BASE_PATH=/create-learn-python-quiz/
```

If the repository name changes, update `BASE_PATH` in the workflow. For a custom domain or root deployment, use `BASE_PATH=/`.

## Create & Learn Links

The app includes moderate Create & Learn branding and links to:

- https://www.create-learn.us/
- https://www.create-learn.us/python-for-kids
- https://www.create-learn.us/coding-for-kids/free-classes
