import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Flyleaf Notes',
  description: 'Privacy policy for the Flyleaf Notes app on iPhone, iPad and Mac.',
};

export default function FlyleafPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — Flyleaf Notes</h1>
        <p className="text-sm opacity-60">Last updated: November 10, 2026</p>
        <p>
          Flyleaf Notes, built by Anupam Chugh, is a Markdown reader and notebook for iPhone, iPad
          and Mac. Everything you keep in it stays on your device.
        </p>

        <h2>On your device</h2>
        <ul>
          <li>
            Documents you import, your folders and your reading progress are stored on your device.
            Nothing is synced to iCloud.
          </li>
          <li>
            The Continue Reading widget shows the title and progress of your last document, kept on
            your device.
          </li>
          <li>Siri and Shortcuts actions work with data on your device only.</li>
        </ul>

        <h2>Files</h2>
        <p>
          Flyleaf reads only the files and folders you pick with the system file picker, and writes
          only where you choose to export.
        </p>

        <h2>Network</h2>
        <p>
          Flyleaf makes no network requests of its own and the developer runs no server for it.
          Opening a document&apos;s source link sends you to your browser. On iPhone and iPad, a
          document that includes an image hosted on the web may load that image from its website
          when you open the document; that site then sees an ordinary image request.
        </p>

        <h2>What Flyleaf does not do</h2>
        <p>
          Flyleaf has no account, no in-app purchases, no AI features, no advertising and no
          analytics or tracking SDKs. It asks for no permissions such as camera, photos, contacts or
          location.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about Flyleaf&apos;s privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
