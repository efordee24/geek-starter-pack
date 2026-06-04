# Prototype versions (metadata)

Each cut gets a folder here with a `VERSION.md` file — for example `prototypes/v1/VERSION.md`.

**This folder starts empty.** After pack setup, create the first version with the `gov-prototype-scaffold` skill or:

```bash
node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs "first cut"
```

Routable code is created under `src/server/versions/<version>/`. The dashboard at `/` lists versions once they exist.
