export type WorkKind = 'live' | 'oss' | 'lab' | 'client';

export type WorkItem = {
  kind: WorkKind;
  name: string;
  status: string;
  line: string;
  image?: string;
  alt?: string;
  href?: string;
  cta?: string;
};

export const workKinds: { id: WorkKind | 'all'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'live', label: 'app store' },
  { id: 'oss', label: 'open source' },
  { id: 'lab', label: 'in the lab' },
  { id: 'client', label: 'before alcor' },
];

export const workItems: WorkItem[] = [
  { kind: 'live', name: 'Breakline', status: 'live 1.5', image: '/home/breakline-home.webp', alt: 'Breakline home with surf, skate, golf and tennis', line: 'Surf and gym coach that reads pose from your clips. 1.6 adds a robot replay.', href: 'https://apps.apple.com/us/app/breakline-surf/id6785873182', cta: 'App Store' },
  { kind: 'live', name: 'Wearover', status: '3.0 in review', image: '/showcase/img/wearover-linen-fitted.webp', alt: 'Wearover fitted linen outfit', line: 'A new face, hair or outfit from one photo. Grew out of Best Face Forward.', href: '/showcase/#wearover', cta: 'Demo' },
  { kind: 'live', name: 'Screen Room', status: 'live 1.0', image: '/home/screenroom-home.webp', alt: 'Screen Room home with a featured film', line: 'What to watch, spoiler-safe recaps, and comics of the plot.', href: 'https://getalcor.com/', cta: 'getalcor' },
  { kind: 'live', name: 'Find Common Ground', status: 'live 1.7', image: '/home/orbits-duo.webp', alt: 'Find Common Ground unfolded on iPhone Duo', line: 'Plans a meetup for two people and shows which tools it used.', href: 'https://getalcor.com/', cta: 'getalcor' },
  { kind: 'live', name: 'Feedloom', status: 'live 1.0.4', image: '/home/feedloom-ask.webp', alt: 'Feedloom answering from saved links', line: 'Save links, then ask your feed. Answers cite what you saved.', href: 'https://getalcor.com/', cta: 'getalcor' },
  { kind: 'live', name: 'Quorion Table', status: 'live 1.3', image: '/home/quorion-reveal.webp', alt: 'Quorion telling one player their role', line: 'A storyteller companion for social deduction nights.', href: 'https://getalcor.com/', cta: 'getalcor' },
  { kind: 'live', name: 'Rifflet', status: 'live', image: '/home/rifflet-poster.webp', alt: 'Rifflet hand piano', line: 'Play the piano with your hand in the air. iPhone and Mac.', href: 'https://apps.apple.com/us/app/rifflet/id6767064984', cta: 'App Store' },
  { kind: 'oss', name: 'Trayce', status: 'MIT', image: '/gallery/studio/trayce-01-trip.webp', alt: 'Trayce trip screen', line: 'Trip documents where the newest copy wins, and tray plans for security.', href: 'https://github.com/anupamchugh/trayce', cta: 'GitHub' },
  { kind: 'oss', name: 'Contour Lab', status: 'MIT', image: '/home/contour-3d.webp', alt: 'Contour Lab showing 51 coins as tokens on a 3D table', line: 'Counts coins, leaves and odd shapes with Vision, measures surfboards, and lays the count out in RealityKit.', href: 'https://github.com/anupamchugh/iOS14VisionContourDetection', cta: 'GitHub' },
  { kind: 'oss', name: 'Screen Room Remote', status: 'public', line: 'A Mac app that drives a Fire TV for Screen Room.', href: 'https://github.com/anupamchugh/ScreenRoomRemote', cta: 'GitHub' },
  { kind: 'oss', name: 'Vision hand pose', status: '29 stars', image: '/home/vision-swipe.gif', alt: 'Swiping cards with a hand gesture', line: 'Tinder-style swipes with a hand gesture, from 2020.', href: 'https://github.com/anupamchugh/iOS14VisionHandPose', cta: 'GitHub' },
  { kind: 'oss', name: 'iowncode', status: 'public', image: '/home/pencilkit-mnist.gif', alt: 'A digit drawn with PencilKit and read by Core ML', line: 'Years of iOS, Core ML, Vision and AR experiments, each with a tutorial. One example: draw a digit and Core ML reads it.', href: 'https://github.com/anupamchugh/iowncode', cta: 'GitHub' },
  { kind: 'oss', name: 'VisionCreditScan', status: '29 stars', line: 'Card scanning with Vision rectangle detection and OCR.', href: 'https://github.com/anupamchugh/VisionCreditScan', cta: 'GitHub' },
  { kind: 'lab', name: 'Glint', status: 'in development', image: '/home/glint-island.webp', alt: 'Glint showing a sample trade in the Dynamic Island', line: 'Customizable tools for practicing trading and building better habits. Part of TradeShot.', href: 'https://tradeshot.co/', cta: 'TradeShot' },
  { kind: 'lab', name: 'Pastport', status: 'mac dmg', image: '/home/pastport.webp', alt: 'Pastport answering from Safari history', line: 'Answers from your own Safari history, on the Mac.', href: 'https://github.com/anupamchugh/pastport', cta: 'GitHub' },
  { kind: 'lab', name: 'Folio', status: 'prototype', image: '/home/folio-poster.webp', alt: 'Folio routing a picture to an app', line: 'The on-device model picks which app a picture goes to.' },
  { kind: 'lab', name: 'TaxPacket', status: 'private', line: 'Checks a folder of tax documents on your Mac or iPhone and builds a review packet. It never files, moves money or uploads anything.' },
  { kind: 'lab', name: 'MacItWork', status: '0.1.8', line: 'Macs that check and fix each other, with a signed receipt.', href: 'https://macit.work/', cta: 'macit.work' },
  { kind: 'client', name: 'MOBEY', status: '2015–17', image: '/gallery/mobey/02-customer-home-categories.webp', alt: 'MOBEY customer app with five kinds of delivery', line: 'Customer and driver apps for a Gold Coast company delivering alcohol, flowers and more. Built remotely.', href: '/work/gallery/#mobey', cta: 'Gallery' },
  { kind: 'client', name: 'Agricx', status: '2019', image: '/gallery/agricx/agricx-inspection-poster.webp', alt: 'Agricx inspection report', line: 'Crop inspection on iOS and Android: count, size and grade a sample.', href: '/work/gallery/#agricx', cta: 'Recording' },
  { kind: 'client', name: 'Aged Care Decisions', status: '2020–21', line: 'White-label iOS and Android apps for families choosing aged and dementia care.' },
  { kind: 'client', name: 'JournalDev', status: '2015–18', image: '/screenshots/career-journey/journaldev-playstore.png', alt: 'JournalDev on the Play Store', line: 'The Android app: 4.4 stars, 10K+ downloads.', href: '/work/gallery/#journaldev', cta: 'Gallery' },
  { kind: 'client', name: 'Better Publishing', status: '2021–23', image: '/home/bp-preview.webp', alt: 'Better Publishing redrawn from its source code', line: "Zack Shapiro's editors' app, which I modified for Better Programming's writer outreach." },
  { kind: 'client', name: 'MediumRSS', status: '2023', image: '/home/mediumrss-by-tag.webp', alt: 'MediumRSS posts grouped by topic, sample data', line: 'My SwiftUI tool for Better Programming: each day\'s posts across 100+ Medium topics, grouped by topic, author or reading time, to find writers. Shown with sample data.' },
  { kind: 'lab', name: 'Scout', status: 'iOS 27 · Mac', image: '/scout/01-today.jpg', alt: 'Scout deck of ranked writers, fictional demo data', line: 'MediumRSS grown into a curation desk for any open feed: code ranks, the on-device model writes why, and four agents draft the issue.', href: '/posts/scout-code-ranks-apple-intelligence-explains/', cta: 'Post' },
  { kind: 'client', name: 'Dourier', status: 'first app', line: 'A courier MVP built with friends.' },
];
