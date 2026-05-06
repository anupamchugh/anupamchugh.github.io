import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Face Forward Privacy Policy',
  description: 'Privacy policy for the Best Face Forward iOS app.',
};

export default function BestFaceForwardPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Best Face Forward Privacy Policy</h1>
        <p className="text-sm opacity-60">Last updated: May 6, 2026</p>

        <p>
          Best Face Forward helps you pick a clearer still frame from a Live Photo.
          The app uses Apple Photos, PhotosUI, and Vision frameworks on your device.
        </p>

        <h2>Face Data</h2>
        <p>
          Best Face Forward does not collect face data. When you choose a Live Photo,
          the app processes the selected photo and paired video locally on your device
          using Apple Vision face detection and face capture quality APIs. The app may
          temporarily calculate face count, face bounding boxes, and face capture
          quality scores in memory so it can rank candidate frames.
        </p>
        <p>
          Best Face Forward does not identify people, does not perform face
          recognition, does not create face templates, does not compare faces across
          photos, and does not use face data for advertising, tracking, profiling, or
          analytics.
        </p>

        <h2>Face Data Storage and Retention</h2>
        <p>
          Face analysis results are not uploaded to any server and are not stored in a
          remote database. Face analysis values are used only during the current app
          session to show scores and candidate frames. They are discarded when the app
          session ends or when you choose another photo. If you tap Save Frame, the app
          saves only the selected still image to your Photos library at your request.
        </p>

        <h2>Third-Party AI Services</h2>
        <p>
          Best Face Forward does not send photos, videos, face data, prompts, or any
          other personal data to OpenAI, Anthropic, Google, or any other third-party AI
          service. The app does not include analytics SDKs, advertising SDKs, or
          third-party tracking SDKs.
        </p>
        <p>
          The app may optionally use an on-device Core ML model to explain why the
          selected frame looks strongest. That model runs locally on your device.
          Photos, videos, face analysis values, and prompts are not sent to the model
          provider or to any server.
        </p>

        <h2>Photo Library Access</h2>
        <p>
          Best Face Forward uses the system photo picker so you choose the Live Photo
          you want to analyze. The app asks for permission to add to your Photos library
          only when you choose to save a frame.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Best Face Forward is not directed at children under 13. We do not knowingly
          collect information from children under 13.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{' '}
          <a href="mailto:anupam.chugh@gmail.com">anupam.chugh@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
