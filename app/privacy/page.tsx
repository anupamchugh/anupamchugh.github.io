import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Anupam Chugh Apps',
  description: 'Privacy policy for apps built by Anupam Chugh.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="text-sm opacity-60">Last updated: July 22, 2026</p>
        <p>
          This privacy policy describes how apps built by Anupam Chugh handle your
          information. Some apps have app-specific sections below.
        </p>

        <h2>Best Face Forward</h2>
        <p>
          Best Face Forward helps you pick a clearer still frame from a Live Photo.
          The app uses Apple Photos, PhotosUI, and Vision frameworks on your device.
        </p>

        <h3>Face Data</h3>
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

        <h3>Face Data Storage and Retention</h3>
        <p>
          Face analysis results are not uploaded to any server and are not stored in a
          remote database. Face analysis values are used only during the current app
          session to show scores and candidate frames. They are discarded when the app
          session ends or when you choose another photo. If you tap Save Frame, the app
          saves only the selected still image to your Photos library at your request.
        </p>

        <h3>Third-Party AI Services</h3>
        <p>
          Best Face Forward does not send photos, videos, face data, prompts, or any
          other personal data to OpenAI, Anthropic, Google, or any other third-party AI
          service. The app does not include analytics SDKs, advertising SDKs, or
          third-party tracking SDKs.
        </p>

        <h3>Photo Library Access</h3>
        <p>
          Best Face Forward uses the system photo picker so you choose the Live Photo
          you want to analyze. The app asks for permission to add to your Photos library
          only when you choose to save a frame.
        </p>

        <h2>Breakline</h2>
        <p>
          Breakline compares surfing photos and videos using Apple Photos, PhotosUI,
          Vision, and AVFoundation on your device. Breakline does not require an
          account and does not collect or upload your photos, videos, Vision results,
          or usage data.
        </p>

        <h3>Photo and Video Access</h3>
        <p>
          You can use Apple's system photo picker to give Breakline only the photos or
          videos you choose. You can also choose Find possible surf media. Breakline
          requests full or limited Photos access only after you start that review, and
          Apple Vision then checks small current-version previews on your device for
          possible surfing or surfboard signals. These suggestions can be wrong, and
          you approve every item before it is added.
        </p>
        <p>
          iCloud downloads are off by default. If you turn them on, Apple's Photos and
          iCloud services may download previews or the current edited photo or trimmed
          video rendition to your device under your Apple account. The developer does
          not receive that media.
        </p>

        <h3>Storage, Retention, and Deletion</h3>
        <p>
          Candidate thumbnails and Vision labels are held locally for review. When you
          approve an item, Breakline creates an owner-only temporary copy of the current
          rendition for local comparison. Breakline deletes those temporary copies when
          you clear or replace them and removes interrupted or stale copies the next time
          the app starts. Breakline does not create a remote database or cloud backup of
          this media.
        </p>
        <p>
          You can stop a review at any time, continue using the system picker without
          library access, limit the Photos available to Breakline, or revoke access in
          iOS Settings. Removing the app deletes its app data under iOS storage rules.
        </p>

        <h3>Third Parties</h3>
        <p>
          Breakline does not send media, Vision results, prompts, or personal data to
          OpenAI, Anthropic, Google, advertising networks, analytics services, or other
          third-party AI services. It does not include advertising or tracking SDKs.
        </p>

        <h2>General Data Sharing</h2>
        <p>
          Unless an app-specific section says otherwise, these apps do not sell personal
          data and do not share personal data with third parties for advertising or
          tracking.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          These apps are not directed at children under 13. We do not knowingly collect
          information from children under 13.
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
