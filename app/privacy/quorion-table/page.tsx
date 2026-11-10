import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Quorion Table',
  description: 'Privacy policy for the Quorion Table iPhone and iPad app.',
};

export default function QuorionTablePrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — Quorion Table</h1>
        <p className="text-sm opacity-60">Last updated: November 10, 2026</p>
        <p>
          Quorion Table, built by Anupam Chugh, is a companion for in-person social deduction game
          nights on iPhone and iPad: it seats the table, deals characters privately and keeps the
          game moving. The developer runs no server for it and does not receive your game data.
        </p>

        <h2>On your device</h2>
        <ul>
          <li>
            Game history (players, characters, results and events), player groups with their notes,
            custom content and storyteller notes are stored on your device. Nothing is synced to
            iCloud.
          </li>
          <li>
            The Solo table bots, casting, recaps and Storyteller Studio use Apple&apos;s on-device
            model. What you type there, and player names and notes, go only to that on-device
            model. Quorion Table calls no cloud AI service.
          </li>
          <li>Siri and Shortcuts actions work with data on your device only.</li>
        </ul>

        <h2>Playing with nearby phones</h2>
        <p>
          When you host a table or join one, Quorion Table connects to nearby devices over your
          local network or Bluetooth, encrypted, without a server. It shares your device&apos;s
          name, the table code and the game: player names, characters, votes and table chat. iOS
          asks your permission before this is used.
        </p>
        <p>
          If someone starts a SharePlay session with you, the same game information is shared with
          the people in that session through Apple&apos;s SharePlay service.
        </p>

        <h2>Other network use</h2>
        <ul>
          <li>
            When you open the Table tab, the app checks a placeholder address on example.com for
            rule updates. The request carries no game or personal data, but that site can see your
            IP address. This leftover check will be removed.
          </li>
          <li>
            The rules link for Night of the Ninja opens the publisher&apos;s rulebook in your
            browser when you tap it.
          </li>
          <li>Invite and App Store links leave your device only when you share them.</li>
        </ul>

        <h2>What Quorion Table does not do</h2>
        <p>
          Quorion Table has no account, no in-app purchases, no advertising and no analytics or
          tracking SDKs. It asks for no camera, microphone, photos, contacts or location access.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about Quorion Table&apos;s privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
