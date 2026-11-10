import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Feedloom',
  description: 'Privacy policy for the Feedloom app on iPhone, iPad and Mac.',
};

export default function FeedloomPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — Feedloom</h1>
        <p className="text-sm opacity-60">Last updated: November 10, 2026</p>
        <p>
          Feedloom, built by Anupam Chugh, saves links and follows RSS feeds, with tagging, search
          and summaries written on your device. The developer runs no server for Feedloom and does
          not receive your library.
        </p>

        <h2>Your library and iCloud</h2>
        <p>
          Bookmarks, feeds, tags, notes and summaries are stored on your device and synced through
          your own private iCloud database, so they appear on your other devices. Only you can see
          that data; the developer cannot.
        </p>

        <h2>On your device</h2>
        <ul>
          <li>
            Tagging, search, digests, summaries and Ask your feed use Apple&apos;s on-device model.
            Feedloom calls no cloud AI service.
          </li>
          <li>A photo you attach in Ask is read on your device.</li>
          <li>
            Thumbs up and down in Reading uses the front camera only while you have it turned on.
            Your hand is read on the device and video stays there.
          </li>
          <li>Saved links are added to Spotlight on your device so you can search for them.</li>
          <li>
            The share extension passes the link you share to Feedloom on the same device.
          </li>
          <li>
            On Mac, Feedloom watches the clipboard for a link so the save shortcut can pick it up.
            It saves a link only when you press the shortcut. It can also import Threadmark files
            from a folder on your Mac.
          </li>
        </ul>

        <h2>What Feedloom fetches</h2>
        <ul>
          <li>
            <strong>Feeds:</strong> each feed you follow is fetched directly from its site,
            including in the background on iPhone and iPad so it stays fresh.
          </li>
          <li>
            <strong>Saved links:</strong> when you save a link, Feedloom fetches that page for its
            title and preview, and asks the site for its icon.
          </li>
        </ul>
        <p>
          Those sites see ordinary requests. Feedloom versions up to 1.0.4 asked Google&apos;s icon
          service for a site&apos;s icon when the site had none, which sends that site&apos;s domain
          to Google. Newer versions ask only the site.
        </p>

        <h2>Web search in Ask (off unless you turn it on)</h2>
        <p>
          If you turn on Search the web in Ask, Feedloom can look things up on Hacker News, GitHub,
          Reddit, Bluesky, Product Hunt, DuckDuckGo and any page you name. It sends the words of
          your question, and links you give or tap, to those public services, with no account and
          no cookies. Each source has its own switch. If you add a Product Hunt token, it is stored
          in your device&apos;s Keychain and sent only to Product Hunt.
        </p>

        <h2>What Feedloom does not do</h2>
        <p>
          Feedloom has no account, no in-app purchases or subscriptions, no advertising and no
          analytics or tracking SDKs, and it does not sell your data.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about Feedloom&apos;s privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
