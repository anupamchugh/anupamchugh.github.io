import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Low Roller',
  description: 'Privacy policy for the Low Roller iOS app.',
  robots: { index: false, follow: false },
};

export default function LowRollerPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="text-sm opacity-60">Effective date: November 3, 2026</p>
        <p>
          This privacy policy describes how <strong>Low Roller</strong> ("the App"), built by Anupam
          Chugh, handles your information.
        </p>
        <p>
          <strong>In short:</strong> the App doesn't collect your data. Your trades, rules, chats and
          progress stay on your iPhone. There is no account system and no server that receives them.
        </p>

        <h2>What Stays on Your Device</h2>
        <ul>
          <li>
            <strong>Trade files you upload</strong> (CSV, PDF or screenshots) are read on your iPhone.
            The fills you confirm are saved in the App's private storage, protected by iOS file
            encryption. The original file isn't kept.
          </li>
          <li>
            <strong>PDF passwords</strong> are used once to open the file and are never saved.
          </li>
          <li>
            <strong>Your rules, learner level, lesson progress and pauses</strong> are saved in the same
            private storage.
          </li>
          <li>
            <strong>Coach conversations</strong> are processed by Apple Intelligence on your device and
            are not saved after you start a new conversation or close the App.
          </li>
        </ul>

        <h2>Data Collection</h2>
        <p>
          None. The App contains no analytics, advertising or tracking code, and it does not send your
          data to me or to anyone else.
        </p>

        <h2>In-App Purchases</h2>
        <p>
          Low Roller Pro is a subscription processed entirely through Apple's App Store. I do not
          collect or store any payment information.
        </p>

        <h2>Crash Reports</h2>
        <p>
          If you choose to share analytics with app developers in your iPhone's settings, Apple may
          provide anonymous crash reports. They don't include your trades or chats.
        </p>

        <h2>Deleting Your Data</h2>
        <p>
          In the App, open Coach › Settings › Delete all my data. Deleting the App also removes
          everything it stored.
        </p>

        <h2>Children's Privacy</h2>
        <p>The App is meant for adults and is not directed at children under 18.</p>

        <h2>Changes</h2>
        <p>
          If this policy changes, this page and its effective date will be updated. If the App ever
          starts collecting data, it will say so here and on the App Store first.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href="mailto:anupam.chugh@gmail.com">anupam.chugh@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
