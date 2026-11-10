import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Ticknote',
  description: 'Privacy policy for the Ticknote iPhone app.',
};

export default function TicknotePrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — Ticknote</h1>
        <p className="text-sm opacity-60">Last updated: November 10, 2026</p>
        <p>
          Ticknote is an iPhone app, built by Anupam Chugh, for reading Indian (NSE) and crypto
          markets in plain words. It never places, changes or cancels orders. This page says what
          Ticknote keeps on your iPhone and what it sends.
        </p>

        <h2>What stays on your iPhone</h2>
        <ul>
          <li>
            Your chat history, watchlist, saved screeners, pins, message template and settings are
            stored on your iPhone.
          </li>
          <li>
            Up to five contacts you save (a name and a number) are kept in the iPhone Keychain, on
            this device only.
          </li>
          <li>
            Bank statements you add in Money are read on your iPhone and never uploaded. Their rows
            are held only while you use them. A statement handed over by a shortcut waits in a
            protected folder until you import or cancel it, and is then deleted. Spending goals are
            saved as a category and a limit.
          </li>
          <li>
            Ticknote uses Apple&apos;s on-device model for chat, the screener and Money questions.
            The app itself calls no other AI service.
          </li>
          <li>
            Crash and hang counts from Apple&apos;s MetricKit, and your thumbs-up and thumbs-down
            counts, stay on your iPhone.
          </li>
        </ul>

        <h2>Glint sign-in, and what it sends</h2>
        <p>
          Signing in is optional. Ticknote&apos;s market data comes from Glint Cloud, a service the
          developer runs at tradeshot.co. You sign in by confirming a code on tradeshot.co in
          Safari, and Ticknote keeps the session on your iPhone. While you are signed in, Ticknote
          sends Glint Cloud:
        </p>
        <ul>
          <li>the questions you type in chat, which Glint Cloud answers;</li>
          <li>the instruments, charts, option chains, scans and alerts you ask for;</li>
          <li>
            your message template, and messages you review and send to the WhatsApp number paired
            with your Glint account;
          </li>
          <li>
            a Live Activity push token and the app&apos;s identifier, so the market Live Activity
            can update during NSE hours.
          </li>
        </ul>
        <p>If you do not sign in, none of this is sent.</p>

        <h2>Live crypto prices</h2>
        <p>
          For live BTC, ETH and PAXG prices, Ticknote connects to Binance&apos;s public price
          stream. It sends only those symbols, with no account or key. Binance can see your IP
          address, as with any connection.
        </p>

        <h2>Notifications and messages</h2>
        <ul>
          <li>
            Ticknote asks before showing notifications, and only uses them for local alerts on
            conditions you set.
          </li>
          <li>
            A text to a saved contact opens Apple&apos;s Messages sheet with the number and text
            filled in. Nothing is sent until you tap Send.
          </li>
        </ul>

        <h2>Reports you choose to send</h2>
        <p>
          Report a problem drafts an email to chughdeveloper@gmail.com that you review and send in
          Mail, or lets you copy or share the report instead. It adds the app version, system
          version and device model. Report this answer can also attach the conversation you kept
          switched on and Apple&apos;s model feedback file, but only after you tap Continue and send
          it yourself.
        </p>

        <h2>What Ticknote does not do</h2>
        <p>
          Ticknote has no advertising, no analytics or tracking SDKs and no in-app purchases. It
          does not use your location and does not read your contacts. It does not sell your data.
        </p>

        <h2>Your data on Glint Cloud</h2>
        <p>
          To ask what Glint Cloud holds for your account, or to have it deleted, email the address
          below.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about Ticknote&apos;s privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
