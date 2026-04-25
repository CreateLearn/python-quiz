# Create & Learn Python Quiz

A standalone, static Python practice quiz inspired by the Create & Learn Python for AI curriculum. It runs entirely in the browser, stores learner progress in `localStorage`, and can be published directly with GitHub Pages.

## Project Goals

- Help middle and high school learners practice beginner Python concepts without needing an account or backend.
- Make Python feel useful early by connecting quiz practice to AI, data science, games, apps, and independent student projects.
- Keep the project easy to fork, remix, and publish as a static GitHub Pages site.
- Promote Create & Learn with light branding and links while keeping the quiz experience first.

## Why Python?

Python is approachable for beginners and powerful enough for real-world work. Create & Learn's Python for AI pathway presents it as a text-based programming language for students in grades 5-12, with a focus on project-based learning and practical applications.

Students can use Python for:

- AI and machine learning experiments
- Data analysis for school, sports, science, and personal projects
- Web apps, games, automation scripts, and creative coding
- Programming fundamentals that transfer to JavaScript, Java, C++, and other languages

This project turns those early concepts into short practice questions with immediate feedback.

## Branding and Assets

The UI uses light Create & Learn branding and links back to the public Python class page:

- Python class page: https://www.create-learn.us/coding-for-kids/python
- Python class thumbnail: `https://cdn.create-learn.us/python/python4.jpg`

If you fork this outside Create & Learn, replace the thumbnail and brand links with assets you have rights to use.

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

## Open Source Contribution Notes

Contributions are welcome when they keep the project useful for beginner and intermediate students.

Good contribution areas:

- Add or improve Python question fixtures.
- Fix confusing explanations.
- Improve accessibility, keyboard navigation, and reduced-motion behavior.
- Improve static hosting and GitHub Pages setup.
- Add focused tests for quiz behavior or fixture validation.

Content guidelines:

- Keep questions short and age-appropriate for middle and high school learners.
- Prefer practical examples over trivia.
- Include clear explanations for every correct answer.
- Avoid collecting personal information or adding backend dependencies.
- Keep branding moderate; the quiz should remain the primary experience.

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
