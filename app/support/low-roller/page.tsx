import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support — Low Roller',
  description: 'Get help with the Low Roller iOS app.',
};

export default function LowRollerSupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Low Roller Support</h1>
        <p>Need help with the app? Here are answers to common questions.</p>

        <p>
          <strong>If trading is affecting your sleep, money or relationships,</strong> please talk to
          someone. Tele-MANAS, the Government of India's free mental health helpline, answers any time
          on <a href="tel:14416">14416</a>. In an emergency, call <a href="tel:112">112</a>.
        </p>

        <h2>Which trade files can I upload?</h2>
        <p>
          CSV exports from any broker work best. PDF contract notes and screenshots also work on
          iPhones with Apple Intelligence. You always see a preview to check before anything is saved.
        </p>

        <h2>How do I export from my broker?</h2>
        <ul>
          <li><strong>Zerodha:</strong> Console › Reports › Tradebook, pick the segment and dates, download the CSV.</li>
          <li><strong>Groww:</strong> download your order history or trade report; if it's Excel, export it as CSV first.</li>
          <li><strong>Alpaca:</strong> download your account activity (fills) as a CSV.</li>
        </ul>

        <h2>My PDF asks for a password</h2>
        <p>
          Contract notes are usually locked with your PAN. The app uses the password once to open the
          file and never saves it.
        </p>

        <h2>Why won't the coach tell me what to buy?</h2>
        <p>
          That's on purpose. Low Roller is a coach, not a tipster. It helps you size trades, notice
          habits and learn the ideas, so your decisions are calmer and yours.
        </p>

        <h2>What is "simple coach mode"?</h2>
        <p>
          The full coach needs Apple Intelligence turned on, on a supported iPhone. Without it, the
          coach gives shorter fixed replies; everything else works.
        </p>

        <h2>Can I use Siri?</h2>
        <p>Say "Pause my trading in Low Roller" or "How big can my trade be in Low Roller".</p>

        <h2>My purchase didn't go through</h2>
        <p>
          Open the Pro screen and tap Restore Purchases. Manage or cancel in Settings › your name ›
          Subscriptions. Refunds are requested from Apple at{' '}
          <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>.
        </p>

        <h2>How do I delete my data?</h2>
        <p>
          Everything stays on your iPhone. Open Coach › Settings › Delete all my data. See the{' '}
          <a href="/privacy/low-roller/">privacy policy</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Still need help? Email{' '}
          <a href="mailto:anupam.chugh@gmail.com">anupam.chugh@gmail.com</a>. Please describe what went
          wrong instead of sending your trade files.
        </p>
      </div>
    </div>
  );
}
