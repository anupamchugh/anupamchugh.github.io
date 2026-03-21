import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Checkmate Academy',
  description: 'Privacy policy for the Checkmate Academy iOS app.',
};

export default function CheckmateAcademyPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="text-sm opacity-60">Last updated: March 21, 2026</p>
        <p>
          This privacy policy describes how <strong>Checkmate Academy</strong> ("the App"), a chess
          learning app built by Anupam Chugh, handles your information.
        </p>

        <h2>Data Storage</h2>
        <p>
          All your data — lesson progress, puzzle history, game records, and preferences — is stored
          entirely on your device using Apple SwiftData. Nothing is sent to external servers.
        </p>

        <h2>AI Coach</h2>
        <p>
          The App includes an AI coaching feature powered by Apple Foundation Models. All AI
          processing happens on-device. Your moves, positions, and game data are never sent to any
          cloud service or third-party AI provider.
        </p>

        <h2>No Account Required</h2>
        <p>
          The App does not require sign-in or account creation. There is no authentication system
          and no user accounts.
        </p>

        <h2>No Analytics or Advertising</h2>
        <p>
          The App does not include any analytics SDKs, advertising frameworks, or third-party
          tracking. We do not collect usage data, crash reports, or behavioral analytics.
        </p>

        <h2>No Network Requests</h2>
        <p>
          The App functions entirely offline. It does not make network requests for core
          functionality. The only network activity may occur during initial download of the app
          and its updates via the App Store.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Checkmate Academy is suitable for all ages. The App does not collect any personal
          information from any user, including children under 13.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. Changes will be posted on this page with
          an updated date.
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
