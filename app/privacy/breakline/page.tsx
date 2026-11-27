import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Breakline',
  description: 'Privacy policy for the Breakline app on iPhone, iPad and Mac.',
};

export default function BreaklinePrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — Breakline</h1>
        <p className="text-sm opacity-60">Last updated: November 27, 2026</p>
        <p>
          Breakline, built by Anupam Chugh, reads visible body position from your own sports,
          dance, gym and meal photos and clips on your device. Breakline sends nothing on its own.
          If you give a model answer a thumbs down and choose to send a report, only the parts you
          keep enabled in the report sheet leave your device when you send the email to
          chughdeveloper@gmail.com or share them.
        </p>

        <h2>On your device</h2>
        <ul>
          <li>
            Pose detection, ball-path tracking, beat splitting, robot replay, gym set history and
            meal plans all run and stay on your device.
          </li>
          <li>
            On devices with Apple Intelligence enabled, text answers are worded by Apple&apos;s
            on-device Foundation Models from measured values. Breakline calls no cloud AI service.
          </li>
          <li>
            The Shot Readings Home Screen widget reads only the local summary stored in the app
            group on your device.
          </li>
        </ul>

        <h2>Camera, microphone and Photos</h2>
        <ul>
          <li>
            <strong>Camera:</strong> used only when you practice a land drill, record a shot or
            dance clip, or photograph a meal. Recordings and meal photos stay on your device.
          </li>
          <li>
            <strong>Microphone:</strong> used only because the iPhone camera saves video with audio
            when you record a shot or dance clip. Audio is never uploaded.
          </li>
          <li>
            <strong>Photos:</strong> Breakline reviews your Photos library only if you tap Find
            possible surf media and grant permission, and saves robot replay or dance videos to
            Photos only when you tap Save.
          </li>
        </ul>

        <h2>What Breakline does not do</h2>
        <p>
          Breakline has no account, no advertising and no analytics or tracking SDKs. Readings
          describe visible body position only; Breakline does not score technique, identify people
          or give medical advice.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about Breakline&apos;s privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
