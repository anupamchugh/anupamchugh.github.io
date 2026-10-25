import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support — EchoHunt Music',
  description: 'Get help with the EchoHunt Music iOS app.',
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>EchoHunt Music Support</h1>
        <p>
          Need help with the app? Here are answers to common questions.
        </p>

        <h2>How do I generate a playlist?</h2>
        <p>
          Open the AI tab, type a mood or description (like "rainy Sunday morning"), and
          tap Generate Playlist. The AI will find 20 matching songs from Apple Music.
        </p>

        <h2>Do I need an Apple Music subscription?</h2>
        <p>
          You need an Apple Music subscription for full playback. You can generate playlists
          and browse songs without one, but playback will be limited to previews.
        </p>

        <h2>What is BYOK mode?</h2>
        <p>
          Bring Your Own Key lets you use your own Anthropic (Claude) API key for unlimited
          playlist generations without purchasing credits. Go to Settings &gt; API Key to set it up.
        </p>

        <h2>How do credits work?</h2>
        <p>
          Each AI playlist generation uses 1 credit. You get 1 free generation to try the app.
          Sign in with Apple and purchase credit packs for more generations. Credits never expire.
        </p>

        <h2>My purchase didn't go through</h2>
        <p>
          Go to Settings &gt; Restore Purchases to sync your credits. If the issue persists,
          check your Apple ID payment settings and try again.
        </p>

        <h2>Contact</h2>
        <p>
          Still need help? Email{' '}
          <a href="mailto:anupam.chugh@gmail.com">anupam.chugh@gmail.com</a> and
          I'll get back to you within 24 hours.
        </p>
      </div>
    </div>
  );
}
