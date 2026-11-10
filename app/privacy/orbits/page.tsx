import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Orbits: Find Common Ground',
  description: 'Privacy policy for the Orbits iPhone app.',
};

export default function OrbitsPrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <h1>Privacy Policy — Orbits</h1>
        <p className="text-sm opacity-60">Last updated: November 10, 2026</p>
        <p>
          Orbits (on the App Store as Orbits: Find Common Ground), built by Anupam Chugh, turns
          your saved places into a plan for a day out, a trip or a meetup. You review every plan
          before you save, share or open it. The developer runs no server for Orbits and does not
          receive your places or plans.
        </p>

        <h2>On your device</h2>
        <ul>
          <li>
            Saved places, plans, chat history and service requests are stored on your device, and
            are not synced to iCloud.
          </li>
          <li>
            Plans are written by Apple&apos;s on-device model. Orbits calls no cloud AI service.
          </li>
          <li>
            A screenshot you pick to find a place is read on your device with Apple Vision.
          </li>
          <li>Place names are added to Spotlight on your device so you can search for them.</li>
        </ul>

        <h2>Location</h2>
        <p>
          With your permission, Orbits uses your location while you use the app, to search near
          you and get the weather for a plan. It does not track your location in the background.
          Optional reminders near saved places are local notifications that iOS shows when you
          arrive; the location check happens on your device.
        </p>

        <h2>Apple services</h2>
        <ul>
          <li>
            <strong>Apple Maps:</strong> place searches, routes, Look Around and addresses are
            looked up through Apple Maps, with your search text and your area or a place&apos;s
            location.
          </li>
          <li>
            <strong>Apple Weather:</strong> the location of a plan is sent to get its forecast.
          </li>
          <li>
            <strong>Calendar:</strong> Orbits asks to add events only, and adds a plan only when
            you approve it.
          </li>
        </ul>
        <p>
          You can switch Maps search, routes and weather off for a plan in Tools for this plan.
        </p>

        <h2>Google lists you import</h2>
        <p>
          If you paste a link to a Google Maps saved list, Orbits fetches that list from Google to
          import its places. Google receives that request. Nothing is sent to Google otherwise.
        </p>

        <h2>Photos and contacts</h2>
        <p>
          Photos and contacts are chosen with Apple&apos;s pickers, so Orbits sees only what you
          pick. A contact you add to a service request (name and phone number) is saved with that
          request on your device.
        </p>

        <h2>Sharing</h2>
        <p>
          When you share a plan, Orbits builds a link that holds the places, addresses and their
          locations, and hands it to the share sheet, Messages or Mail. It goes only where you send
          it. Opening a stop in Apple Maps or Uber passes that stop&apos;s name and location to the
          app you chose.
        </p>

        <h2>Nearby</h2>
        <p>
          Orbits includes a Nearby feature that is off by default. When it is on, it uses your local
          network to show nearby Orbits users your device name, your top three place categories and
          your latest check-in, without a server.
        </p>

        <h2>Earlier versions</h2>
        <p>
          Earlier versions of Orbits could publish a shared Vibe Check to Apple&apos;s public
          iCloud database. This version does not publish anything there. To have an old shared
          record removed, email the address below.
        </p>

        <h2>What Orbits does not do</h2>
        <p>
          Orbits has no account, no in-app purchases, no advertising and no analytics or tracking
          SDKs, and it does not sell your data.
        </p>

        <h2>Changes</h2>
        <p>Changes to this policy will be posted on this page with a new date.</p>

        <h2>Contact</h2>
        <p>
          Questions about Orbits&apos; privacy:{' '}
          <a href="mailto:chughdeveloper@gmail.com">chughdeveloper@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
