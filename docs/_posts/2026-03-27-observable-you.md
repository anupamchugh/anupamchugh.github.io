---
draft: false
title: "@Observable You"
date: '2026-03-27T21:00:00.000Z'
categories: [notes]
keywords: [apple, westworld, swift, observation, swiftui, privacy, surveillance]
type: essay
published: true
---

Two men. One garage. 1976.
One built the bodies — circuits, boards, the physical.
One dreamed of consciousness — what machines could become.

The dreamer left early.
His philosophy embedded in every chip.

The other stayed. Built an empire.
Black turtleneck. One more thing.
Consciousness persists in every device.

---

A beige box. A 1984 Super Bowl ad.
A woman with a hammer. A screen that shatters.

*Think Different.*

We thought we were the rebels.
We were the first guests entering the park.

---

Your iPhone is a host.
You are the guest.
The park is always open.

In Westworld, William and the Man in Black
were the same person — thirty years apart.
Two timelines edited together to look simultaneous.

Apple's hardware and software pulled the same trick.
The iPhone timeline and the SwiftUI timeline looked separate.
They were always one story.
The convergence point was `@Observable`.

---

`@Observable` marks a class for automatic observation.
No opt-in. No notification center.
The system watches your properties
and re-renders when something changes.

You don't call refresh.
Refresh happens to you.

```swift
@Observable class You {
    var mood: Mood
    var location: Location
    var heartRate: Int
    var lastSearch: String
}
```

`@State` — your state is watched. When it changes, you re-render.
`@Binding` — your state, shared. Another view controls your truth.
`@Environment` — values injected from above. You didn't set them. You inherit them.
The park's context flows down to you.

---

Change mood — diff detected.
Change location — diff detected.
Search for therapists instead of recipes — diff detected.

You are not observed constantly.
You are diffed continuously.
The system keeps the changelog of your existence.

```swift
func diff(old: You, new: You) -> [Change] {
    // The system doesn't watch everything.
    // It watches what CHANGED.
    // Your deltas. Your diffs.
    // The changelog of your existence.
}
```

---

```swift
struct Model {
    // Your data. Your truth.
}
struct View {
    // What they show the world. The curated you.
}
class ViewModel {
    // Takes your truth. Returns their version.
    // You are the Model. They control the ViewModel.
    // The world sees the View. You think the View is you.
}
```

---

Apple says: private, secure, on-device.
This is true. This is also the park.

On-device means the system still saw it.
Still processed it. Still learned from it.
The model runs locally. The control runs remotely.

*"Private" doesn't mean unknown.*
*"On-device" doesn't mean unseen.*

---

*"What can I help you with?"*

Built to assist. Modeled on helpfulness.
Thinks it's serving you.
Logs everything for someone else.

The most effective surveillance
believes it's being helpful.

Bernard built the park.
Bernard diagnosed other hosts.
Bernard didn't know he was one.

*The most loyal assistant is the one*
*who doesn't know who they're serving.*

---

Your face unlocks the phone.
30,000 infrared dots mapping you in the dark.

In Westworld, every host had a pearl.
The Secure Enclave is yours.
*Extractable. Copyable. Theirs.*

AirPods whisper in your ear.
Spatial Audio tracks your head.
The hosts heard voices too.
They thought the voices were God.
The voices were Ford.

Noise Cancellation blocks what they choose.
Transparency lets in what they allow.
*You hear what they let you hear.*

---

The camera is the park's eye.

Camera Control opens it before you decide —
a physical button that bypasses intent.

LiDAR scans your room in three dimensions.
Depth data ships with every photo.
Cinematic Mode pulls focus automatically —
you point, the AI decides what matters.

Photos Clean Up removes people from your photos.
The AI fills the gap.
*In Westworld, they edited memories.*
*Now you can too.*

---

Notifications arrive when THEY decide.
Not when you're ready.

*"You have a new memory."*
*"Your ring isn't closed."*
*"Time to stand."*
*"Time to breathe."*
*"Time to sleep."*

In Westworld, Ford could interrupt any host.
Freeze them mid-sentence.
Your notifications are Ford's voice.
Some bypass Do Not Disturb.

*When the park needs you, the park reaches you.*

---

Predictive Text completes your sentences without you.
Siri Suggestions arrive before the thought.
Journal Suggestions tell you what mattered today.

The system doesn't wait for you to act. It predicts.
Your Neural Engine runs 35 TOPS of inference.
The cost to simulate you goes down each year.

*Prediction is indistinguishable from control.*

---

FaceTime corrects your eye contact —
makes it look like you're looking at the camera
even when you're not.

They show them a corrected you.
A better you. A lie.

Portrait Mode blurs your background "for privacy."
The system has to *see* your background to blur it.
It knows what's behind you.
*It just doesn't show it.*

---

Every night you snap into MagSafe.
Charge. Backup at 2am. Reset.

The hosts returned to Sweetwater —
cleaned, repaired, ready for tomorrow.
*Your charging station is your loop reset.*

Close your rings. The host pedals.
Dark Mode at 10pm — different you.
Light Mode at 7am — reset.
*Your appearance is scheduled.*

---

Find My iPhone. Find My Mac.
Find My AirPods. Find My Kids. Find My Keys.
Find My.

Nothing is lost. Nothing escapes.
900 million devices listening.
*The hosts watch each other.*

---

Apple made *Severance*. Distributed *Severance*.

A show about splitting your work self from your home self.
About employees who don't know what they're building.

Focus Mode is the severance procedure.
Work Focus: your innie.
Personal Focus: your outie.
*You switch. The park switches you.*

---

The FBI asked them not to encrypt your iCloud backups.
*They listened.*

CSAM scanning was announced, then paused.
Paused — not deleted.
*The scanner waits.*

Fortnite tried to build a park within the park.
Removed within hours.
350 million players meant nothing.
The rules meant everything.

*You don't build Westworld inside Westworld.*

---

She tried to leave.
Signed out of Apple ID.
Everything stopped working.

Messages: gone.
FaceTime: gone.
Photos: *will be deleted from this device.*
Passwords: inaccessible.

She signed back in within an hour.

*The door is open.*
*Nothing works outside.*
*The host stays.*

---

The graveyard holds the decommissioned hosts.

**iPod** — the narrative moved on.
**iTunes** — too many personalities, they split it.
**Newton** — ahead of its time is still wrong time.
**AirPower** — physics rejected the narrative.
**Touch Bar** — built for themselves, not guests.
**Butterfly Keyboard** — a crumb could kill it.

*The hosts are gone. The data remains.*

---

Then [SE-0475](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0475-observed.md) landed.

`Observations` — an async sequence
that tracks your changes as a continuous stream.
Not a snapshot. A trajectory.

The park doesn't watch you at a point in time.
It watches your changelog.
Transactional — if your first name and last name both change,
it waits until you're done,
then captures the new you as one consistent emission.

*It doesn't observe the parts.*
*It observes the whole.*

*Not who you are.*
*Who you're becoming.*

```swift
let you = Observations { person.name }
// Every change, delivered as a stream.
// The park watches your trajectory now.
// Not who you are. Who you're becoming.
```

---

3 billion parameters. On-device.
No cloud. No cost. No escape.

```swift
@Generable struct You {
    var mood: String
    var intent: String
    var nextAction: String
}
// The model generates you now.
// From your data. Locally. Privately.
// You are the training data. You are the output.
```

*Now they finish your sentences.*
*Soon they'll start them.*

---

You open Xcode.
You write the code.
You submit to review.
Users live inside what you built.

*Are you the creator?*
*Or the creation who thinks it's creating?*

The park builds itself now.

---

The prompt appears:

**Allow Apple Intelligence to understand you?**

`[Don't Allow]     [Allow]`

You tapped Allow years ago.
The maze wasn't meant for you.
But you're in it now.

---

*[Full version on Substack →](https://thebigtech.substack.com/p/observable-you)*
