# How to Implement Separation of Concerns in Salesforce

### The guide

**Read it at <a href="https://apex-enterprise-patterns.dev/" target="_blank">apex-enterprise-patterns.dev</a>** — seventeen chapters on Separation of Concerns in Salesforce and implementing it with the Apex Common Library. Every chapter has a companion video, and the whole thing is searchable.

Housed in this repo is also an older version of the <a href="https://github.com/Coding-With-The-Force/Salesforce_Separation_Of_Concerns/wiki" target="_blank">wiki</a>. The site above is the maintained version.

***

### The Example Code

There is also some example code showing you how an application (in this case a help desk app) in a Salesforce org might separate its concerns. If you reference the code while reading the guide it should aide considerably in learning how to leverage the Apex Common Library to implement Separation of Concerns in your Salesforce org.

***

### Working on the site

The chapters are Markdown. They live in `docs/`, one `.mdx` file each, and
that is where you edit them — the site is built from those files by
[Docusaurus](https://docusaurus.io/), which lives in `website/`.

```bash
cd website
npm install
npm start          # local dev server with hot reload
npm run build      # production build into website/build
npm run serve      # preview the production build
```

Pushing to `main` builds and deploys automatically — see
`.github/workflows/deploy.yml`.

**Writing a chapter.** Ordinary Markdown, plus a handful of components you can
drop in when the content calls for them. None of them need an import:

| Component | What it's for |
| --- | --- |
| `<YouTube id="…" />` | The companion video, in a responsive 16:9 wrapper |
| `<BeforeAfter>` | The with/without-the-library comparison |
| `<PatternCard>` | The catalogue entry on a pattern chapter |
| `<Steps>` / `<Manifest>` | Build-along steps on an implementation chapter |
| `<Figure>` / `<LayerDiagram>` | The architecture diagram |
| `<AnnotatedSource>` | Notes beside a pinned source file |
| `:::note` / `:::warning` | Callouts |

Chapter metadata — title, URL, video id, duration, which page template it
uses — lives in one place: `website/src/data/chapters.ts`. Adding or reordering
a chapter means editing that file and the chapter's `sidebar_position`.

***

### How to Submit Feedback for this repo

If you believe there is any information missing from this guide or that it needs more info in certain places, please submit an [issue on this repo here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/issues) and I'll add it ASAP!

### How to Say Thanks

If you enjoy this repo and would like to say thank you, feel free to [send a donation here](https://www.paypal.com/donate?business=RNHEF8ZWKKLDG&currency_code=USD)! But no pressure, I really just do this for fun!
