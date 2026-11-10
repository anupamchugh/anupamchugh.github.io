import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Rifflet',
  description: 'Privacy policy for the Rifflet app on iPhone, iPad, Apple Watch, Mac and Apple Vision Pro.',
};

export default function RiffletPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — Rifflet</h1>
        <p className="text-sm opacity-60">Last updated: November 10, 2026</p>
        <p>
          Rifflet, built by Anupam Chugh, turns a short music idea into a riff you can learn on
          piano, guitar or ukulele. Rifflet sends nothing on its own. If you give an Ask Coach
          answer a thumbs down and choose to send a report, the conversation you keep in it (your
          question, the coach&apos;s instructions and answer) goes by email to
          chughdeveloper@gmail.com, or wherever you share it. Thumbs counts stay on your device.
        </p>

        <h2>On your device</h2>
        <ul>
          <li>Your riffs, saved songs and settings are stored on your device.</li>
          <li>
            The coach&apos;s tips are written by Apple&apos;s on-device model. Rifflet calls no
            cloud AI service.
          </li>
          <li>
            The widget, Live Activity and Apple Watch app show a summary of your practice, kept on
            your device.
          </li>
        </ul>

        <h2>Camera</h2>
        <p>
          On iPhone and iPad, the camera is used only when you turn on Hand page turns. Your hand
          position is read on the device with Apple Vision. Video is not recorded or sent anywhere.
        </p>

        <h2>Apple Vision Pro</h2>
        <ul>
          <li>Hand tracking lets you touch the virtual piano keys.</li>
          <li>World sensing anchors the piano in your room.</li>
          <li>
            The microphone is used only while Jam with the Radio is on. Pitch is worked out on the
            device and nothing is recorded or stored. The setting turns off each time the app
            starts.
          </li>
          <li>
            If you turn on Track as Mindfulness, practice time is saved to Apple Health as mindful
            sessions.
          </li>
          <li>
            If you turn on SharePlay, the notes you play (note number and loudness) are sent to the
            people in your SharePlay session through Apple.
          </li>
        </ul>

        <h2>Sharing</h2>
        <p>
          Riffs and files leave your device only when you share them. On Mac, the Help menu opens
          Rifflet&apos;s page on GitHub in your browser.
        </p>

        <h2>What Rifflet does not do</h2>
        <p>
          Rifflet has no account, no in-app purchases, no advertising and no analytics or tracking
          SDKs. It does not read your contacts, location, photos or messages.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about Rifflet&apos;s privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
