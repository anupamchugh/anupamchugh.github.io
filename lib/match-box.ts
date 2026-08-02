import type { AppItem, WorkItem } from '@/lib/content';

export const matchBoxApp: AppItem = {
  name: 'Match Box',
  slug: 'match-box',
  description: 'A local macOS companion for reviewing owner-selected visible dating context.',
  href: '/match-box/',
  status: 'building',
  tags: ['macOS', 'privacy', 'on-device'],
  icon: '/apps/match-box-fictional-demo.png',
};

export const matchBoxReviewedProject: WorkItem = {
  name: 'match box',
  description: 'A private, local-first review workspace for selected dating-app context.',
  href: '/match-box/',
  status: 'building',
  tags: ['macOS', 'privacy', 'Foundation Models', 'reviewed 2026'],
};
