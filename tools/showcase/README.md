# Showcase generator

Builds the client showcase that the blog serves at `/showcase/`. Output goes to `public/showcase/`, which the Next export copies as it is.

```bash
python3 -I tools/showcase/build.py              # write public/showcase/
python3 -I tools/showcase/build.py --out DIR    # write somewhere else, to diff against the published page
```

Needs `cwebp` and `sips` (macOS). Nothing else, and nothing outside this repo is read.

## Inputs

| File | What it is |
|---|---|
| `content/apps.json`, `public/app-icons/` | App names, store links, versions and icons. The page follows the App Store names here. |
| `build.py` | All page copy, order and the per-app screen lists. |
| `style.css`, `main.js` | Copied to `public/showcase/css` and `js`. `main.js` also holds the "Work with me" dialog (Esc closes it, focus is trapped and returned) and the floating action pane. |
| `contact-modal.html` | The dialog's markup. It only builds a mailto: draft in the visitor's own mail app; every "Work with me" link is also a plain `mailto:` link, so it works without scripts. |
| `src-assets/origins.json` | First-commit date and commit count behind each plate. |
| `src-assets/**` | Source images the build encodes itself (Glint renders and captures, and any screen added since 24 Oct 2026). |
| `provenance.json` | Source and date of every image. The build stops if an image has no entry or an entry has no image. It stays out of `public/`. |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | The product facts and design system behind the page. |

## Frozen images

An entry with `"frozen": true` was encoded on 24 Oct 2026 from a file outside this repo (an app's own screenshots folder, an Xcode preview). The build keeps the published `.webp` and copies it if the output folder differs. Every other image is encoded from the file its entry names, and comes out byte for byte the same each run.

To replace a frozen image: put the new PNG under `src-assets/`, change its entry's `source`, `date` and `date_basis`, set `"frozen": false`, and rebuild. To add a screen without adding a large PNG to the repo, encode it once (`cwebp -q 82 -resize 0 1100 <png> -o public/showcase/img/<name>.webp`), add an entry with `"frozen": true` that names the source and says how it was encoded, and use it in `build.py`.

## Proof that a rebuild changes nothing

```bash
python3 -I tools/showcase/build.py --out /tmp/showcase-check && diff -r public/showcase /tmp/showcase-check && echo identical
```

Run it on a clean checkout before editing anything. It should print `identical`.

## Not carried over from the old copy

The old working copy also held a 1440 px PDF export (`make_pdf.py`, `dist/`) and old review screenshots. They are not in the repo. The PDF can be rebuilt from the page if it is wanted again.

## Honesty rules the page keeps

See `PRODUCT.md`: no invented numbers, clients or reviews; unreleased apps stay on the "In the studio" shelf in frosted glass; Glint is shown read-only, with sample data labelled and only public Binance prices shown live.
