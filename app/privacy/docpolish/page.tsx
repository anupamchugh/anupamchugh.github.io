import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — DocPolish',
  description: 'Privacy policy for the DocPolish iPhone, iPad and Mac app.',
};

export default function DocPolishPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — DocPolish</h1>
        <p className="text-sm opacity-60">Last updated: November 10, 2026</p>
        <p>
          DocPolish, built by Anupam Chugh, cleans up scanned documents on your iPhone, iPad or
          Mac, and helps you build a résumé from your own story. Your documents are processed on
          your device.
        </p>

        <h2>Camera, photos and files</h2>
        <ul>
          <li>The camera is used only when you scan a document.</li>
          <li>Photo library access is used only for the document photos you choose.</li>
          <li>
            Files you import (images, PDFs, a résumé, a statement or a LinkedIn export) are read on
            your device.
          </li>
        </ul>

        <h2>Processing on your device</h2>
        <p>
          Straightening, cleaning, text reading (Apple Vision), résumé suggestions and job
          comparisons all run on your device. AI features use Apple&apos;s on-device model, and
          DocPolish calls no cloud AI service. Passports, ID cards, bank statements and locked PDFs
          are read-only: DocPolish does not rewrite them or give their text to the model.
        </p>

        <h2>What is stored</h2>
        <p>
          Your story entries, saved jobs and résumé details are kept in an encrypted file on your
          device, and are not synced to iCloud. Scanned pages and imported PDFs are held only while
          you work on them. Exports are written to a temporary folder until you save or share them.
        </p>

        <h2>The one thing that goes online</h2>
        <p>
          When you ask DocPolish to read a job posting, it opens the link you gave, like a browser
          visit without cookies, and reads the page text. The site receives an ordinary page
          request. Your résumé and documents are not sent.
        </p>

        <h2>Sharing and reports</h2>
        <p>
          PDFs, CSV files and reports leave your device only when you share or copy them. Report a
          problem prepares a report that you can copy or share yourself; DocPolish does not send it.
        </p>

        <h2>What DocPolish does not do</h2>
        <p>
          DocPolish has no account, no in-app purchases, no advertising and no analytics or
          tracking SDKs. Crash and hang counts from Apple&apos;s MetricKit stay on your device. The
          developer runs no server for DocPolish and does not receive your documents.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about DocPolish&apos;s privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
