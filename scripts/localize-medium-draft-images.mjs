import fs from 'node:fs/promises';
import path from 'node:path';

const draftFiles = [
  'docs/_posts/2020-08-15-Epic-Games-Baits-Apple-To-Pull-Off-The-Biggest-Marketing-Campaign-In-Recent-History.md',
  'docs/_posts/2020-11-25-Apple-Is-Crushing-Deep-Links-That-Were-Used-As-Ad-Tracking-Devices.md',
  'docs/_posts/2021-02-02-Facebook-Is-Gaslighting-Users-Into-Allowing-Ad-Tracking-on-iOS-14.md',
  'docs/_posts/2021-02-26-Apple-vs-Facebook-Isn-t-Just-a-Matter-of-Privacy-But-Opposing-Business-Philosophies.md',
  'docs/_posts/2021-04-30-Mark-Zuckerberg-vs-Tim-Cook-Feud-A-War-of-Words-Over-iOS-14-s-App-Tracking-Transparency.md',
  'docs/_posts/2022-01-13-Big-Tech-s-2021-Year-Recap.md',
];

function postSlug(file) {
  return path
    .basename(file, '.md')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extensionFromUrl(url, contentType) {
  const fromPath = new URL(url).pathname.match(/\.(png|jpe?g|gif|webp)$/i)?.[1];
  if (fromPath) return fromPath.toLowerCase().replace('jpeg', 'jpg');
  if (contentType?.includes('png')) return 'png';
  if (contentType?.includes('gif')) return 'gif';
  if (contentType?.includes('webp')) return 'webp';
  return 'jpg';
}

function fallbackUrls(url) {
  const parsed = new URL(url);
  const pathName = parsed.pathname;
  return [
    url,
    `https://miro.medium.com${pathName}`,
    `https://miro.medium.com/v2/resize:fit:800/${path.basename(pathName)}`,
  ];
}

for (const file of draftFiles) {
  let content = await fs.readFile(file, 'utf8');
  const urls = [...new Set([...content.matchAll(/https:\/\/cdn-images-[^"\s)<>]+/g)].map((match) => match[0]))];
  if (!urls.length) continue;

  const slug = postSlug(file);
  const outputDir = path.join('public', 'medium', slug);
  await fs.mkdir(outputDir, { recursive: true });

  for (const [index, url] of urls.entries()) {
    let response = null;
    let resolvedUrl = url;

    for (const candidate of fallbackUrls(url)) {
      const candidateResponse = await fetch(candidate, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36',
          accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          referer: 'https://medium.com/',
        },
      });

      if (candidateResponse.ok) {
        response = candidateResponse;
        resolvedUrl = candidate;
        break;
      }
    }

    if (!response) {
      console.log(`skip ${url}`);
      continue;
    }

    const ext = extensionFromUrl(resolvedUrl, response.headers.get('content-type'));
    const assetPath = path.join(outputDir, `image-${index + 1}.${ext}`);
    const publicPath = `/${assetPath.replace(/^public\//, '')}`;

    try {
      await fs.access(assetPath);
    } catch {
      const bytes = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(assetPath, bytes);
    }

    content = content.split(url).join(publicPath);
    console.log(`${file}: ${url} -> ${publicPath}`);
  }

  await fs.writeFile(file, content);
}
