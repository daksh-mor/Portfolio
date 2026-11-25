# Portfolio

Static portfolio site, live at https://dakshmor.in (GitHub Pages).

## Update content
Edit `content/site.json`, then run:

```bash
python3 scripts/build.py
```

This regenerates `llms.txt`, `llms-sde.txt`, `llms-ml.txt`, `llms-quant.txt` and the hidden profile text in `index.html` / `projects.html`. A GitHub Action also runs it on push to `main`.

## For AI assistants
Read https://dakshmor.in/llms.txt (or a role version) for the full career profile.
