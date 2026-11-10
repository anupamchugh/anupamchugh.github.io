import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Checkmate Academy',
  description: 'Privacy policy for the Checkmate Academy app on iPhone, iPad and Mac.',
};

export default function CheckmateAcademyPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — Checkmate Academy</h1>
        <p className="text-sm opacity-60">Last updated: November 10, 2026</p>
        <p>
          Checkmate Academy, built by Anupam Chugh, teaches chess with lessons, puzzles, games
          against built-in bots and an AI coach. The developer runs no server for it and does not
          receive your games or progress.
        </p>

        <h2>On your device</h2>
        <ul>
          <li>
            Lesson progress, puzzle history, your games and their moves, your rating and streaks,
            and your settings are stored on your device. Nothing is synced to iCloud.
          </li>
          <li>
            The AI coach uses Apple&apos;s on-device model. Your moves and positions are not sent to
            any cloud AI service.
          </li>
          <li>Thumbs up and down on the coach&apos;s explanations are saved on your device only.</li>
          <li>
            A photo you pick in Board Builder is shown only as a reference while you set up the
            board. It is not analyzed or saved.
          </li>
          <li>PGN and opening files you import are read on your device.</li>
        </ul>

        <h2>Your own bot server (optional)</h2>
        <p>
          In Bot Arena you can switch the bot to a server of your own by entering its address and,
          if you want, a token. While that mode is on, Checkmate Academy sends that server the
          board position, whose turn it is, the bot&apos;s style and the difficulty for each bot
          move. The address and token are stored on your device. The developer does not run or see
          that server. The mode is off unless you turn it on.
        </p>

        <h2>Purchases</h2>
        <p>
          Purchases and restores go through Apple&apos;s App Store. Checkmate Academy checks with
          Apple which purchases you have, and never sees your payment details.
        </p>

        <h2>Sharing</h2>
        <p>Games, positions and images leave your device only when you share or copy them.</p>

        <h2>What Checkmate Academy does not do</h2>
        <p>
          Checkmate Academy has no account, no advertising and no analytics or tracking SDKs. It
          asks for no camera, microphone, contacts or location access, and it does not collect
          personal information from anyone, including children.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about Checkmate Academy&apos;s privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
