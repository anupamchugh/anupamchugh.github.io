import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Playlist Hunter',
  description: 'Privacy policy for the Playlist Hunter iOS app.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="text-sm opacity-60">Last updated: February 12, 2026</p>
        <p>
          This privacy policy describes how Playlist Hunter ("the App") handles your information.
        </p>

        <h2>What We Collect</h2>
        <p>
          <strong>Apple Sign-In:</strong> When you sign in with Apple, we receive your Apple ID token
          and optionally your name and email (if you choose to share them). This is used solely for
          account authentication via Supabase.
        </p>
        <p>
          <strong>AI Prompts:</strong> The text prompts you enter to generate playlists are sent to
          our AI proxy server for processing. Prompts are not stored or logged beyond the duration
          of the request.
        </p>
        <p>
          <strong>Purchase Data:</strong> In-app purchases are processed by Apple and RevenueCat.
          We receive anonymized purchase receipts to track your credit balance. We do not have
          access to your payment information.
        </p>

        <h2>What We Don't Collect</h2>
        <ul>
          <li>We do not collect your Apple Music listening history</li>
          <li>We do not track your location</li>
          <li>We do not sell or share personal data with third parties</li>
          <li>We do not use analytics or advertising SDKs</li>
        </ul>

        <h2>BYOK Mode</h2>
        <p>
          If you use your own API key (Bring Your Own Key mode), your key is stored locally in
          your device's Keychain. It is never transmitted to our servers. API calls go directly
          from your device to Anthropic's servers.
        </p>

        <h2>Data Storage</h2>
        <p>
          Authentication data is stored securely on Supabase with row-level security policies.
          Generated playlists are saved to your Apple Music library on-device — we do not store
          copies of your playlists.
        </p>

        <h2>Third-Party Services</h2>
        <ul>
          <li><strong>Supabase</strong> — authentication</li>
          <li><strong>RevenueCat</strong> — in-app purchase management</li>
          <li><strong>Apple MusicKit</strong> — music catalog search and playback</li>
          <li><strong>OpenAI / Anthropic</strong> — AI playlist generation</li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>
          The App is not directed at children under 13. We do not knowingly collect information
          from children under 13.
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
