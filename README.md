# FreeTWAI public project directory

Source for a simple directory of the nine Freedom repositories. This repository's name can support an organization GitHub Pages site, but the current work **does not enable Pages or deploy a public site**.

With Node 24:

```sh
npm test
npm run build
```

The artifact is `dist/index.html`. Entries in `data/directory.json` link only to public GitHub source repositories and state the current limitations. The directory does not claim that a linked project is deployed, reviewed, official or commercially ready. It does not load Platform member sessions, private projects, API credentials or a second project database.

For an individual project's introduction page, use `freedom-project-page` with its checked public manifest. This source navigation list is not a copy of the canonical project registry or a signed-status service. Public release and hosting are separate decisions from building this artifact.
