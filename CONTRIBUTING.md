# Contributing

Thanks for helping improve Create & Learn Python Quiz. This project is meant to stay useful for students, teachers, parents, and open-source contributors looking for a simple Python practice tool.

## Good Contributions

- Add or improve beginner and intermediate Python questions.
- Fix confusing explanations or answer choices.
- Improve accessibility, keyboard navigation, and responsive layout.
- Improve fixture validation, tests, or GitHub Pages deployment.
- Add teacher-friendly documentation or classroom usage notes.

## Question Contributions

Questions should be written for middle and high school learners. Keep prompts short, practical, and unambiguous.

Each source fixture entry should include:

- A stable unique `id`.
- A `level` from 1-4.
- `details.question` with simple HTML.
- At least two `details.choices`.
- At least one choice with `"correct": true`.
- A clear `details.explanation` that teaches the concept.
- Useful `details.tags` for search and organization.

Prefer practical Python examples over trivia. Avoid private student work, personal information, or copyrighted material you do not have permission to use.

## Code Contributions

1. Fork the repo.
2. Create a focused branch.
3. Make the smallest useful change.
4. Add or update tests when behavior changes.
5. Run the validation commands before opening a pull request:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Pull Request Notes

Please include:

- What changed.
- Why the change helps learners, teachers, or maintainers.
- Screenshots for visible UI changes.
- Question-bank notes for fixture changes.

Create & Learn may edit submitted questions for clarity, age fit, consistency, and curriculum alignment before merging.
