import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Find Common Ground',
  description: 'Privacy policy for the Find Common Ground iOS app.',
};

export default function CommonGroundPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="text-sm opacity-60">Last updated: March 21, 2026</p>
        <p>
          This privacy policy describes how <strong>Find Common Ground</strong> ("the App"), built
          by Anupam Chugh, handles your information.
        </p>

        <h2>Location Data</h2>
        <p>
          The App uses your location to discover nearby places, detect visits (optional), and send
          local notifications near saved places (optional). Location data is processed entirely
          on-device and is <strong>never sent to any server</strong>.
        </p>

        <h2>CloudKit</h2>
        <p>
          Vibe Check data — including share codes, route data, and reactions — is stored in Apple's
          iCloud public database via CloudKit. This data is associated with anonymous CloudKit
          record IDs, not your personal Apple ID.
        </p>

        <h2>No Account Required</h2>
        <p>
          The App does not require sign-in or account creation. There is no authentication system
          and no user accounts.
        </p>

        <h2>Third-Party Services</h2>
        <ul>
          <li>
            <strong>Apple MapKit</strong> — place search queries are processed through Apple's
            Maps APIs
          </li>
          <li>
            <strong>Apple CloudKit</strong> — shared Vibe Check data stored in iCloud public
            database
          </li>
        </ul>

        <h2>No Analytics or Advertising</h2>
        <p>
          The App does not include any analytics SDKs, advertising frameworks, or third-party
          tracking.
        </p>

        <h2>Data Storage</h2>
        <p>
          All personal data — saved places, preferences, and match comparisons — is stored locally
          on your device using Apple SwiftData. Match comparisons happen entirely on-device.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          The App does not knowingly collect information from children under 13.
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
