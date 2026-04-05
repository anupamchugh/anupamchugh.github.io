import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Feedloom',
  description: 'Privacy policy for the Feedloom iOS, macOS, and visionOS app.',
};

export default function FeedloomPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="text-sm opacity-60">Last updated: April 5, 2026</p>
        <p>
          This privacy policy describes how <strong>Feedloom</strong> ("the App"), built by Anupam
          Chugh, handles your information.
        </p>

        <h2>Data Storage</h2>
        <p>
          All your data — bookmarks, RSS feed subscriptions, tags, notes, and preferences — is
          stored locally on your device using Apple SwiftData. Nothing is stored on external servers.
        </p>

        <h2>iCloud Sync</h2>
        <p>
          The App uses Apple CloudKit to sync your data across your devices via your personal iCloud
          account. This data is stored in your <strong>private iCloud database</strong> and is
          accessible only to you. We have no access to your iCloud data.
        </p>

        <h2>On-Device Intelligence</h2>
        <p>
          AI features — including auto-tagging, smart search, and summaries — run entirely on-device
          using Apple Foundation Models. <strong>No data is sent to any AI service or cloud
          API.</strong> All processing happens on your iPhone, iPad, or Mac.
        </p>

        <h2>RSS Feeds</h2>
        <p>
          When you subscribe to RSS feeds, the App fetches publicly available feed content directly
          from the feed URL. No intermediary server is used. Feed URLs you subscribe to are stored
          locally and synced via iCloud.
        </p>

        <h2>Metadata Fetching</h2>
        <p>
          When you save a bookmark, the App fetches the page title, favicon, and Open Graph metadata
          directly from the URL. This is a standard HTTP request to the bookmarked website. No
          third-party service is involved.
        </p>

        <h2>No Account Required</h2>
        <p>
          The App does not require sign-in or account creation. There is no authentication system and
          no user accounts.
        </p>

        <h2>No Analytics or Advertising</h2>
        <p>
          The App does not include any analytics SDKs, advertising frameworks, or third-party
          tracking. We do not collect usage data.
        </p>

        <h2>In-App Purchases</h2>
        <p>
          Feedloom Pro is available as an auto-renewable subscription processed entirely through
          Apple's App Store. We do not collect or store any payment information.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          The App does not knowingly collect information from children under 13.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. Changes will be posted on this page with an
          updated date.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{' '}
          <a href="mailto:anupam.chugh@gmail.com">anupam.chugh@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
