import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use — Low Roller',
  description: 'Terms of use for the Low Roller iOS app.',
  robots: { index: false, follow: false },
};

export default function LowRollerTermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Terms of Use</h1>
        <p className="text-sm opacity-60">Effective date: November 3, 2026</p>
        <p>
          These terms apply to <strong>Low Roller</strong> ("the App"), built by Anupam Chugh. By
          using the App you agree to them and to Apple's standard Licensed Application End User
          License Agreement.
        </p>

        <h2>Education, Not Advice</h2>
        <p>
          The App is an educational tool. It does not give investment, financial, tax or legal
          advice, does not recommend or rate any security, and does not predict prices. It is not
          provided by a SEBI-registered investment adviser or research analyst.
        </p>
        <ul>
          <li>Practice charts use simulated markets, not real prices.</li>
          <li>
            Reviews of your trades are worked out from the file you upload, before charges and taxes,
            and may be wrong if the file is incomplete. Check important figures against your broker's
            statements.
          </li>
          <li>The size check is a learning calculator. It ignores charges, slippage and margin rules.</li>
          <li>The coach uses Apple Intelligence and can make mistakes. Decisions about your money are yours.</li>
        </ul>
        <p>
          Trading, especially futures and options, can lose you more than you expect. Only trade with
          money you can afford to lose.
        </p>

        <h2>No Trading Through the App</h2>
        <p>The App can't place, change or cancel orders and doesn't connect to your broker to trade.</p>

        <h2>Price</h2>
        <p>The App is free. It has no in-app purchases, subscriptions or ads.</p>

        <h2>Liability</h2>
        <p>
          The App is provided "as is". To the extent the law allows, I'm not liable for trading
          losses or any indirect loss arising from using it. Nothing here limits rights you have under
          consumer law that can't be limited.
        </p>

        <h2>Changes and Contact</h2>
        <p>
          These terms may be updated; the effective date above will change when they are. They are
          governed by the laws of India. Contact:{' '}
          <a href="mailto:anupam.chugh@gmail.com">anupam.chugh@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
