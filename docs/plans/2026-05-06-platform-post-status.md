# platform post status

Source checked: local blog repo plus Medium export shortlist.

Policy direction: the repo should become the trusted home for everything, but production should only publish deliberately selected posts.

## already in `docs/_posts` and public unless changed

These posts are already backdated in the personal blog repo. They do not currently have `draft: true`, `private: true`, or `unlisted: true`, so the current site generator treats them as public.

| date | title | local slug |
|---|---|---|
| 2020-07-07 | Apple Is Killing a Billion-Dollar Ad Industry With One Popup | `/posts/Apple-Is-Killing-a-Billion-Dollar-Ad-Industry-With-One-Popup-2f83d182837f/` |
| 2020-07-23 | How Facebook's SDK Can Bring Apple's iOS Ecosystem Down Without a Single Line of Code | `/posts/How-Facebook-s-SDK-Can-Bring-Apple-s-iOS-Ecosystem-Down-Without-a-Single-Line-of-Code/` |
| 2020-12-17 | Facebook's Hypocrisy on Apple's New iOS 14 Privacy Feature | `/posts/Facebook-Hypocrisy-on-Apple-iOS14-Privacy-Feature/` |
| 2021-06-03 | Google Joins Apple to Cancel Facebook's Trillion-Dollar Empire Dream | `/posts/Google-Joins-Apple-to-Cancel-Facebook-s-Trillion-Dollar-Empire-Dream/` |
| 2021-06-11 | Apple Is Killing Email Read Receipts With a Single Popup | `/posts/Apple-Is-Killing-Email-Read-Receipts-With-a-Single-Popup/` |
| 2021-06-15 | With iOS 15, Apple Gives Us Strong Reasons to Ditch Google Services | `/posts/With-iOS-15--Apple-Gives-Us-Strong-Reasons-to-Ditch-Google-Services/` |

## imported as backdated drafts

These are now in `docs/_posts` with their original Medium dates and `draft: true`. They are in the repo for review, but the production generator should exclude them from live routes and public indexes.

| date | title | local file |
|---|---|---|
| 2020-08-15 | Epic Games Baits Apple To Pull Off The Biggest Marketing Campaign In Recent History | `docs/_posts/2020-08-15-Epic-Games-Baits-Apple-To-Pull-Off-The-Biggest-Marketing-Campaign-In-Recent-History.md` |
| 2020-11-25 | Apple Is Crushing Deep Links That Were Used As Ad-Tracking Devices | `docs/_posts/2020-11-25-Apple-Is-Crushing-Deep-Links-That-Were-Used-As-Ad-Tracking-Devices.md` |
| 2021-02-02 | Facebook Is Gaslighting Users Into Allowing Ad Tracking on iOS 14 | `docs/_posts/2021-02-02-Facebook-Is-Gaslighting-Users-Into-Allowing-Ad-Tracking-on-iOS-14.md` |
| 2021-02-26 | Apple vs. Facebook Isn't Just a Matter of Privacy - It's About Opposing Business Philosophies | `docs/_posts/2021-02-26-Apple-vs-Facebook-Isn-t-Just-a-Matter-of-Privacy-But-Opposing-Business-Philosophies.md` |
| 2021-04-30 | Mark Zuckerberg vs. Tim Cook Feud: A War of Words Over iOS 14's App Tracking Transparency | `docs/_posts/2021-04-30-Mark-Zuckerberg-vs-Tim-Cook-Feud-A-War-of-Words-Over-iOS-14-s-App-Tracking-Transparency.md` |
| 2022-01-13 | Big Tech's 2021 Year Recap | `docs/_posts/2022-01-13-Big-Tech-s-2021-Year-Recap.md` |

## recommended visibility model

- `vault`: imported into repo, never routed, never deployed as a page.
- `review`: converted to Markdown with metadata, still not routed publicly.
- `draft`: can be previewed locally, excluded from production.
- `published`: listed and live.
- `unlisted`: live by direct URL, not shown in writing indexes.

The current app only really supports `draft`/`private` filtering. Before importing everything, add a dedicated `content/imports/medium` or `content/archive/medium` vault path that is not read by `lib/posts.ts`.
