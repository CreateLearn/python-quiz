# Create & Learn Python Quiz

[![Deploy to GitHub Pages](https://github.com/CreateLearn/python-quiz/actions/workflows/pages.yml/badge.svg)](https://github.com/CreateLearn/python-quiz/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-19-149eca.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)

A standalone, static Python practice quiz inspired by the Create & Learn Python for AI curriculum. It runs entirely in the browser, stores learner progress in `localStorage`, and can be published directly with GitHub Pages.

Repository: [github.com/CreateLearn/python-quiz](https://github.com/CreateLearn/python-quiz)

## Features

- Browser-only React app with no backend, auth flow, or external API dependency.
- Beginner-friendly Python questions with immediate feedback and explanations.
- Four Python levels with single-answer questions and select-all-that-apply questions.
- Sanitized HTML prompts, choices, and explanations for formatted code examples.
- Versioned local progress storage with a learner-facing reset action.
- GitHub Pages deployment workflow included.

## Project Goals

- Help middle and high school learners practice beginner and intermediate Python concepts without needing an account.
- Make Python feel useful early by connecting quiz practice to AI, data science, games, apps, and independent student projects.
- Keep the project easy to fork, remix, review, and publish as a static site.
- Keep Create & Learn branding lightweight so the quiz experience stays first.

## Tech Stack

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [MUI](https://mui.com/)
- [Zod](https://zod.dev/)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [Vitest](https://vitest.dev/)

## Local Development

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Question Bank

The source question bank is the `python-quiz.json` fixture used by this project. The fixture currently contains 2,504 questions across levels 1-4 and three difficulty bands:

- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`

Fixture entries are flat records:

```json
{
  "id": "python-_2EIam_OWdMxXbUsqS7fPg-1-0",
  "level": 1,
  "sessions": [2],
  "details": {
    "tags": ["data_types_booleans_values", "operators_comparison"],
    "choices": [
      { "answer": "<p><code>True</code></p>", "correct": true },
      { "answer": "<p><code>False</code></p>", "correct": false }
    ],
    "question": "<p>What is the result?</p>",
    "difficulty": "BEGINNER",
    "explanation": "<p>Explain why the answer is correct.</p>"
  }
}
```

The app currently consumes normalized quiz data from `src/data/questions.json`. The UI groups questions by `level` only; fixture `sessions` values are retained as source metadata but are not used for learner navigation. Keep the normalized app data in sync when the fixture changes:

```json
{
  "courses": [
    {
      "id": "python-level-1",
      "title": "Level 1",
      "level": 1,
      "sessions": [
        {
          "id": "level-1",
          "title": "Level 1",
          "questions": [
            {
              "id": "python-_2EIam_OWdMxXbUsqS7fPg-1-0",
              "difficulty": "Beginner",
              "promptHtml": "<p>What is the result?</p>",
              "choices": [
                { "html": "<p><code>True</code></p>", "correct": true },
                { "html": "<p><code>False</code></p>", "correct": false }
              ],
              "explanationHtml": "<p>Explain why the answer is correct.</p>"
            }
          ]
        }
      ]
    }
  ]
}
```

Use this mapping when turning fixture entries into app data:

| Fixture field               | App field                                   |
| --------------------------- | ------------------------------------------- |
| `id`                        | `questions[].id`                            |
| `level`                     | `courses[].level`                           |
| `sessions[]`                | source metadata, not used for UI grouping   |
| `details.question`          | `promptHtml`                                |
| `details.choices[].answer`  | `choices[].html`                            |
| `details.choices[].correct` | `choices[].correct`                         |
| `details.difficulty`        | `difficulty`                                |
| `details.explanation`       | `explanationHtml`                           |
| `details.tags`              | source metadata for review and organization |

## Contributing Questions

Question contributions are welcome. Please contribute new or edited questions in the fixture shape above so the bank remains portable and easy to review.

Before opening a pull request:

1. Add or update entries in the source `python-quiz.json` fixture.
2. Give every question a stable, unique `id`.
3. Assign the correct `level`; include `sessions` when that metadata exists in the source bank.
4. Add useful `details.tags` so similar questions can be searched and grouped.
5. Provide at least two choices.
6. Mark at least one choice with `"correct": true`.
7. Include a concise `details.explanation` that teaches the concept, not just the answer.
8. Sync `src/data/questions.json` when the app data changes.
9. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before submitting.

Content guidelines:

- Write for middle and high school learners.
- Keep prompts short, specific, and age-appropriate.
- Prefer practical Python examples over trivia.
- Use realistic beginner code snippets and avoid unnecessarily tricky edge cases.
- Keep answer choices plausible but unambiguous.
- Use select-all-that-apply questions only when multiple correct answers genuinely help learning.
- Keep HTML simple: paragraphs, lists, inline code, and `pre`/`code` blocks are preferred.
- Do not include personal information, private student work, or copyrighted material without permission.

## Contributing Code

Bug fixes, accessibility improvements, tests, and static hosting improvements are welcome.

Recommended workflow:

1. Fork [CreateLearn/python-quiz](https://github.com/CreateLearn/python-quiz).
2. Create a branch for your change.
3. Make a focused update with tests when behavior changes.
4. Run the validation commands listed above.
5. Open a pull request with a short summary, screenshots for UI changes, and any question-bank notes.

Good first contribution areas:

- Improve confusing explanations.
- Add focused tests for quiz behavior or fixture validation.
- Improve keyboard navigation and screen reader behavior.
- Improve reduced-motion and responsive layout behavior.
- Improve GitHub Pages deployment docs.

## Data Validation Rules

- Every level needs at least one internal question group.
- Every internal question group needs at least one question.
- Every question needs at least two choices.
- Every question needs at least one correct choice.
- Multiple correct choices render as "select all that apply."
- HTML in prompts, choices, and explanations is sanitized before rendering.

## Progress Storage

Progress is stored under this versioned key:

```text
cl-python-quiz:v1:progress
```

Stored data includes selected level, per-question answers, solved state, first-seen timestamps, points awarded, and level scores. The in-app "Reset progress" button removes this key. If stored data is invalid or from an unsupported future version, the app starts with empty progress.

## Scoring

Each question starts at 60 points. One point is deducted for every 5 seconds after the learner first sees the question. The lowest score for a correct answer is 30 points.

## GitHub Pages

The included workflow in `.github/workflows/pages.yml` builds and deploys the `dist` directory to GitHub Pages whenever `main` is pushed.

For `CreateLearn/python-quiz`, the deployed base path should be:

```bash
BASE_PATH=/python-quiz/
```

For a custom domain or root deployment, use:

```bash
BASE_PATH=/
```

## Create & Learn Links

The app includes moderate Create & Learn branding and links to:

- https://www.create-learn.us/
- https://www.create-learn.us/python-for-kids
- https://www.create-learn.us/coding-for-kids/free-classes
- https://www.create-learn.us/coding-for-kids/python

## License

This project is available under the [MIT License](LICENSE).
