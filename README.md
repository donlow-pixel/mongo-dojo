# Mongo Dojo

An interactive browser game for practising MongoDB shell (CRUD) syntax. Learners type real commands; a small in-memory imitation of the Mongo shell runs them and grades the resulting data.

Four chapters, 33 steps:

1. Create & insert (`use`, `insertOne`, `insertMany`, arrays, `ISODate`)
2. Update & delete (`updateOne` + `$set`, `deleteOne`)
3. Arrays & sub-documents (`$push`, `$pull`, `$elemMatch`, positional `$`, `arrayFilters`, `$unset`)
4. Final mission: build and maintain the `fake_school` database with no lesson notes

## Run locally

It is a static site with no build step. Open `index.html` directly, or serve the folder:

```bash
python -m http.server 5173
```

## Deploy to Vercel

Push this folder to a GitHub repository, then in Vercel choose **Add New > Project**, import the repository and deploy. Leave the framework preset as "Other" and the build command empty.

## Editing the course

- `js/lessons.js` holds every chapter, lesson note, prompt, hint and model answer.
- `js/engine.js` is the mock shell (supported methods and operators).
- `js/app.js` is the UI, scoring and saved progress (kept in the browser's `localStorage`).
