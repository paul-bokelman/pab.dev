This is a personal portfolio website that showcases my work, projects, and blog posts. It is built with React, Typescript, and NextJS.

Check out the live site [here](https://www.pab.dev/).

## The vault

This repo **is** an Obsidian vault called `pab.dev`. Two folders are content:

| folder      | becomes                          | route             |
| ----------- | -------------------------------- | ----------------- |
| `writings/` | the "recently written" section   | `/posts/<slug>`   |
| `projects/` | the "things i built" section     | external link     |

The slug is the filename, so `writings/genetic color.md` publishes to `/posts/genetic-color`.
Renaming a published note changes its URL.

### Publishing

Everything is a draft until you say otherwise. A note needs `published: true` in its
frontmatter to appear — without it there's no card, no route, and no static page.

Templates for both note types live in `templates/` (core Templates plugin, `Cmd-P → Insert template`).

```yaml
# writings/
title: ""       # card heading and page title
excerpt: ""     # the two-line description on the card
date: 2026-08-14
published: false
tags: [python]  # freeform, rendered as mono metadata
```

```yaml
# projects/
name: ""
description: ""
github: ""      # card links here...
website: ""     # ...unless this is set
order: 1        # lowest first
published: false
tags: [react, typescript]
```

Project note bodies are not rendered anywhere — they're scratch space.

### Obsidian markdown

Vault-only syntax is translated at build time (`src/lib/obsidian.ts`):

- `[[note]]`, `[[note|alias]]`, `[[note#heading]]` resolve against every published
  writing, then against project links. Anything unresolved renders as plain text
  rather than a dead link.
- `![[image.png]]` and `![[clip.mp4|caption]]` embed from `public/vault/`, which is
  where Obsidian is configured to drop attachments.
- `==highlight==`, `> [!callout]`, and `^block-ids` are handled.
- Embedding a whole note (`![[note]]`) becomes a link — a static page can't inline it.

Raw HTML in a note is treated as JSX, so use `className`, not `class`.

### Sync

The **Git** plugin is installed and configured to commit and push every 10 minutes,
pulling first. Vercel deploys on push, so writing in Obsidian publishes itself.

`Cmd-P → Git: Commit and push` if you don't want to wait.

Per-machine Obsidian state (`workspace.json`, caches, plugin data) is gitignored;
the vault config itself is committed so the setup travels with the repo.
