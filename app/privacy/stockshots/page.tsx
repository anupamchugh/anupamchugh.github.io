import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — StockShots',
  description: 'Privacy policy for the StockShots iOS app.',
};

export default function StockShotsPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="text-sm opacity-60">Effective date: April 27, 2026</p>
        <p>
          This privacy policy describes how <strong>StockShots</strong> ("the App"), built by Anupam
          Chugh, handles your information.
        </p>

        <h2>Data Collection</h2>
        <p>
          StockShots collects minimal, anonymous usage analytics through{' '}
          <a href="https://telemetrydeck.com/privacy" target="_blank" rel="noopener noreferrer">
            TelemetryDeck
          </a>
          , a privacy-focused analytics service. TelemetryDeck does not collect personal data,
          device identifiers, or IP addresses. Analytics are used solely to understand app usage
          patterns and improve the experience.
        </p>
        <p>
          If you enable push notifications, the App stores your device token with Apple Push
          Notification Service to deliver market alerts. This is entirely optional.
        </p>
        <p>
          No personal information is collected. No login or account creation is required for the
          free tier. Bug reports and feedback are voluntary and may include user-provided text.
        </p>

        <h2>Data Storage</h2>
        <p>
          All market data displayed in the App is fetched from publicly available sources, including
          Yahoo Finance and NSE. No user trading data, portfolio information, or financial records
          are stored on our servers or transmitted to third parties.
        </p>

        <h2>Third-Party Services</h2>
        <p>The App uses the following third-party services:</p>
        <ul>
          <li>
            <strong>TelemetryDeck</strong> — anonymous usage analytics (
            <a href="https://telemetrydeck.com/privacy" target="_blank" rel="noopener noreferrer">
              privacy policy
            </a>
            )
          </li>
          <li>
            <strong>Yahoo Finance</strong> — public market data
          </li>
          <li>
            <strong>Apple Push Notification Service</strong> — optional push notifications
          </li>
        </ul>

        <h2>In-App Purchases</h2>
        <p>
          StockShots offers optional subscriptions processed entirely through Apple's App Store. We
          do not collect or store any payment information.
        </p>

        <h2>Data Sharing</h2>
        <p>
          Your data is not sold, rented, or shared with any third parties for advertising or
          marketing purposes.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          The App is not directed at children under 13 and does not knowingly collect information
          from children under 13.
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
